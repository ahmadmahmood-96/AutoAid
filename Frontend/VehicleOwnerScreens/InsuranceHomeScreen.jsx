import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { decode } from "base-64";

global.atob = decode;

export default function InsuranceHomeScreen({ navigation }) {
  const [vehicle, setVehicle] = useState("");
  const [haveInsurance, setInsurance] = useState();

  const fetchUserVehicle = async () => {
    const token = await AsyncStorage.getItem("authToken");
    const decodedToken = jwtDecode(token);
    setVehicle(decodedToken.user.vehicleType);
    setInsurance(decodedToken.user.haveInsurance);
  };

  useEffect(() => {
    fetchUserVehicle();
  }, []);

  const testing = async () => {
    try {
      const response = await axios.get("http://192.168.0.101:5000/test");
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {vehicle === "car" ? (
        <View>
          {!haveInsurance ? (
            <>
              <Text style={styles.title}>Explore your insurance options:</Text>
              <Text style={styles.subtitle}>
                If you haven't taken insurance yet, fill out the form to check
                if you qualify for a claim.
              </Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("InsuranceFormScreen")}
              >
                <Text style={styles.buttonText}>Fill Form</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text style={styles.heading}>Your existing insurance</Text>
          )}
        </View>
      ) : (
        <Text style={styles.heading}>
          Sorry, there are no insurance policies for{" "}
          <Text style={styles.colorText}>Bike Owners.</Text>
        </Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 20,
    textAlign: "center",
    paddingHorizontal: 10,
  },
  colorText: {
    color: "#00BE00",
    fontWeight: "bold",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 17,
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  button: {
    height: 50,
    width: "90%", // Set width to 90% of the container
    backgroundColor: "#00BE00",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    alignSelf: "center", // Center the button horizontally
    paddingHorizontal: 60,
  },
  buttonText: {
    fontSize: 18,
    color: "black",
    fontWeight: "bold",
  },
});
