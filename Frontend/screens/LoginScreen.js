import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
} from "react-native";
import { TextInput } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        const userRole = await AsyncStorage.getItem("userRole");

        if (token && userRole && userRole === "VehicleOwner")
          navigation.navigate("VehicleOwnerHomeScreen");
        else if (token && userRole && userRole === "WorkshopOwner")
          navigation.navigate("WorkshopOwnerHomeScreen");
        else if (token && userRole && userRole === "ServiceProvider")
          navigation.navigate("ServiceProviderHomeScreen");
      } catch (error) {
        console.log(error.message);
      }
    };
    checkLoginStatus();
  }, []);

  const handleLoginPress = async () => {
    let errorMessage = "";

    if (!email || !password) {
      errorMessage = "All fields are required.";
    }
    // else if (!validateEmail(email)) {
    //   errorMessage = "Invalid email format.";
    // } else if (!validatePassword(password)) {
    //   errorMessage = "Password is not in proper format.";
    // }

    setError(errorMessage);
    if (!errorMessage) {
      try {
        const loginData = {
          email,
          password,
        };

        // Make a POST request to the login API endpoint
        const response = await axios.post(
          `http://192.168.100.68:8080/api/login`,
          loginData
        );

        // Reset the login form fields
        setEmail("");
        setPassword("");
        const userRole = response.data.role;
        AsyncStorage.setItem("authToken", response.data.token);
        AsyncStorage.setItem("userRole", userRole);
        console.log(token);
        if (userRole === "VehicleOwner")
          navigation.navigate("VehicleOwnerHomeScreen");
        else if (userRole === "WorkshopOwner")
          navigation.navigate("WorkshopOwnerHomeScreen");
        else if (userRole === "ServiceProvider")
          navigation.navigate("ServiceProviderHomeScreen");
      } catch (e) {
        // Handle login errors
        if (e.response && e.response.data && e.response.data.message) {
          // Use the custom error message from the backend
          setError(e.response.data.message);
        } else {
          // For other types of errors, use a generic error message
          console.log(e);
          setError("Failed to log in. Please try again.");
        }
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

  const onPressForgotPassword = () => {
    navigation.navigate("ForgotPasswordScreen");
  };

  return (
    <>
      <KeyboardAvoidingView behavior={"padding"} style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={true}>
          <View style={styles.container}>
            <StatusBar barStyle="auto" />
            <View style={styles.headerContainer}>
              <View style={styles.headerBox}>
                <Text style={styles.headerBoxText}>Hello, There</Text>
                <Text style={styles.headerBoxTextHeading}>Welcome Back</Text>
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
              <Text style={styles.title}>Login to Your Account</Text>
              <Text style={styles.subtitle}>
                Make sure that you already have an account.
              </Text>

              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                mode="outlined"
                style={styles.textInput}
                placeholder="Enter your email"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail} // Updating the email state
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
              <Pressable onPress={onPressForgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </Pressable>

              {error ? (
                <View style={styles.errorContainer}>
                  <Icon name="exclamation-circle" size={18} color="red" />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <TouchableOpacity style={styles.login} onPress={handleLoginPress}>
                <Text style={styles.loginButtonText}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
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
    padding: 15,
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
    color: "#333",
  },
  subtitle: {
    alignSelf: "flex-start",
    marginLeft: 20,
    fontSize: 16,
    color: "#92949f",
    marginBottom: 20,
  },
  login: {
    height: 50,
    width: "90%",
    backgroundColor: "#00BE00",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
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
  },
  errorText: {
    color: "red",
    marginLeft: 5,
    fontWeight: "bold",
    fontSize: 16,
  },
  forgotPasswordText: {
    alignSelf: "flex-end",
    marginRight: 20,
    color: "#00BE00",
    fontWeight: "bold",
    fontSize: 16,
  },
});
