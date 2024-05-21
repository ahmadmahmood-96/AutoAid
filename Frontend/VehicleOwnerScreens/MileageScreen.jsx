import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { TextInput } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { decode } from "base-64";

global.atob = decode;
const baseUrl = process.env.BASE_URL;

export default function MileageScreen({ navigation }) {
  const [currentMileage, setCurrentMileage] = useState("");
  const [targetMileage, setTargetMileage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    if (currentMileage && targetMileage) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [currentMileage, targetMileage]);

  const saveMileage = async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwtDecode(token);
      const response = await axios.post(
        `${baseUrl}mileage/save-mileage`,
        {
          userId: decodedToken.user._id,
          currentMileage: parseFloat(currentMileage),
          targetMileage: parseFloat(targetMileage),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        Alert.alert(
          "Mileage Saved",
          `Current: ${currentMileage}, Target: ${targetMileage}`
        );
        setCurrentMileage("");
        setTargetMileage("");
      } else {
        Alert.alert("Error", "Mileage not saved");
      }
    } catch (error) {
      Alert.alert("Error", "Mileage not saved");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={true}>
      <View style={styles.container}>
        <Text style={styles.inputLabel}>Enter Current Mileage (KMs):</Text>
        <TextInput
          mode="outlined"
          style={styles.textInput}
          keyboardType="numeric"
          value={currentMileage}
          onChangeText={setCurrentMileage}
          placeholder="Current Mileage in KMs"
        />

        <Text style={styles.inputLabel}>Enter Target Mileage (KMs):</Text>
        <TextInput
          mode="outlined"
          style={styles.textInput}
          keyboardType="numeric"
          value={targetMileage}
          onChangeText={setTargetMileage}
          placeholder="Target Mileage in KMs"
        />
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <TouchableOpacity
            onPress={saveMileage}
            style={[
              styles.addToCart,
              isButtonDisabled || isLoading ? styles.disabledButton : null,
            ]}
            disabled={isButtonDisabled || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <Text style={styles.addToCartButtonText}>Save</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  inputLabel: {
    alignSelf: "flex-start",
    marginBottom: 10,
    marginLeft: 2,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333", // Or any color you prefer
  },
  textInput: {
    height: 50, // Fixed height for all text inputs
    width: "99%", // Width is 90% of the screen width
    fontSize: 17,
    marginBottom: 20, // Space between the text inputs
  },
  addToCart: {
    height: 50,
    width: "90%",
    backgroundColor: "#00BE00",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  addToCartButtonText: {
    fontSize: 18,
    color: "black",
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#a2daa2",
  },
});
