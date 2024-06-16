import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
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

export default function ServiceAcceptedScreen({ navigation, route }) {
  const { requestId } = route.params;
  const [userLocation, setUserLocation] = useState(null);
  const [serviceProviderLocation, setServiceProviderLocation] = useState(null);
  const [distance, setDistance] = useState("");
  const [ETA, setETA] = useState("");
  const [loading, setLoading] = useState(true);
  const [vehicleOwnerName, setVehicleOwnerName] = useState("");
  const [vehicleOwnerPhoneNumber, setVehicleOwnerPhoneNumber] = useState("");

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
          `${baseUrl}service/requests/${requestId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const {
          userLocation,
          serviceProviderLocation,
          vehicleOwnerPhoneNumber,
          vehicleOwnerName,
        } = response.data;

        setUserLocation(userLocation);
        setServiceProviderLocation(serviceProviderLocation);
        setVehicleOwnerPhoneNumber(vehicleOwnerPhoneNumber);
        setVehicleOwnerName(vehicleOwnerName);

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

  const calculateDistanceAndETA = async (origin, destination) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${origin.latitude},${origin.longitude}&destinations=${destination.latitude},${destination.longitude}&key=${MAPS_API_KEY}`
      );
      const distanceText = response.data.rows[0].elements[0].distance.value;
      const durationText = response.data.rows[0].elements[0].duration.text;
      // const durationText = "2 min";

      setDistance(distanceText);
      setETA(durationText);

      // Update distance and ETA every 60 seconds
      setTimeout(() => {
        calculateDistanceAndETA(origin, destination);
      }, 60000);

      // Navigate to new screen if ETA is 1 min
      if (durationText === "1 min") {
        navigation.navigate("ServiceCompletionScreen", {
          requestId,
        });
      }
    } catch (error) {
      console.error("Error calculating distance and ETA:", error);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator
          style={styles.loadingIndicator}
          size="large"
          color="#0000ff"
        />
      ) : (
        <>
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
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
                {vehicleOwnerName ? `${vehicleOwnerName}` : "-"}
              </Text>
            </Text>
            <View style={styles.callContainer}>
              <Icon style={styles.cardText} name="call" size={19} />
              <Text style={styles.cardText}>Tap to Call</Text>
            </View>

            <TouchableOpacity
              onPress={() => handleCall(vehicleOwnerPhoneNumber)}
            >
              <Text style={styles.insideText}>{vehicleOwnerPhoneNumber}</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
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
    bottom: 20,
    left: 20,
    right: 20,
    height: "20%",
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
});
