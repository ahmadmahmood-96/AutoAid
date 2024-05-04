const baseUrl = process.env.BASE_URL;
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import RNPickerSelect from "react-native-picker-select";
import { Dimensions } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { decode } from "base-64";

global.atob = decode;

const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default function HomeScreen() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [price, setPrice] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  useEffect(() => {
    // Fetch price when selected service changes
    if (selectedService) {
      fetchPrice();
    }
  }, [selectedService]);

  const handleFindServiceProviders = async () => {
    try {
      setIsLoading(true);
      if (!selectedService || !selectedVehicle || !price) {
        return; // Exit function if any field is empty
      }
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwtDecode(token);

      const serviceData = {
        name: decodedToken.user.name,
        vehicleType: selectedVehicle,
        serviceType: selectedService,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        basePrice: price,
      };

      const response = await axios.post(
        `${baseUrl}service/book-service`,
        serviceData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201) {
        console.log(response.data.message);
      }

      // const response = await fetch(
      //   `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.coords.latitude},${location.coords.longitude}&radius=5000&type=${selectedService}&key=${GOOGLE_PLACES_API_KEY}`
      // );
      // const data = await response.json();
    } catch (error) {
      console.error("Error finding service providers:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPrice = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await axios.get(
        `${baseUrl}service/prices/${selectedService}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const { price } = response.data;
      setPrice(price.price.toString()); // Convert price to string
    } catch (error) {
      console.error("Error fetching price:", error);
    }
  };

  const isButtonDisabled = !selectedService || !selectedVehicle || !price;

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={true}>
        <View style={styles.container}>
          {mapLoaded ? (
            <MapView
              style={styles.map}
              provider={PROVIDER_GOOGLE}
              showsUserLocation={true}
              initialRegion={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
              }}
            >
              {/* {serviceProviders.map((provider, index) => (
                <Marker
                  key={index}
                  coordinate={{
                    latitude: provider.latitude,
                    longitude: provider.longitude,
                  }}
                  title={provider.name}
                  description={provider.vicinity}
                />
              ))} */}
            </MapView>
          ) : (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#00BE00" />
            </View>
          )}
          {errorMsg && <Text>{errorMsg}</Text>}
          {mapLoaded ? (
            <View style={styles.menuContainer}>
              <Text style={styles.label}>Vehicle type:</Text>
              <RNPickerSelect
                onValueChange={(value) => setSelectedVehicle(value)}
                placeholder={{
                  label: "Select Vehicle type",
                  value: null,
                }}
                items={[
                  { label: "Car", value: "Car" },
                  { label: "Bike", value: "Bike" },
                ]}
                style={pickerSelectStyles}
              />
              <Text style={styles.label}>Service type:</Text>
              <RNPickerSelect
                onValueChange={(value) => setSelectedService(value)}
                placeholder={{
                  label: "Select Service type",
                  value: null,
                }}
                items={[
                  { label: "Tyre Puncture", value: "Tyre Puncture" },
                  { label: "Battery Jumpstart", value: "Battery Jumpstart" },
                  { label: "Towing Service", value: "Towing Service" },
                  { label: "Fuel Delivery", value: "Fuel Delivery" },
                ]}
                style={pickerSelectStyles}
              />
              <View style={styles.priceContainer}>
                <Text style={[styles.label, styles.priceLabel]}>
                  Base Price:
                </Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  onChangeText={(text) => setPrice(text)}
                  value={price}
                  placeholder="Enter price"
                />
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.register, isButtonDisabled && styles.disabled]}
                  onPress={handleFindServiceProviders}
                  disabled={isButtonDisabled || isLoading} // Disable the button when isLoading is true or any field is empty
                >
                  {isLoading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text
                      style={[
                        styles.loginButtonText,
                        isButtonDisabled && styles.disabled,
                      ]}
                    >
                      Find Service Providers
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
        </View>
      </TouchableWithoutFeedback>
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
  menuContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#f7f7f7",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    borderStyle: "none",
    borderTopWidth: 1,
    borderTopColor: "#f7f7f7",
    height: "41%",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#fbfbfb",
    height: 47,
    flex: 1,
    borderWidth: 1,
    borderColor: "#7c7c7c",
    borderRadius: 5,
    padding: 10,
    marginBottom: 5,
    fontSize: 16,
  },
  register: {
    height: 47,
    width: "100%",
    backgroundColor: "#00BE00", // Match this with your theme's button color
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10, // Add some margin at the top
    marginBottom: 20, // Add some margin at the top
  },
  loginButtonText: {
    fontSize: 18,
    color: "black", // Button text color
    fontWeight: "bold",
  },
  disabled: {
    backgroundColor: "#a2daa2", // Lighter background color when button is disabled
    color: "#505050",
  },
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  priceLabel: {
    flex: 0.4,
  },
});

const pickerSelectStyles = {
  inputIOS: {
    backgroundColor: "#fbfbfb",
    height: 47,
    width: "100%",
    borderWidth: 1,
    borderColor: "#7c7c7c",
    borderRadius: 5,
    padding: 10,
    color: "black",
    fontSize: 16,
    marginBottom: 10,
  },
  inputAndroid: {
    backgroundColor: "#fbfbfb",
    height: 47,
    width: "95%",
    borderWidth: 1,
    borderColor: "#7c7c7c",
    borderRadius: 5,
    padding: 10,
    color: "black",
    marginBottom: 10,
  },
};
