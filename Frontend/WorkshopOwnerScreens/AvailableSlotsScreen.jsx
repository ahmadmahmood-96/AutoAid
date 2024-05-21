import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
  Alert,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { decode } from "base-64";
import { Feather } from "@expo/vector-icons"; // Import the Feather icon from expo/vector-icons

global.atob = decode;
const baseUrl = process.env.BASE_URL;

export default function AvailableSlotsScreen() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwtDecode(token);
      // Make API call to fetch slots data
      const response = await axios.get(
        `${baseUrl}workshop/get-slots/${decodedToken.user._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Parse date and time strings into Date objects
      const parsedSlots = response.data.slots.map((slot) => {
        const [day, month, year] = slot.date.split("/");
        const [hour, minute, second] = slot.time.split(":");
        return {
          ...slot,
          dateObject: new Date(
            Number(year),
            Number(month) - 1, // Note: Month is zero-based
            Number(day),
            Number(hour),
            Number(minute),
            Number(second)
          ),
        };
      });

      // Filter out slots whose date and time have not passed
      const currentDateTime = new Date();
      const filteredSlots = parsedSlots.filter((slot) => {
        return slot.dateObject > currentDateTime;
      });

      // Sort the filtered slots in ascending order by date and time
      filteredSlots.sort((a, b) => {
        if (a.dateObject.getTime() === b.dateObject.getTime()) {
          const timeA = a.time.split(":").map(Number);
          const timeB = b.time.split(":").map(Number);
          return timeA[0] - timeB[0] || timeA[1] - timeB[1];
        }
        return a.dateObject - b.dateObject;
      });

      // Remove the filtered slots from the database
      for (const slot of response.data.slots) {
        if (
          !filteredSlots.find((filteredSlot) => filteredSlot._id === slot._id)
        ) {
          await axios.delete(`${baseUrl}workshop/remove-slot/${slot._id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        }
      }

      // Set the filtered and sorted slots to state
      setSlots(filteredSlots);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching slots:", error);
      setLoading(false);
    }
  };

  const removeSlot = async (slotId) => {
    const token = await AsyncStorage.getItem("authToken");
    // Show confirmation alert
    Alert.alert(
      "Confirm",
      "Are you sure you want to remove this slot?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              // Make API call to remove slot from the database
              await axios.delete(`${baseUrl}workshop/remove-slot/${slotId}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });

              // Remove slot from UI
              setSlots((prevSlots) =>
                prevSlots.filter((item) => item._id !== slotId)
              );
            } catch (error) {
              console.error("Error removing slot:", error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#00BE00" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {slots.length === 0 ? (
        <View style={styles.centeredContainer}>
          <Text>No slots available.</Text>
        </View>
      ) : (
        <View style={styles.box}>
          <FlatList
            data={slots}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.slotItem}>
                <View style={styles.rowContainer}>
                  <Image
                    source={require("../assets/time.png")}
                    style={styles.image}
                  />
                  <View style={styles.columnContainer}>
                    <Text>Date</Text>
                    <Text style={styles.textItem}>{item.date}</Text>
                    <Text>Time</Text>
                    <Text style={styles.textItem}>
                      {item.time.split(":").slice(0, 2).join(":")}
                    </Text>
                  </View>
                </View>
                {/* Add delete button */}
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeSlot(item._id)}
                >
                  <Feather name="trash-2" size={24} color="#f23e3e" />
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f3f3",
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  box: {
    marginTop: 50,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  columnContainer: {
    flexDirection: "column",
    width: "70%",
    justifyContent: "center",
    marginTop: 18,
  },
  slotItem: {
    backgroundColor: "#f7f7f7",
    borderColor: "#00BE00",
    borderRadius: 10,
    paddingHorizontal: 35,
    paddingVertical: 10,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderLeftWidth: 4,
    flexDirection: "row", // Added flexDirection to align items in a row
    alignItems: "center", // Align items in the center vertically
  },
  textItem: {
    marginBottom: 10,
    fontSize: 17,
    fontWeight: "500",
  },
  image: {
    width: 48, // Adjust the width as needed
    height: 48, // Adjust the height as needed
  },
  removeButton: {
    marginLeft: 10,
  },
});
