const MAPS_API_KEY = process.env.MAPS_API_KEY;
const baseUrl = process.env.BASE_URL;

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import * as Location from "expo-location";
import { Dimensions } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { jwtDecode } from "jwt-decode";
import { decode } from "base-64";

const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default function HomeScreen() {
  const mapRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setMapLoaded(true);
    })();
  }, []);

  const moveToLocation = async (latitude, longitude) => {
    mapRef.current.animateToRegion(
      {
        latitude,
        longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      2000
    );
  };

  const updateLocationInDatabase = async (latitude, longitude) => {
    try {
      // Fetch the user's authentication token from storage
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwtDecode(token);

      // Make a POST request to your backend API endpoint
      const response = await axios.post(
        `${baseUrl}workshop/update-location/${decodedToken.user._id}`, // Replace with your actual endpoint
        { latitude, longitude }, // Data to send in the request body
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send the authentication token in the request headers
          },
        }
      );

      // Handle the response as needed
      console.log("Location updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating location:", error);
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      {isLoading ? (
        <ActivityIndicator color="#00BE00" size="large" />
      ) : (
        // <>
        <View style={styles.container}>
          {mapLoaded ? (
            <>
              <View style={{ flex: 1 }}>
                <MapView
                  ref={mapRef}
                  style={styles.map}
                  provider={PROVIDER_GOOGLE}
                  showsUserLocation={true}
                  initialRegion={{
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
                  }}
                />
              </View>
              <View style={{ flex: 0.5 }}>
                <GooglePlacesAutocomplete
                  placeholder="Enter Workshop Address"
                  onPress={(data, details = null) => {
                    console.log(JSON.stringify(details?.geometry?.location));
                    const { lat, lng } = details?.geometry?.location;
                    moveToLocation(lat, lng);
                    updateLocationInDatabase(lat, lng);
                  }}
                  query={{
                    key: `${MAPS_API_KEY}`,
                    language: "en",
                  }}
                  onFail={(error) => console.log(error)}
                  styles={{
                    container: {
                      backgroundColor: "transparent",
                      borderTopWidth: 0,
                      borderBottomWidth: 0,
                    },
                    textInputContainer: {
                      width: "100%",
                      backgroundColor: "transparent",
                      borderTopWidth: 0,
                      borderBottomWidth: 0,
                    },
                  }}
                  listViewDisplayed="auto"
                  fetchDetails={true}
                  renderDescription={(row) => row.description || row.vicinity}
                />
              </View>
            </>
          ) : (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#00BE00" />
            </View>
          )}
        </View>
        // </>
      )}
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
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
});
