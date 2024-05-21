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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { decode } from "base-64";

global.atob = decode;
const baseUrl = process.env.BASE_URL;

export default function BookedSlotsScreen({ navigation, route }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwtDecode(token);

      const response = await axios.get(
        `${baseUrl}workshop/get-appointment-workshop/${decodedToken.user._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        const userAppointments = response.data.appointments;
        setAppointments(userAppointments);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteAppointment = async (appointmentId) => {
    try {
      const token = await AsyncStorage.getItem("authToken");

      const response = await axios.delete(
        `${baseUrl}workshop/delete-appointment/${appointmentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        Alert.alert("Success", "Appointment completed successfully");
        setAppointments((prevAppointments) =>
          prevAppointments.filter(
            (appointment) => appointment._id !== appointmentId
          )
        );
      }
    } catch (error) {
      console.error("Error deleting appointment:", error);
      Alert.alert("Error", "Failed to complete appointment");
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#00BE00" />
      </View>
    );
  }

  const renderAppointmentItem = ({ item }) => (
    <View style={styles.slotItem}>
      <View style={styles.rowContainer}>
        <Image source={require("../assets/time.png")} style={styles.image} />
        <View style={styles.columnContainer}>
          <Text>Customer Name</Text>
          <Text style={styles.textItem}>{item.name}</Text>
          <Text>Phone Number</Text>
          <Text style={styles.textItem}>{item.phoneNumber}</Text>
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
        onPress={() => handleCompleteAppointment(item._id)}
      >
        <Text style={styles.buybuttonText}>Completed</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={appointments}
        renderItem={renderAppointmentItem}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f3f3",
    paddingHorizontal: 15,
    paddingTop: 20,
    marginTop: 38,
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
    marginHorizontal: 1,
    marginVertical: 10,
    backgroundColor: "#f7f7f7",
    borderColor: "#00BE00",
    borderRadius: 10,
    paddingHorizontal: 35,
    paddingVertical: 10,
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
    marginTop: 185,
    marginLeft: -50,
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
