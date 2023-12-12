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

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleForgotPassword = () => {
    console.log("hi");
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
              <Text style={styles.loginButtonText}>Reset Password</Text>
            </TouchableOpacity>
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
