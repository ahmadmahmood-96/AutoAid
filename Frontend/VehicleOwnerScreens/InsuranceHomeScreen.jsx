const baseUrl = process.env.BASE_URL;

import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { decode } from "base-64";

global.atob = decode;

const InsuranceHomeScreen = ({ navigation }) => {
  const [vehicle, setVehicle] = useState("");
  const [haveInsurance, setInsurance] = useState(false);
  const [insurance, setInsuranceDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserVehicle = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwtDecode(token);
      setVehicle(decodedToken.user.vehicleType);

      const response = await axios.get(
        `${baseUrl}insurance/check-insurance/${decodedToken.user._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setInsurance(response.data.haveInsurance);

      if (
        response.data.haveInsurance &&
        decodedToken.user.vehicleType === "car"
      ) {
        const insuranceResponse = await axios.get(
          `${baseUrl}insurance/get-insurance/${decodedToken.user._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (insuranceResponse.data.insurance) {
          setInsuranceDetails(insuranceResponse.data.insurance);
        }
      }
    } catch (error) {
      console.error("Error fetching insurance details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelInsurance = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwtDecode(token);
      const response = await axios.delete(
        `${baseUrl}insurance/cancel-insurance/${decodedToken.user._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Check if cancellation was successful
      if (response.status === 200) {
        // Update state or show a success message to the user
        setInsurance(null);
        setInsuranceDetails(null);
        setInsurance(false);
        navigation.navigate("Home");
      }
    } catch (error) {
      console.error("Error cancelling insurance:", error);
      // Handle errors appropriately (e.g., show error message)
    }
  };

  useEffect(() => {
    fetchUserVehicle();
  }, [haveInsurance]);

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#00BE00" />
      ) : (
        <>
          {vehicle === "car" ? (
            <View style={styles.content}>
              {!haveInsurance ? (
                <>
                  <Text style={styles.title}>
                    Explore your insurance options:
                  </Text>
                  <Text style={styles.subtitle}>
                    If you haven't taken insurance yet, fill out the form to
                    check if you qualify for a claim.
                  </Text>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate("InsuranceFormScreen")}
                  >
                    <Text style={styles.buttonText}>Fill Form</Text>
                  </TouchableOpacity>
                </>
              ) : insurance ? (
                <View style={styles.insuranceDetailsContainer}>
                  <Text style={styles.heading}>Your existing insurance</Text>
                  <Text style={styles.detailText}>
                    <Text style={styles.label}>Insurance Name: </Text>
                    {insurance.id.name}
                  </Text>
                  <Text style={styles.detailText}>
                    <Text style={styles.label}>Description: </Text>
                    {insurance.id.description}
                  </Text>
                  <Text style={styles.detailText}>
                    <Text style={styles.label}>Coverage: </Text>
                    {insurance.id.coverage.join(", ")}
                  </Text>
                  <Text style={styles.detailText}>
                    <Text style={styles.label}>Duration: </Text>
                    {insurance.id.duration}
                  </Text>
                  <Text style={styles.detailText}>
                    <Text style={styles.label}>Bought Date: </Text>
                    {new Date(insurance.bought).toLocaleDateString()}
                  </Text>
                  <Text style={styles.detailText}>
                    <Text style={styles.label}>Renewed: </Text>
                    {insurance.isRenewed ? "Yes" : "No"}
                  </Text>
                  <View>
                    <TouchableOpacity
                      style={[styles.button, styles.cancelButton]}
                      onPress={handleCancelInsurance}
                    >
                      <Text style={styles.buttonText}>Cancel Insurance</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <Text style={styles.heading}>No insurance details found.</Text>
              )}
            </View>
          ) : (
            <Text style={styles.heading}>
              Sorry, there are no insurance policies for{" "}
              <Text style={styles.colorText}>Bike Owners.</Text>
            </Text>
          )}
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontWeight: "bold",
    marginBottom: 10,
    fontSize: 20,
    textAlign: "center",
    paddingHorizontal: 10,
    color: "#00BE00", // Main theme color
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
    color: "#00BE00", // Main theme color
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
  cancelButton: {
    backgroundColor: "#ff5234", // Red color for cancel button
    marginTop: 10,
  },
  buttonText: {
    fontSize: 18,
    color: "black",
    fontWeight: "bold",
  },
  insuranceDetailsContainer: {
    paddingHorizontal: 20,
    gap: 5,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 5,
  },
  label: {
    fontWeight: "bold",
  },
});

export default InsuranceHomeScreen;
