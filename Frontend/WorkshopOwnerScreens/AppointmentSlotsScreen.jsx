import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  StatusBar,
  ScrollView,
  Pressable,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { TextInput } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { decode } from "base-64";

global.atob = decode;
const baseUrl = process.env.BASE_URL;

export default function AppointmentSlotsScreen({ navigation }) {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // State variable for loading indicator

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const toggleTimePicker = () => {
    setShowTimePicker(!showTimePicker);
  };

  const onDateChange = (event, selectedDate) => {
    if (event.type === "set" && selectedDate) {
      const currentDate = new Date();
      if (selectedDate < currentDate) {
        setError("Please select a future date.");
        toggleDatePicker();
        return;
      }

      setDate(selectedDate);
      if (Platform.OS === "android") {
        toggleDatePicker();
      }
    } else {
      toggleDatePicker();
    }
  };

  const onTimeChange = (event, selectedTime) => {
    if (event.type === "set" && selectedTime) {
      if (Platform.OS === "android") {
        toggleTimePicker();
      }
      setTime(selectedTime);
    } else {
      toggleTimePicker();
    }
  };

  const handleCreateSlot = async () => {
    try {
      setLoading(true); // Start loading
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwtDecode(token);
      if (!date || !time) {
        setError("Please fill out all the required fields.");
        setLoading(false); // Stop loading
        return;
      }
      const slotData = {
        workshopId: decodedToken.user._id,
        date: date.toLocaleDateString(),
        time: time.toLocaleTimeString(),
      };
      const response = await axios.post(
        `${baseUrl}workshop/save-slot`,
        slotData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201) {
        setError("");
        Alert.alert("Success", "Slot created successfully.");
        setError("");
        setDate(new Date());
        setTime(new Date());
      } else {
        setError(response.data.message);
        Alert.alert("Error", "Failed to create slot.");
      }
      console.log(response.data);
    } catch (error) {
      setError(error.message);
      Alert.alert("Error", "Failed to create slot.");
    } finally {
      setLoading(false); // Stop loading in both success and error cases
    }
  };

  return (
    <>
      <ScrollView>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.container}>
            <StatusBar barStyle="auto" />
            <View style={styles.headerContainer}>
              <View style={styles.headerBox}>
                <Text style={styles.headerBoxText}>Slot Creation Form</Text>
                <Text style={styles.headerBoxTextHeading}>
                  Create Booking Slots
                </Text>
              </View>
            </View>
            <View style={styles.bodyContainer}>
              <Text style={styles.title}>Slot Creation Form</Text>
              <Text style={styles.subtitle}>
                Create slots by filling out the required information.
              </Text>

              <Text style={styles.inputLabel}>Date:</Text>
              <Pressable
                onPress={toggleDatePicker}
                style={styles.textInputWidth}
              >
                <TextInput
                  editable={false}
                  mode="outlined"
                  style={styles.textInput}
                  value={date.toDateString()} // Display the date as a string
                  placeholder="Select a date"
                />
              </Pressable>

              {showDatePicker && (
                <DateTimePicker
                  mode="date"
                  value={date}
                  display="spinner"
                  onChange={onDateChange}
                />
              )}

              <Text style={styles.inputLabel}>Time:</Text>
              <Pressable
                onPress={toggleTimePicker}
                style={styles.textInputWidth}
              >
                <TextInput
                  editable={false}
                  mode="outlined"
                  style={styles.textInput}
                  value={time.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })} // Display the time as a string without seconds
                  placeholder="Select a time"
                />
              </Pressable>

              {showTimePicker && (
                <DateTimePicker
                  mode="time"
                  value={time}
                  display="spinner"
                  onChange={onTimeChange}
                />
              )}

              {error ? (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={18} color="red" />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <TouchableOpacity
                style={[styles.register, loading && styles.disabledButton]} // Disable button style when loading
                onPress={handleCreateSlot}
                disabled={loading} // Disable button when loading
              >
                {loading ? ( // Show activity indicator when loading
                  <ActivityIndicator size="small" color="black" />
                ) : (
                  <Text style={styles.loginButtonText}>Create Slot</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00BE00",
  },
  backButton: {
    marginLeft: 8,
    marginTop: 58,
  },
  headerContainer: {
    backgroundColor: "#00BE00",
    width: "100%",
    flex: 0.4,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    paddingTop: 100,
    paddingBottom: 60,
  },
  bodyContainer: {
    flex: 0.6,
    backgroundColor: "#f7f7f7",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    overflow: "hidden",
  },
  headerBox: {
    backgroundColor: "#00a700",
    padding: 15,
    paddingVertical: 45,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    width: "85%",
    marginBottom: 30,

    width: "85%",
    marginBottom: 30,
  },
  headerBoxText: {
    fontSize: 16,
    color: "#014e01",
  },
  headerBoxTextHeading: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
  },
  inputLabel: {
    alignSelf: "flex-start",
    marginBottom: 5,
    marginLeft: 20,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  textInput: {
    height: 50,
    width: "90%",
    fontSize: 17,
    marginBottom: 20,
  },
  textInputWidth: {
    width: "100%",
    marginLeft: 40,
  },
  title: {
    paddingTop: 20,
    alignSelf: "flex-start",
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 20,
    marginBottom: 10,
    color: "#333",
  },
  subtitle: {
    alignSelf: "flex-start",
    marginLeft: 20,
    fontSize: 16,
    color: "#92949f",
    marginBottom: 20,
  },
  register: {
    height: 50,
    width: "90%",
    backgroundColor: "#00BE00",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
    marginBottom: 20,
  },
  loginButtonText: {
    fontSize: 18,
    color: "black",
    fontWeight: "bold",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  errorText: {
    color: "red",
    marginLeft: 5,
    fontWeight: "bold",
    fontSize: 16,
  },
});
