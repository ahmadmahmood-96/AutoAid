const baseUrl = process.env.BASE_URL;

import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  FlatList,
  Alert,
} from "react-native";
import axios from "axios";
import { useStripe } from "@stripe/stripe-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { jwtDecode } from "jwt-decode";
import { decode } from "base-64";

global.atob = decode;

export default function InsuranceInfoScreen({ navigation, route }) {
  const { id, name, price, description, coverage, duration } = route.params;

  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const handleBuyNow = async () => {
    const paymentResponse = await axios.post(`${baseUrl}payment/intents`, {
      amount: Math.floor(price * 100),
    });

    if (paymentResponse.status === 400) {
      Alert.alert("Something went wrong");
      return;
    }
    const initResponse = await initPaymentSheet({
      merchantDisplayName: "AutoAid",
      paymentIntentClientSecret: paymentResponse.data.paymentIntent,
    });

    if (initResponse.error) {
      Alert.alert("Something went wrong");
      return;
    }

    const paymentSheetResponse = await presentPaymentSheet();
    if (paymentSheetResponse.error) {
      Alert.alert(
        `Error code: ${paymentSheetResponse.error.code}`,
        paymentSheetResponse.error.message
      );
      return;
    }

    const token = await AsyncStorage.getItem("authToken");
    const decodedToken = jwtDecode(token);
    const response = await axios.post(
      `${baseUrl}insurance/bought-insurance`,
      {
        userId: decodedToken.user._id,
        insuranceId: id,
        // Pass any other required data about the insurance here
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      // Handle success
      navigation.navigate("Home");
    } else {
      // Handle error
      console.error("Failed to save insurance:", response.data);
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={32} color="#00BE00" />
        </TouchableOpacity>
        <View style={styles.contentContainer}>
          <View style={styles.productInformationContainer}>
            <Text style={styles.productName}>{name}</Text>
          </View>
          <View style={styles.priceSection}>
            <Text style={styles.priceText}>Rs. {price}</Text>
          </View>
          <View style={styles.descriptionSection}>
            <Text style={styles.descriptionHeading}>Description</Text>
            <Text style={styles.descriptionText}>{description}</Text>
          </View>
          <View style={styles.descriptionSection}>
            <Text style={styles.descriptionHeading}>Coverage</Text>
            <FlatList
              data={coverage}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <Text style={styles.descriptionText}>{item}</Text>
              )}
            />
          </View>
          <View style={styles.descriptionSection}>
            <Text style={styles.descriptionHeading}>Duration</Text>
            <Text style={styles.descriptionText}>{duration}</Text>
          </View>
        </View>
        <View style={styles.addToCartbutton}>
          <TouchableOpacity style={styles.addToCart} onPress={handleBuyNow}>
            <Text style={styles.addToCartButtonText}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  backButton: {
    marginLeft: 8,
    marginTop: 12,
  },
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  contentContainer: {
    paddingHorizontal: 10,
    marginHorizontal: 5,
    marginTop: 5,
    paddingTop: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
  },
  productInformationContainer: {
    marginBottom: 10,
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  priceSection: {
    marginBottom: 10,
  },
  priceText: {
    fontSize: 20,
    color: "#00BE00",
    fontWeight: "bold",
  },
  descriptionSection: {
    marginBottom: 10,
  },
  descriptionHeading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 3,
  },
  descriptionText: {
    fontSize: 16,
  },
  addToCartbutton: {
    position: "absolute",
    bottom: 15,
    alignItems: "center",
    width: "100%",
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
});
