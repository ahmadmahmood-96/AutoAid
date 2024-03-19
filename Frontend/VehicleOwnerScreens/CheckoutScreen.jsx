const baseUrl = process.env.BASE_URL;

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
} from "react-native";
import { TextInput, RadioButton } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { decode } from "base-64";

global.atob = decode;

export default function CheckoutScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [homeAddress, setHomeAddress] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [town, setTown] = useState(""); // Optional state
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [error, setError] = useState("");

  const calculateTotalPrice = (products) => {
    let totalPrice = 0;

    // Iterate through each product and calculate its total price
    products.forEach((product) => {
      totalPrice += product.price * product.quantity;
    });

    return totalPrice;
  };

  const validateFullName = (name) => {
    const re = /^[a-zA-Z]+$/;
    return re.test(name);
  };

  const validateCity = (city) => {
    const re = /^[a-zA-Z\s]+$/;
    return re.test(city);
  };

  const validatePostalCode = (postalCode) => {
    const re = /^\d{5}$/;
    return re.test(postalCode);
  };

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const formatPhoneNumber = (number) => {
    if (number.length <= 4) {
      return number;
    }
    return number.substring(0, 4) + "-" + number.substring(4);
  };

  const handleCheckout = async () => {
    try {
      if (
        !name ||
        !email ||
        !number ||
        !homeAddress ||
        !streetAddress ||
        !postalCode ||
        !city ||
        !paymentMethod
      ) {
        setError("Please fill out all the required fields.");
        return;
      } else if (!validateFullName(name)) {
        setError(
          "Please enter a valid full name (only alphabetic characters allowed)."
        );
        return;
      } else if (!validateEmail(email)) {
        setError("Please enter a valid email address.");
        return;
      } else if (!validateCity(city)) {
        setError(
          "Please enter a valid city name (only alphabetic characters allowed)."
        );
        return;
      } else if (!validatePostalCode(postalCode)) {
        setError(
          "Please enter a valid 5-digit postal code (only numbers allowed)."
        );
        return;
      }

      const cartItems = await AsyncStorage.getItem("cartItems");
      const products = JSON.parse(cartItems || "[]");

      const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwtDecode(token);
      // Construct the order data object
      const orderData = {
        user: decodedToken.user._id, // Assuming you have userId available
        products: products.map((product) => ({
          productId: product.id,
          name: product.productName,
          quantity: product.quantity,
          price: product.price,
        })),
        totalPrice: calculateTotalPrice(products),
        shippingAddress: {
          name,
          phoneNumber: number,
          houseNo: homeAddress,
          street: streetAddress,
          town, // Optional
          postalCode,
        },
        paymentMethod, // Example payment method
      };
      // Make a POST request to the backend API
      const response = await axios.post(
        `${baseUrl}product/place-order`,
        orderData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(response.data);
      if (response.data.success) {
        // Reset the form fields if needed
        setName("");
        setEmail("");
        setNumber("");
        setHomeAddress("");
        setStreetAddress("");
        setTown("");
        setPostalCode("");
        setCity("");
        setError("");
        setPaymentMethod("");
        console.log("Successful");
      } else if (response.status === 400) {
        setError(response.data.message);
      }
    } catch (e) {
      // Handle registration errors
      if (e.response && e.response.data && e.response.data.message) {
        // Use the custom error message from the backend
        setError(e.response.data.message);
      } else {
        // For other types of errors, use a generic error message
        setError("Failed to place order. Please try again.");
      }
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
                onPress={() => navigation.navigate("CartScreen")}
              >
                <Ionicons name="chevron-back" size={32} color="#ffff" />
              </TouchableOpacity>
              <StatusBar barStyle="auto" />
              <View style={styles.headerContainer}>
                <View style={styles.headerBox}>
                  <Text style={styles.headerBoxText}>Checkout</Text>
                  <Text style={styles.headerBoxTextHeading}>
                    Complete Your Order
                  </Text>
                </View>
              </View>
              <View style={styles.bodyContainer}>
                <Text style={styles.title}>Checkout</Text>
                <Text style={styles.subtitle}>
                  Complete your order by filling out the required information.
                </Text>

                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput
                  mode="outlined"
                  style={styles.textInput}
                  placeholder="Enter your full name"
                  keyboardType="default"
                  value={name}
                  onChangeText={setName} // Update the name state
                />

                <Text style={styles.inputLabel}>Email Address</Text>
                <TextInput
                  mode="outlined"
                  style={styles.textInput}
                  placeholder="Enter your email"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail} // Update the email state
                />

                <Text style={styles.inputLabel}>Phone Number</Text>
                <TextInput
                  mode="outlined"
                  style={styles.textInput}
                  placeholder="Enter your phone number"
                  keyboardType="phone-pad"
                  value={number}
                  onChangeText={(text) =>
                    setNumber(formatPhoneNumber(text.replace(/-/g, "")))
                  }
                  maxLength={12} // 4 digits, dash, 7 digits
                />

                <Text style={styles.inputLabel}>Home Address</Text>
                <TextInput
                  mode="outlined"
                  style={styles.textInput}
                  placeholder="Enter your home address"
                  value={homeAddress}
                  onChangeText={setHomeAddress} // Update the homeAddress state
                />

                <Text style={styles.inputLabel}>Street Address</Text>
                <TextInput
                  mode="outlined"
                  style={styles.textInput}
                  placeholder="Enter your street address"
                  value={streetAddress}
                  onChangeText={setStreetAddress} // Update the streetAddress state
                />

                <Text style={styles.inputLabel}>Town (Optional)</Text>
                <TextInput
                  mode="outlined"
                  style={styles.textInput}
                  placeholder="Enter your town"
                  value={town}
                  onChangeText={setTown} // Update the town state
                />

                <Text style={styles.inputLabel}>Postal Code</Text>
                <TextInput
                  mode="outlined"
                  style={styles.textInput}
                  placeholder="Enter your postal code"
                  keyboardType="number-pad"
                  value={postalCode}
                  onChangeText={setPostalCode} // Update the postalCode state
                  maxLength={5}
                />

                <Text style={styles.inputLabel}>City</Text>
                <TextInput
                  mode="outlined"
                  style={styles.textInput}
                  placeholder="Enter your city"
                  value={city}
                  onChangeText={setCity} // Update the city state
                />

                <Text style={styles.inputLabel}>Select Payment Method</Text>
                <View style={styles.radioButtonContainer}>
                  <RadioButton.Group
                    onValueChange={(value) => setPaymentMethod(value)}
                    value={paymentMethod}
                  >
                    <RadioButton.Item
                      label="Cash on Delivery"
                      value="Cash On Delivery"
                      color="#000" // Black color for the text
                      uncheckedColor="#fff" // White color for the unchecked item
                      style={[
                        styles.radioButton,
                        paymentMethod === "Cash On Delivery"
                          ? styles.selectedRadioButton
                          : null,
                      ]} // Apply selected style conditionally
                    />
                    <RadioButton.Item
                      label="Payment by Card"
                      value="Payment by Card"
                      color="#000" // Black color for the text
                      uncheckedColor="#fff" // White color for the unchecked item
                      style={[
                        styles.radioButton,
                        paymentMethod === "Payment by Card"
                          ? styles.selectedRadioButton
                          : null,
                      ]} // Apply selected style conditionally
                    />
                  </RadioButton.Group>
                </View>

                {error ? (
                  <View style={styles.errorContainer}>
                    <Icon name="exclamation-circle" size={18} color="red" />
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                ) : null}

                <TouchableOpacity
                  style={styles.register}
                  onPress={handleCheckout}
                >
                  <Text style={styles.loginButtonText}>Place Order</Text>
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
