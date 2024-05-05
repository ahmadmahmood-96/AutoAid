import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const baseUrl = process.env.BASE_URL;
const PLACES_API = process.env.PLACES_API;
const serviceProviderIcon = require("../assets/service-provider-icon.png");

export default function ServiceAcceptedScreen({ navigation, route }) {
  const { requestId } = route.params;
  const [userLocation, setUserLocation] = useState(null);
  const [serviceProviderLocation, setServiceProviderLocation] = useState(null);
  const [distance, setDistance] = useState("");
  const [ETA, setETA] = useState("");

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
        const { userLocation, serviceProviderLocation } = response.data;

        setUserLocation(userLocation);
        setServiceProviderLocation(serviceProviderLocation);
        console.log(userLocation, serviceProviderLocation);

        // Calculate distance and ETA
        // calculateDistanceAndETA(userLocation, serviceProviderLocation);
      } catch (error) {
        console.error("Error fetching service request details:", error);
      }
    };

    fetchServiceRequestDetails();
  }, [requestId]);

  const calculateDistanceAndETA = async (origin, destination) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${origin.latitude},${origin.longitude}&destinations=${destination.latitude},${destination.longitude}&key=${PLACES_API}`
      );
      console.log(response.data);
      const distanceText = response.data.rows[0].elements[0].distance.text;
      const durationText = response.data.rows[0].elements[0].duration.text;

      setDistance(distanceText);
      setETA(durationText);
    } catch (error) {
      console.error("Error calculating distance and ETA:", error);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
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
            pinColor="green"
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
      <Text>Distance: {distance}</Text>
      <Text>ETA: {ETA}</Text>
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
});
