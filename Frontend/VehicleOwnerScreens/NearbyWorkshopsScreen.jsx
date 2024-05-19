import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  ScrollView,
  Image,
  Linking,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location"; // Import Location from expo

const baseUrl = process.env.BASE_URL;

export default function NearbyWorkshopsScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(true);
  const [workshops, setWorkshops] = useState([]);

  // Handle phone call
  const handleCall = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const navigateToDirections = async (longitude, latitude) => {
    try {
      // Get current location using expo's Location module
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        throw new Error("Permission to access location was denied");
      }

      const location = await Location.getCurrentPositionAsync({});
      //   Navigate to DirectionsScreen and pass coordinates
      navigation.navigate("WorkshopDirectionScreen", {
        workshopCoordinates: [longitude, latitude],
        userCoordinates: [location.coords.longitude, location.coords.latitude],
      });
    } catch (error) {
      console.error("Error getting user's location:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Get current location using expo's Location module
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          throw new Error("Permission to access location was denied");
        }

        const location = await Location.getCurrentPositionAsync({});
        // Fetch nearby workshops using latitude and longitude
        const token = await AsyncStorage.getItem("authToken");
        const response = await axios.get(`${baseUrl}workshop/nearby`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
        });

        setWorkshops(response.data);
      } catch (error) {
        console.error("Error fetching nearby workshops:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        {isLoading ? (
          <ActivityIndicator color="#00BE00" size="large" />
        ) : (
          <ScrollView style={styles.scrollView}>
            {workshops.map(({ workshop, owner }) => (
              <View key={workshop._id} style={styles.workshopCard}>
                <View style={styles.rowContainer}>
                  <Image
                    source={
                      owner.image
                        ? { uri: owner.image }
                        : require("../assets/workshop.png")
                    }
                    style={styles.workshopImage}
                  />
                  <View style={styles.columnContainer}>
                    <View style={styles.workshopDetails}>
                      <Text>Owner Name</Text>
                      <Text style={styles.workshopAddress}>{owner.name}</Text>
                      <Text>Workshop Name</Text>
                      <Text style={styles.workshopAddress}>
                        {owner.workshopName}
                      </Text>
                      <Text>Address</Text>
                      <Text style={styles.workshopAddress}>
                        {owner.workshopAddress}
                      </Text>
                      <TouchableOpacity
                        onPress={() => handleCall(owner.phoneNumber)}
                      >
                        <Text>Phone Number</Text>
                        <Text style={styles.workshopAddress}>
                          {owner.phoneNumber}
                        </Text>
                      </TouchableOpacity>
                      <Text>Email</Text>
                      <Text style={styles.workshopAddress}>{owner.email}</Text>
                      {/* You can add more details here */}
                    </View>
                  </View>
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() =>
                      navigateToDirections(
                        workshop.coordinates.coordinates[0],
                        workshop.coordinates.coordinates[1]
                      )
                    }
                  >
                    <Text style={styles.buybuttonText}>See Directions</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() =>
                      navigation.navigate("AppointmentScreen", {
                        workshopId: workshop.workshopOwner, // Pass the workshop ID as a route parameter
                      })
                    }
                  >
                    <Text style={styles.buybuttonText}>Book Appointment</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f3f3",
    marginBottom: 60,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  columnContainer: {
    flexDirection: "column",
    width: "70%",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
    top: 60,
  },
  workshopCard: {
    marginVertical: 10,
    backgroundColor: "#ffffff",
    borderColor: "#00BE00",
    borderRadius: 10,
    paddingHorizontal: 35,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderLeftWidth: 4,
    paddingVertical: 10,
  },
  workshopImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
  },
  workshopDetails: {
    flex: 1,
    marginLeft: 15,
  },
  workshopName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  workshopAddress: {
    fontSize: 17,
    color: "#888",
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: "column",
  },
  button: {
    marginTop: 15,
    margin: 10,
    padding: 7,
    paddingVertical: 8,
    paddingHorizontal: 40,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5, // for Android
    backgroundColor: "#00BE00",
  },
  buybuttonText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
