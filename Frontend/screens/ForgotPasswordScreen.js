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
} from "react-native";
import { TextInput } from "react-native-paper";
import axios from "axios";
import OTPVerificationModal from "./OTPVerificationModal";
import Icon from "react-native-vector-icons/FontAwesome";

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showFields, setShowFields] = useState(false);
  const [isModalVisible, setModalVisibility] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const handleForgotPassword = async () => {
    let errorMessage = "";
    if (!email) {
      errorMessage = "All fields are required.";
    } else if (showFields) {
      if (!password || !confirmPassword) {
        errorMessage = "All fields are required.";
      } else if (!validatePassword(password)) {
        errorMessage = "Password is not in proper format.";
      } else if (password !== confirmPassword) {
        errorMessage = "Passwords do not match.";
      }
    } else if (!validateEmail(email)) {
      errorMessage = "Invalid email format.";
    }

    setError(errorMessage);
    if (!errorMessage) {
      try {
        const userEmail = {
          email,
        };
        // Make a POST request to the login API endpoint
        const response = await axios.post(
          `http://192.168.1.139:8080/api/verify-email`,
          userEmail
        );

        console.log(response.data.message);
        setModalVisibility(true);
      } catch (e) {
        // Handle login errors
        if (e.response && e.response.data && e.response.data.message) {
          // Use the custom error message from the backend
          setError(e.response.data.message);
        } else {
          // For other types of errors, use a generic error message
          console.log(e);
          setError("Failed to verify email. Please try again.");
        }
      }
    }
  };

  const handleChangePassword = async () => {
    try {
      await axios.post(`http://192.168.1.139:8080/api/change-password`, {
        email,
        password,
      });

      navigation.navigate("LoginScreen");

      // If verification is successful, navigate to the login screen
    } catch (e) {
      // Handle errors during verification
      if (e.response && e.response.data && e.response.data.message) {
        setError(e.response.data.message);
      } else {
        setError("Failed to verify OTP. Please try again.");
      }
    }
  };

  const verifyOtp = async (otp) => {
    try {
      const otpNumber = parseInt(otp, 10);
      await axios.post(`http://192.168.1.139:8080/api/verify`, {
        email,
        otpNumber,
      });
      setShowFields(true);
      // If verification is successful, navigate to the login screen
    } catch (e) {
      // Handle errors during verification
      if (e.response && e.response.data && e.response.data.message) {
        setError(e.response.data.message);
      } else {
        setError("Failed to verify OTP. Please try again.");
      }
    }
  };

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    return re.test(password);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <KeyboardAvoidingView behavior={"padding"} style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={true}>
        <View style={styles.container}>
          <StatusBar barStyle="auto" />
          <View style={styles.headerContainer}>
            <View style={styles.headerBox}>
              <Text style={styles.headerBoxText}>Need Help?</Text>
              <Text style={styles.headerBoxTextHeading}>
                Reset Your Password
              </Text>
            </View>
          </View>
          <View style={styles.bodyContainer}>
            <Text style={styles.title}>Forgot Password</Text>
            <Text style={styles.subtitle}>
              Enter your email to reset your password.
            </Text>

            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput
              mode="outlined"
              style={styles.textInput}
              placeholder="Enter your email"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />

            {showFields ? (
              <View>
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
              </View>
            ) : null}

            {error ? (
              <View style={styles.errorContainer}>
                <Icon name="exclamation-circle" size={18} color="red" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={styles.login}
              onPress={handleForgotPassword}
            >
              <Text style={styles.loginButtonText}>Verify</Text>
              <OTPVerificationModal
                isVisible={isModalVisible}
                onConfirm={verifyOtp}
                onCancel={() => setModalVisibility(false)}
                email={email} // Pass the email to the modal for display
              />
            </TouchableOpacity>

            {showFields ? (
              <TouchableOpacity
                style={styles.login}
                onPress={handleChangePassword}
              >
                <Text style={styles.loginButtonText}>Reset Password</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

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
  },
  bodyContainer: {
    overflow: "hidden",
    flex: 0.6,
    backgroundColor: "#ffffff",
    width: "100%",
    alignItems: "center",
    // justifyContent: "center",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  headerBox: {
    backgroundColor: "#00a700",
    padding: 45,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    width: "85%",
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
    backgroundColor: "white", // White background for the login button
  },
  registerButton: {
    backgroundColor: "#009200", // Same as container background for the register button
  },
  loginText: {
    color: "black",
    fontWeight: "bold",
  },
  registerText: {
    color: "#004c00",
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
    alignSelf: "flex-start",
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 20,
    marginBottom: 10,
    marginTop: 20,
    color: "#333", // Adjust the color to match your design
  },
  subtitle: {
    alignSelf: "flex-start",
    marginLeft: 20,
    fontSize: 16,
    color: "#92949f", // Adjust the color to match your design
    marginBottom: 20,
  },
  login: {
    height: 50,
    width: "90%",
    backgroundColor: "#00BE00", // Match this with your theme's button color
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10, // Add some margin at the top
    marginBottom: 10, // Add some margin at the top
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
  },
  errorText: {
    color: "red",
    marginLeft: 5,
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ForgotPasswordScreen;
