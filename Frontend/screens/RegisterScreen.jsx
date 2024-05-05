const baseUrl = process.env.BASE_URL;

import React from "react";
import { useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import { TextInput } from "react-native-paper";
import RNPickerSelect from "react-native-picker-select";
import Icon from "react-native-vector-icons/FontAwesome";
import axios from "axios";
import OTPVerificationModal from "./OTPVerificationModal";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("vehicleOwner"); // Default role is vehicle owner
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [vehicleType, setVehicleType] = useState("");
  const [workshopName, setWorkshopName] = useState("");
  const [workshopAddress, setWorkshopAddress] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [isModalVisible, setModalVisibility] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const clearValue = () => {
    setError("");
  };

  useFocusEffect(
    React.useCallback(() => {
      clearValue();
    }, [])
  );

  const handleRegisterPress = async () => {
    let errorMessage = "";

    if (!name || !email || !number || !password || !confirmPassword) {
      errorMessage = "All fields are required.";
    } else if (!validateEmail(email)) {
      errorMessage = "Invalid email format.";
    } else if (!validatePassword(password)) {
      errorMessage = "Password is not in proper format.";
    } else if (password !== confirmPassword) {
      errorMessage = "Passwords do not match.";
    } else if (!number.match(/^03\d{2}-\d{7}$/)) {
      errorMessage = "Phone number must be in the format 0333-3333333.";
    }
    setError(errorMessage);
    if (!errorMessage) {
      try {
        setIsLoading(true);
        const data = {
          name,
          email,
          number,
          password,
          selectedRole,
          vehicleType,
          workshopName,
          workshopAddress,
          licenseNumber,
        };
        // Make a POST request to the backend API
        await axios.post(`${baseUrl}auth/register`, data);

        // Reset the form fields if needed
        setName("");
        setEmail("");
        setNumber("");
        setPassword("");
        setConfirmPassword("");
        setSelectedRole("vehicleOwner");
        setVehicleType("");
        setWorkshopName("");
        setWorkshopAddress("");
        setLicenseNumber("");
        setModalVisibility(true);
      } catch (e) {
        // Handle login errors
        if (e.response && e.response.data && e.response.data.message) {
          // Use the custom error message from the backend
          setError(e.response.data.message);
        } else {
          // For other types of errors, use a generic error message
          console.log(e.response.data.message);
          setError("Failed to register. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const verifyOtp = async (otp) => {
    try {
      const otpNumber = parseInt(otp, 10);
      await axios.post(`${baseUrl}auth/verify`, {
        email,
        otpNumber,
      });

      // If verification is successful, navigate to the login screen
      navigation.navigate("LoginScreen");
    } catch (e) {
      // Handle errors during verification
      if (e.response && e.response.data && e.response.data.message) {
        setError(e.response.data.message);
      } else {
        setError("Failed to verify OTP. Please try again.");
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    return re.test(password);
  };

  const formatPhoneNumber = (number) => {
    if (number.length <= 4) {
      return number;
    }
    return number.substring(0, 4) + "-" + number.substring(4);
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
              <StatusBar barStyle="auto" />
              <View style={styles.headerContainer}>
                <View style={styles.headerBox}>
                  <Text style={styles.headerBoxText}>Hello, There</Text>
                  <Text style={styles.headerBoxTextHeading}>
                    Please Register Yourself
                  </Text>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={[styles.button, styles.loginButton]}
                      onPress={() => navigation.navigate("LoginScreen")}
                    >
                      <Text style={styles.loginText}>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.button, styles.registerButton]}
                      onPress={() => navigation.navigate("RegisterScreen")}
                    >
                      <Text style={styles.registerText}>Register</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View style={styles.bodyContainer}>
                <Text style={styles.title}>Create Your Account</Text>
                <Text style={styles.subtitle}>
                  Make sure your account stay secure.
                </Text>
                <View style={styles.roleContainer}>
                  <Text style={styles.options}>Select Your Role</Text>
                  <View style={styles.roleButtons}>
                    <TouchableOpacity
                      style={[
                        styles.roleButton,
                        selectedRole === "vehicleOwner" &&
                          styles.selectedRoleButton,
                      ]}
                      onPress={() => setSelectedRole("vehicleOwner")}
                    >
                      <Text
                        style={
                          selectedRole === "vehicleOwner" &&
                          styles.selectedRoleButton
                        }
                      >
                        Vehicle Owner
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.roleButton,
                        selectedRole === "workshopOwner" &&
                          styles.selectedRoleButton,
                      ]}
                      onPress={() => setSelectedRole("workshopOwner")}
                    >
                      <Text
                        style={
                          selectedRole === "workshopOwner" &&
                          styles.selectedRoleButton
                        }
                      >
                        Workshop Owner
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.roleButton,
                        selectedRole === "serviceProvider" &&
                          styles.selectedRoleButton,
                      ]}
                      onPress={() => setSelectedRole("serviceProvider")}
                    >
                      <Text
                        style={
                          selectedRole === "serviceProvider" &&
                          styles.selectedRoleButton
                        }
                      >
                        Service Provider
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput
                  mode="outlined"
                  style={styles.textInput}
                  placeholder="Enter your full name"
                  keyboardType="default"
                  value={name}
                  onChangeText={setName} // Updating the email state
                />

                <Text style={styles.inputLabel}>Email Address</Text>
                <TextInput
                  mode="outlined"
                  style={styles.textInput}
                  placeholder="Enter your email"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={email.trim()}
                  onChangeText={setEmail} // Updating the email state
                />

                <Text style={styles.inputLabel}>Phone Number</Text>
                <TextInput
                  mode="outlined"
                  style={styles.textInput}
                  placeholder="Enter your phone number"
                  keyboardType="number-pad"
                  value={number}
                  onChangeText={(text) =>
                    setNumber(formatPhoneNumber(text.replace(/-/g, "")))
                  }
                  maxLength={12} // 4 digits, dash, 7 digits
                />

                <Text style={styles.inputLabel}>Password</Text>
                <TextInput
                  mode="outlined"
                  style={styles.textInput}
                  placeholder="Enter your password"
                  secureTextEntry={!showPassword}
                  right={
                    <TextInput.Icon
                      icon={showPassword ? "eye-off" : "eye"}
                      onPress={togglePasswordVisibility}
                    />
                  }
                  value={password}
                  onChangeText={setPassword} // Updating the password state
                />

                <Text style={styles.inputLabel}>Confirm Password</Text>
                <TextInput
                  mode="outlined"
                  style={styles.textInput}
                  placeholder="Re-Enter your password"
                  secureTextEntry={!showConfirmPassword}
                  right={
                    <TextInput.Icon
                      icon={showConfirmPassword ? "eye-off" : "eye"}
                      onPress={toggleConfirmPasswordVisibility}
                    />
                  }
                  value={confirmPassword}
                  onChangeText={setConfirmPassword} // Updating the password state
                />

                {selectedRole === "vehicleOwner" && (
                  <View style={styles.bodyContainer}>
                    <Text style={styles.inputLabel}>Select Vehicle Type:</Text>
                    <RNPickerSelect
                      onValueChange={(value) => setVehicleType(value)}
                      items={[
                        { label: "Car", value: "car" },
                        { label: "Bike", value: "bike" },
                      ]}
                      style={{
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
                        },
                      }}
                    />
                  </View>
                )}

                {selectedRole === "workshopOwner" && (
                  <View style={styles.bodyContainer}>
                    <Text style={styles.inputLabel}>Workshop Name</Text>
                    <TextInput
                      mode="outlined"
                      style={styles.textInput}
                      value={workshopName}
                      placeholder="Enter Workshop Name"
                      onChangeText={setWorkshopName}
                    />

                    <Text style={styles.inputLabel}>Workshop Address</Text>
                    <TextInput
                      mode="outlined"
                      style={styles.textInput}
                      value={workshopAddress}
                      onChangeText={setWorkshopAddress}
                      placeholder="Enter Workshop Address"
                    />
                  </View>
                )}

                {selectedRole === "serviceProvider" && (
                  <View style={styles.bodyContainer}>
                    <Text style={styles.inputLabel}>License Number</Text>
                    <TextInput
                      mode="outlined"
                      keyboardType="numeric"
                      style={styles.textInput}
                      value={licenseNumber}
                      placeholder="Enter License Number"
                      onChangeText={setLicenseNumber}
                      maxLength={6}
                    />
                  </View>
                )}

                {error ? (
                  <View style={styles.errorContainer}>
                    <Icon name="exclamation-circle" size={18} color="red" />
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                ) : null}

                <TouchableOpacity
                  style={styles.register}
                  onPress={handleRegisterPress}
                >
                  {isLoading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={styles.loginButtonText}>Create Account</Text>
                  )}
                  {/* <OTPVerificationModal
                    isVisible={isModalVisible}
                    onConfirm={verifyOtp}
                    onCancel={() => setModalVisibility(false)}
                    email={email} // Pass the email to the modal for display
                  /> */}
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
  headerContainer: {
    backgroundColor: "#00BE00",
    width: "100%",
    flex: 0.4,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    paddingTop: 110,
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
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    width: "85%",
    marginBottom: 50,
  },
  headerBoxText: {
    fontSize: 16,
    color: "#014e01",
  },
  headerBoxTextHeading: {
    fontSize: 25,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 20,
    backgroundColor: "#009200",
    borderRadius: 20, // Adjust the borderRadius to get the pill shape
  },
  button: {
    flex: 0.9, // Take up equal space
    paddingVertical: 10,
    borderRadius: 20, // Adjust the borderRadius to get the pill shape
    justifyContent: "center", // Center the text label vertically
    alignItems: "center", // Center the text label horizontally
  },
  loginButton: {
    backgroundColor: "#009200", // Same as container background for the register button
  },
  registerButton: {
    backgroundColor: "white", // White background for the login button
  },
  loginText: {
    color: "#004c00",
    fontWeight: "bold",
  },
  registerText: {
    color: "black",
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
  roleContainer: {
    marginBottom: 20,
    width: "91%",
  },
  options: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  roleButtons: {
    flexDirection: "row",
  },
  roleButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: "center",
    marginHorizontal: 5,
  },
  selectedRoleButton: {
    backgroundColor: "#00BE00", // Change to your desired selected color
    borderColor: "#00BE00", // Change to your desired selected color
    color: "white",
  },
  roleButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  pickerContainer: {
    height: 50, // Matches the height of your text inputs
    width: "90%", // Matches the width of your text inputs
    borderRadius: 25, // Rounded corners like your text inputs
    borderWidth: 2, // Border styling
    borderColor: "#E8E8E8",
    justifyContent: "center", // Vertically center the picker content
    marginBottom: 20, // Space below the picker
    overflow: "hidden", // Ensures the picker's corners are also rounded
  },
  vehicleTypePicker: {
    color: "#333", // Text color inside the picker
    backgroundColor: "transparent", // Ensures no background color is applied within the picker
    width: "100%", // Ensures the picker fills its container
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    marginBottom: 10,
  },
  errorText: {
    color: "red",
    marginLeft: 5,
    fontWeight: "bold",
    fontSize: 16,
  },
});
