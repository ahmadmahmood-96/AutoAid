import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  StatusBar,
  ScrollView,
  Alert,
} from "react-native";
import { TextInput } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/FontAwesome";
import RNPickerSelect from "react-native-picker-select";
import axios from "axios";

export default function InsuranceFormScreen({ navigation }) {
  const [ageOfCar, setAgeOfCar] = useState("");
  const [ageOfOwner, setAgeofOwner] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [airbags, setAirBags] = useState("");
  const [rearBrakes, setRearBrakes] = useState("");
  const [transmission, setTransmission] = useState("");
  const [gearBox, setGearBox] = useState("");
  const [steeringType, setSteeringType] = useState("");
  const [isFrontFogLights, setIsFrontFogLights] = useState("");
  const [isPowerSteering, setIsPowerSteering] = useState("");
  const [error, setError] = useState("");

  const handleInsuranceClaim = async () => {
    try {
      if (
        !ageOfCar ||
        !ageOfOwner ||
        !fuelType ||
        !airbags ||
        !rearBrakes ||
        !transmission ||
        !gearBox ||
        !steeringType ||
        !isFrontFogLights ||
        !isPowerSteering
      ) {
        setError("Please fill out all the required fields.");
        return;
      }

      // Normalize age_of_car and age_of_policyholder
      const normalizedAgeOfCar = parseFloat(ageOfCar) / 100;
      const normalizedAgeOfOwner = parseFloat(ageOfOwner) / 100;

      // Prepare the input data
      const inputData = {
        age_of_car: normalizedAgeOfCar,
        age_of_policyholder: normalizedAgeOfOwner,
        airbags: parseInt(airbags),
        gear_box: parseInt(gearBox),
        fuel_type: fuelType,
        rear_brakes_type: rearBrakes,
        transmission_type: transmission,
        steering_type: steeringType,
        is_front_fog_lights: isFrontFogLights,
        is_power_steering: isPowerSteering,
      };

      const response = await axios.post(
        `http://192.168.0.101:5000/predict`,
        inputData
      );

      console.log(response.data);
      if (response.data === "Claim") {
        navigation.navigate("");
      }

      if (response.status === 200) {
        // Reset the form fields if needed
        setAgeOfCar("");
        setAgeofOwner("");
        setFuelType("");
        setAirBags("");
        setRearBrakes("");
        setTransmission("");
        setGearBox("");
        setSteeringType("");
        setIsFrontFogLights("");
        setIsPowerSteering("");
        setError("");
        navigation.navigate("InsuranceBuyScreen");
      } else if (response.status === 400) {
        setError("Failed to predict. Please try again.");
      }
    } catch (e) {
      // Handle errors
      console.error("Error:", e);
      setError("Failed to predict. Please try again.");
    }
  };

  return (
    <>
      <KeyboardAvoidingView behavior={"padding"} style={{ flex: 1 }}>
        <ScrollView>
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={true}
          >
            <View style={styles.container}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.navigate("Insurance")}
              >
                <Ionicons name="chevron-back" size={32} color="#ffff" />
              </TouchableOpacity>
              <StatusBar barStyle="auto" />
              <View style={styles.headerContainer}>
                <View style={styles.headerBox}>
                  <Text style={styles.headerBoxText}>Insurance Form</Text>
                  <Text style={styles.headerBoxTextHeading}>
                    Check your Insurance claim
                  </Text>
                </View>
              </View>
              <View style={styles.bodyContainer}>
                <Text style={styles.title}>Insurance Claim Form</Text>
                <Text style={styles.subtitle}>
                  Check your insurance claim by filling out the required
                  information.
                </Text>

                <Text style={styles.inputLabel}>Age of car (in years)</Text>
                <TextInput
                  mode="outlined"
                  style={styles.textInput}
                  placeholder="Enter age of car"
                  keyboardType="number-pad"
                  value={ageOfCar}
                  onChangeText={(text) => {
                    // Validate if text is numeric and not zero and less than or equal to 100
                    if (
                      (/^\d+$/.test(text) || text === "") &&
                      (parseInt(text) !== 0 || text === "") &&
                      (parseInt(text) <= 100 || text === "")
                    ) {
                      setAgeOfCar(text);
                    }
                  }}
                />

                <Text style={styles.inputLabel}>
                  Age of Policyholder (in years)
                </Text>
                <TextInput
                  mode="outlined"
                  style={styles.textInput}
                  placeholder="Enter age of policyholder"
                  keyboardType="number-pad"
                  value={ageOfOwner}
                  onChangeText={(text) => {
                    // Validate if text is numeric and not zero and less than or equal to 100
                    if (
                      (/^\d+$/.test(text) || text === "") &&
                      (parseInt(text) !== 0 || text === "") &&
                      (parseInt(text) <= 100 || text === "")
                    ) {
                      setAgeofOwner(text);
                    }
                  }}
                />

                <Text style={styles.inputLabel}>Fuel Type</Text>
                <RNPickerSelect
                  onValueChange={(value) => setFuelType(value)}
                  items={[
                    { label: "Petrol", value: "Petrol" },
                    { label: "Diesel", value: "Diesel" },
                    { label: "CNG", value: "CNG" },
                  ]}
                  style={pickerSelectStyles}
                />

                <Text style={styles.inputLabel}>Airbags</Text>
                <RNPickerSelect
                  onValueChange={(value) => setAirBags(value)}
                  items={[
                    { label: "0", value: "0" },
                    { label: "1", value: "1" },
                    { label: "2", value: "2" },
                    { label: "4", value: "4" },
                    { label: "6", value: "6" },
                  ]}
                  style={pickerSelectStyles}
                />

                <Text style={styles.inputLabel}>Rear Brakes Type</Text>
                <RNPickerSelect
                  onValueChange={(value) => setRearBrakes(value)}
                  items={[
                    { label: "Disc", value: "Disc" },
                    { label: "Drum", value: "Drum" },
                  ]}
                  style={pickerSelectStyles}
                />

                <Text style={styles.inputLabel}>Transmission Type</Text>
                <RNPickerSelect
                  onValueChange={(value) => setTransmission(value)}
                  items={[
                    { label: "Manual", value: "Manual" },
                    { label: "Automatic", value: "Automatic" },
                  ]}
                  style={pickerSelectStyles}
                />

                <Text style={styles.inputLabel}>Gear Box</Text>
                <RNPickerSelect
                  onValueChange={(value) => setGearBox(value)}
                  items={[
                    { label: "5", value: "5" },
                    { label: "6", value: "6" },
                  ]}
                  style={pickerSelectStyles}
                />

                <Text style={styles.inputLabel}>Steering Type</Text>
                <RNPickerSelect
                  onValueChange={(value) => setSteeringType(value)}
                  items={[
                    { label: "Power", value: "Power" },
                    { label: "Manual", value: "Manual" },
                    { label: "Electric", value: "Electric" },
                  ]}
                  style={pickerSelectStyles}
                />

                <Text style={styles.inputLabel}>Front Fog Lights</Text>
                <RNPickerSelect
                  onValueChange={(value) => setIsFrontFogLights(value)}
                  items={[
                    { label: "Yes", value: "Yes" },
                    { label: "No", value: "No" },
                  ]}
                  style={pickerSelectStyles}
                />

                <Text style={styles.inputLabel}>Power Steering</Text>
                <RNPickerSelect
                  onValueChange={(value) => setIsPowerSteering(value)}
                  items={[
                    { label: "Yes", value: "Yes" },
                    { label: "No", value: "No" },
                  ]}
                  style={pickerSelectStyles}
                />

                {error ? (
                  <View style={styles.errorContainer}>
                    <Icon name="exclamation-circle" size={18} color="red" />
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                ) : null}

                <TouchableOpacity
                  style={styles.register}
                  onPress={handleInsuranceClaim}
                >
                  <Text style={styles.loginButtonText}>
                    Check Insurance Claim
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
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
    paddingTop: 50,
    paddingBottom: 60,
  },
  bodyContainer: {
    flex: 0.6,
    backgroundColor: "#ffffff",
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
  },
  headerBoxText: {
    fontSize: 16,
    color: "#014e01",
  },
  headerBoxTextHeading: {
    fontSize: 25,
    fontWeight: "bold",
  },
  inputLabel: {
    alignSelf: "flex-start",
    marginBottom: 5,
    marginLeft: 20,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333", // Or any color you prefer
  },
  textInput: {
    height: 50, // Fixed height for all text inputs
    width: "90%", // Width is 90% of the screen width
    fontSize: 17,
    marginBottom: 20, // Space between the text inputs
  },
  title: {
    paddingTop: 20,
    alignSelf: "flex-start",
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 20,
    marginBottom: 10,
    color: "#333", // Adjust the color to match your design
  },
  subtitle: {
    alignSelf: "flex-start",
    marginLeft: 20,
    fontSize: 16,
    color: "#92949f", // Adjust the color to match your design
    marginBottom: 20,
  },
  register: {
    height: 50,
    width: "90%",
    backgroundColor: "#00BE00", // Match this with your theme's button color
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25, // Add some margin at the top
    marginBottom: 20, // Add some margin at the top
  },
  loginButtonText: {
    fontSize: 18,
    color: "black", // Button text color
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
  radioButtonContainer: {
    flexDirection: "column",
    marginBottom: 10,
    marginLeft: 10,
    width: "98%",
  },
  radioButton: {
    flex: 1, // Take up all available space in the row
    justifyContent: "center", // Center the content vertically
  },
  selectedRadioButton: {
    marginHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#f0f0f0", // Light grey background color for selected item
  },
});

const pickerSelectStyles = {
  inputIOS: {
    backgroundColor: "#fbfbfb",
    height: 50,
    width: "90%",
    borderWidth: 1,
    borderColor: "#7c7c7c",
    borderRadius: 5,
    padding: 10,
    color: "#333",
    marginLeft: 20,
    marginBottom: 20,
  },
  inputAndroid: {
    backgroundColor: "#fbfbfb",
    height: 50,
    width: "90%",
    borderWidth: 1,
    borderColor: "#7c7c7c",
    borderRadius: 5,
    padding: 10,
    color: "#333",
    marginLeft: 20,
    marginBottom: 20,
  },
};
