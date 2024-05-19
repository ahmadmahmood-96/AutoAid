import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  Platform,
  Alert,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";
import { Dimensions } from "react-native";

// Define your constants here
const baseUrl = process.env.BASE_URL;
const MAPS_API_KEY = process.env.MAPS_API_KEY;
const serviceProviderIcon = require("../assets/service-provider-icon.png");
const userIcon = require("../assets/user-icon.png");

export default function ServiceProcessingScreen({ navigation, route }) {
  const { requestId } = route.params;
  const [userLocation, setUserLocation] = useState(null);
  const [serviceProviderLocation, setServiceProviderLocation] = useState(null);
  const [distance, setDistance] = useState("");
  const [ETA, setETA] = useState("");
  const [loading, setLoading] = useState(true);
  const [serviceProviderName, setServiceProviderName] = useState("");
  const [serviceProviderPhoneNumber, setServiceProviderPhoneNumber] =
    useState("");
  const [disableCancelButton, setDisableCancelButton] = useState(false);

  // Dimensions for map
  const { width, height } = Dimensions.get("window");
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.0922;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

  // Handle phone call
  const handleCall = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  useEffect(() => {
    const fetchServiceRequestDetails = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        const response = await axios.get(
          `${baseUrl}service/requests-by-vehicle-owner/${requestId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const {
          userLocation,
          serviceProviderLocation,
          serviceProviderPhoneNumber,
          serviceProviderName,
        } = response.data;

        setUserLocation(userLocation);
        setServiceProviderLocation(serviceProviderLocation);
        setServiceProviderPhoneNumber(serviceProviderPhoneNumber);
        setServiceProviderName(serviceProviderName);

        // Calculate distance and ETA
        calculateDistanceAndETA(serviceProviderLocation, userLocation);

        // Mark loading as false after setting locations
        setLoading(false);
      } catch (error) {
        console.error("Error fetching service request details:", error);
      }
    };

    fetchServiceRequestDetails();
  }, [requestId]);

  const checkServiceRequestStatus = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await axios.get(
        `${baseUrl}service/requests/status/${requestId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.status;
    } catch (error) {
      console.error("Error fetching service request status:", error);
    }
  };

  const submitComplaint = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const complaintText =
        "Service request was not completed but Service Provider completed it";
      const response = await axios.post(
        `${baseUrl}service/submit-complaint/${requestId}`,
        { complaintText }, // Send the complaint text in the request body
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Error submitting complaint:", error);
    }
  };

  const calculateDistanceAndETA = async (origin, destination) => {
    try {
      // const response = await axios.get(
      //   `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${origin.latitude},${origin.longitude}&destinations=${destination.latitude},${destination.longitude}&key=${MAPS_API_KEY}`
      // );
      // const distanceText = response.data.rows[0].elements[0].distance.value;
      // const durationText = response.data.rows[0].elements[0].duration.text;s
      // Simulated duration text
      const durationText = "1 min";

      // Set distance and ETA
      setDistance(1000);
      setETA("1 min");

      // Disable cancel button if ETA is 1 min
      if (durationText === "1 min") {
        setDisableCancelButton(true);
        const status = await checkServiceRequestStatus();
        // Check service request status
        if (status === "Completed") {
          Alert.alert(
            "Service Request Completed",
            "Do you want to navigate back to home?",
            [
              {
                text: "Yes",
                onPress: () => navigation.navigate("Home"),
              },
              {
                text: "No",
                onPress: () => {
                  // Submit a complaint and navigate back to home
                  submitComplaint();
                  navigation.navigate("Home");
                },
                style: "cancel",
              },
            ],
            { cancelable: false }
          );
        }

        return; // Exit the function if durationText is 1 min
      } else {
        setDisableCancelButton(false);
      }

      // Update distance and ETA every 60 seconds
      const intervalId = setInterval(() => {
        calculateDistanceAndETA(origin, destination);
      }, 10000);

      // Clear the interval if durationText is not 1 min
      return () => clearInterval(intervalId);
    } catch (error) {
      console.error("Error calculating distance and ETA:", error);
    }
  };

  const handleCancelServiceRequest = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await axios.post(
        `${baseUrl}service/cancel-request/${requestId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        // If the request is successful, navigate back to the previous screen
        navigation.navigate("Home");
      }
    } catch (error) {
      console.error("Error cancelling service request:", error);
    }
  };

  return (
    <>
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator
            style={styles.loadingIndicator}
            size="large"
            color="#00BE00"
          />
        ) : (
          <>
            <MapView
              style={styles.map}
              provider={
                Platform.OS === "android" ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
              }
              initialRegion={{
                latitude: serviceProviderLocation?.latitude,
                longitude: serviceProviderLocation?.longitude,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
              }}
            >
              {userLocation && (
                <Marker
                  coordinate={{
                    latitude: userLocation.latitude,
                    longitude: userLocation.longitude,
                  }}
                  image={userIcon}
                />
              )}
              {serviceProviderLocation && (
                <Marker
                  coordinate={{
                    latitude: serviceProviderLocation.latitude,
                    longitude: serviceProviderLocation.longitude,
                  }}
                  image={serviceProviderIcon}
                />
              )}
            </MapView>
            <View style={styles.card}>
              <Text style={styles.cardText}>
                Distance:{" "}
                <Text style={styles.insideText}>
                  {distance
                    ? distance < 1000
                      ? `${distance} m`
                      : `${(distance / 1000).toFixed(2)} km`
                    : "-"}
                </Text>
              </Text>
              <Text style={styles.cardText}>
                ETA:{" "}
                <Text style={styles.insideText}>{ETA ? `${ETA} ` : "-"}</Text>
              </Text>

              <Text style={styles.cardText}>
                Name:{" "}
                <Text style={styles.insideText}>
                  {serviceProviderName ? `${serviceProviderName}` : "-"}
                </Text>
              </Text>
              <View style={styles.callContainer}>
                <Icon style={styles.cardText} name="call" size={19} />
                <Text style={styles.cardText}>Tap to Call</Text>
              </View>

              <TouchableOpacity
                onPress={() => handleCall(serviceProviderPhoneNumber)}
              >
                <Text style={styles.insideText}>
                  {serviceProviderPhoneNumber}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.button}>
              <TouchableOpacity
                style={[
                  styles.completeButton,
                  disableCancelButton && { opacity: 0.5 },
                ]}
                onPress={handleCancelServiceRequest}
                disabled={loading || disableCancelButton}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.completeButtonText}>
                    Cancel Service Request
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 10,
    elevation: 5,
    borderRadius: 10,
    position: "absolute",
    justifyContent: "center",
    bottom: 85,
    left: 20,
    right: 20,
    height: "23%",
  },
  cardText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    marginRight: 5,
  },
  insideText: {
    color: "#00BE00",
    fontSize: 20,
    fontWeight: "600",
  },
  callContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
  },
  completeButton: {
    height: 50,
    width: "90%",
    backgroundColor: "#dd470b",
    borderRadius: 12,
    position: "absolute",
    bottom: 20,
  },
  completeButtonText: {
    fontSize: 18,
    color: "black",
    marginTop: 11,
    fontWeight: "bold",
    textAlign: "center",
  },
});
