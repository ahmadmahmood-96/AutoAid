import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { decode } from "base-64";

global.atob = decode;
const baseUrl = process.env.BASE_URL;

export default function AppointmentScreen({ navigation, route }) {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noAppointments, setNoAppointments] = useState(false);
  const [appointment, setAppointments] = useState(null);
  const { workshopId } = route.params; // Access workshopId from route.params

  useEffect(() => {
    fetchSlots();
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwtDecode(token);

      const response = await axios.get(
        `${baseUrl}workshop/get-appointment/${decodedToken.user._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        setNoAppointments(true);
      } else {
        const userAppointments = response.data.appointments;
        setAppointments(userAppointments);
      }

      setLoading(false);
      // You can update the state or perform other actions with the fetched appointments here
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchSlots = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      // Make API call to fetch slots data for the specific workshop
      const response = await axios.get(
        `${baseUrl}workshop/get-slots/${workshopId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            workshopId: workshopId, // Pass workshopId as a query parameter
          },
        }
      );

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

      setSlots(filteredSlots);
      // Update state with fetched slots
      setLoading(false);
    } catch (error) {
      console.error("Error fetching slots:", error);
      setLoading(false);
    }
  };

  const handleBooking = async (id, date, time, workshopId) => {
    const token = await AsyncStorage.getItem("authToken");
    const decodedToken = jwtDecode(token);
    Alert.alert(
      "Confirm Booking",
      `Do you want to book an appointment for ${date} at ${time
        .split(":")
        .slice(0, 2)
        .join(":")}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("authToken");

              await axios.post(
                `${baseUrl}workshop/book-appointment`,
                {
                  userId: decodedToken.user._id,
                  workshopId: workshopId,
                  name: decodedToken.user.name,
                  phoneNumber: decodedToken.user.phoneNumber,
                  date: date,
                  time: time,
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              // Handle success
              Alert.alert("Success", "Appointment booked successfully!");

              // Optionally, you can navigate to another screen or update state here
              navigation.navigate("Find Workshops");
            } catch (error) {
              console.error("Error booking appointment:", error);
              Alert.alert("Error", "Failed to book appointment.");
            }
          },
        },
      ]
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
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={32} color="#00BE00" />
      </TouchableOpacity>
      {noAppointments ? (
        <>
          <Text style={styles.heading}>Available Slots</Text>
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
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() =>
                        handleBooking(
                          item._id,
                          item.date,
                          item.time,
                          item.workshopId
                        )
                      }
                    >
                      <Text style={styles.buybuttonText}>Book</Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
            </View>
          )}
        </>
      ) : (
        <>
          <Text style={[styles.heading, { marginVertical: 10 }]}>
            Booked Slot
          </Text>
          <View style={styles.slotItem}>
            <View style={styles.rowContainer}>
              <Image
                source={require("../assets/time.png")}
                style={styles.image}
              />
              <View style={styles.columnContainer}>
                <Text>Date</Text>
                <Text style={styles.textItem}>{appointment?.date}</Text>
                <Text>Time</Text>
                <Text style={styles.textItem}>
                  {appointment?.time.split(":").slice(0, 2).join(":")}
                </Text>
              </View>
            </View>
          </View>
        </>
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
  backButton: {
    marginLeft: 8,
    marginTop: 12,
  },
  heading: {
    fontSize: 20,
    fontWeight: "500",
    marginLeft: 5,
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
  box: {
    marginTop: 15,
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
  button: {
    marginTop: 75,
    padding: 7,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5, // for Android
    backgroundColor: "#00BE00",
  },
  buybuttonText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
