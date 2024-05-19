import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";
import { TextInput } from "react-native-paper";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const baseUrl = process.env.BASE_URL;

export default function ServiceCompletionScreen({ navigation, route }) {
  const { requestId } = route.params; // Destructuring the requestId from route.params
  const [isLoading, setIsLoading] = useState(false);
  const [price, setPrice] = useState("");
  const [serviceRequest, setServiceRequest] = useState(null);

  useEffect(() => {
    fetchData(requestId); // Call fetchData with requestId as parameter
  }, [requestId]);

  const fetchData = async (requestId) => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem("authToken");

      const response = await axios.get(
        `${baseUrl}service/requests/${requestId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setServiceRequest(response.data);
    } catch (error) {
      console.error("Error fetching service request:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteServiceRequest = async () => {
    try {
      if (price.trim() === "") {
        Alert.alert("Error", "Please enter the final price.");
        return;
      }

      setIsLoading(true);

      const token = await AsyncStorage.getItem("authToken");
      const response = await axios.put(
        `${baseUrl}service/requests/${requestId}`,
        { price },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsLoading(false);
      Alert.alert("Success", response.data.message);
      navigation.navigate("Home");
    } catch (error) {
      setIsLoading(false);
      console.error("Error updating service request:", error);
      Alert.alert(
        "Error",
        "Failed to complete service request. Please try again."
      );
    } finally {
      setPrice("");
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00BE00" />
      </View>
    );
  }

  return (
    <>
      <KeyboardAvoidingView behavior={"padding"} style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={true}>
          <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <Image
              source={require("../assets/user-icon.png")} // Path to your user icon image
              style={styles.userIcon}
            />
            <Text style={styles.name}>{serviceRequest?.vehicleOwnerName}</Text>
            <Text style={styles.inputLabel}>Final Price</Text>
            <TextInput
              mode="outlined"
              style={styles.textInput}
              placeholder="Enter your price"
              autoCapitalize="none"
              keyboardType="numeric"
              value={price}
              onChangeText={setPrice} // Updating the email state
              maxLength={5}
            />
            <TouchableOpacity
              style={styles.completeButton}
              onPress={handleCompleteServiceRequest}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.completeButtonText}>
                  Complete Service Request
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#6c6c6c",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#6c6c6c",
  },
  name: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: "600",
    color: "#00BE00",
  },
  userIcon: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  inputLabel: {
    alignSelf: "flex-start",
    marginLeft: 21,
    marginBottom: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffff", // Or any color you prefer
  },
  textInput: {
    height: 50, // Fixed height for all text inputs
    width: "90%", // Width is 90% of the screen width
    fontSize: 17,
    marginBottom: 20, // Space between the text inputs
    backgroundColor: "#f9f9f9",
  },
  completeButton: {
    height: 50,
    width: "90%",
    backgroundColor: "#00BE00",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 40,
  },
  completeButtonText: {
    fontSize: 18,
    color: "black",
    fontWeight: "bold",
  },
});
