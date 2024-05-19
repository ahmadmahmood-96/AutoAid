import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  Pressable,
  ScrollView,
  SafeAreaView,
  Image,
} from "react-native";
import * as Location from "expo-location";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { decode } from "base-64";

global.atob = decode;

const baseUrl = process.env.BASE_URL; // Replace this with your actual base URL

export default function HomeScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Set initial loading state to true
  const [serviceRequests, setServiceRequests] = useState([]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        setIsLoading(false); // Set loading state to false if permission denied
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setIsLoading(false); // Set loading state to false after location is obtained
    })();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const token = await AsyncStorage.getItem("authToken");
        const decodedToken = jwtDecode(token);

        const response = await axios.get(`${baseUrl}service/requests`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            serviceProviderId: decodedToken.user._id,
          },
        });
        const filteredRequests = response.data.filter(
          (request) => request.status !== "Completed"
        );
        setServiceRequests(filteredRequests);
      } catch (error) {
        console.error("Error fetching service requests:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (location) {
      fetchData();
    }
  }, [location]);

  const updateLocation = async (latitude, longitude) => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwtDecode(token);
      await axios.put(
        `${baseUrl}service/updateLocation`,
        {
          serviceProviderId: decodedToken.user._id, // Replace with actual serviceProviderId
          latitude,
          longitude,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error updating location:", error);
    } finally {
      setIsLoading(false); // Set loading state to false after API call completes
    }
  };

  // Call updateLocation with latitude and longitude if location is available
  useEffect(() => {
    if (location) {
      const { latitude, longitude } = location.coords;
      updateLocation(latitude, longitude);
    }
  }, [location]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwtDecode(token);

      const response = await axios.get(`${baseUrl}service/requests`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          serviceProviderId: decodedToken.user._id,
        },
      });
      setServiceRequests(response.data);
    } catch (error) {
      console.error("Error fetching service requests:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeclineServiceRequest = async (requestId) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      await axios.put(
        `${baseUrl}service/requests/${requestId}/decline`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // After declining the request, you may want to refresh the list of service requests
      fetchData();
    } catch (error) {
      console.error("Error declining request:", error);
    }
  };

  const handleAcceptServiceRequest = async (requestId) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await axios.put(
        `${baseUrl}service/requests/${requestId}/accept`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        // Extract vehicleOwnerId from the response data
        const { vehicleOwnerId } = response.data;

        // Navigate to the next screen and pass requestId and vehicleOwnerId as params
        navigation.navigate("ServiceProviderServiceAcceptedScreen", {
          requestId: requestId,
          vehicleOwnerId: vehicleOwnerId,
        });
      }
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        {isLoading ? (
          <ActivityIndicator color="#00BE00" size="large" />
        ) : (
          <>
            <SafeAreaView>
              <ScrollView style={styles.box}>
                {serviceRequests && serviceRequests.length > 0 ? (
                  serviceRequests.map((request) => (
                    <Pressable key={request._id} style={styles.requestItem}>
                      <View style={styles.rowContainer}>
                        <Image source={require("../assets/user-icon.png")} />
                        <View style={styles.columnContainer}>
                          <Text style={styles.textHeader}>Customer Name:</Text>
                          <Text style={styles.textItem}>{request.name}</Text>
                          <Text style={styles.textHeader}>Vehicle Type:</Text>
                          <Text style={styles.textItem}>
                            {request.vehicleType}
                          </Text>
                          <Text style={styles.textHeader}>Service Type:</Text>
                          <Text style={styles.textItem}>
                            {request.serviceType}
                          </Text>
                          <Text style={styles.textHeader}>Base Price:</Text>
                          <Text
                            style={[
                              styles.textItem,
                              { color: "#00BE00", fontWeight: "700" },
                            ]}
                          >
                            Rs. {request.basePrice}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.buttonContainer}>
                        <TouchableOpacity
                          style={[styles.button, styles.declineButton]}
                          onPress={() =>
                            handleDeclineServiceRequest(request._id)
                          }
                        >
                          <Text style={styles.buybuttonText}>Decline</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.button, styles.acceptButton]}
                          onPress={() =>
                            handleAcceptServiceRequest(request._id)
                          }
                        >
                          <Text style={styles.buybuttonText}>Accept</Text>
                        </TouchableOpacity>
                      </View>
                    </Pressable>
                  ))
                ) : (
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      alignContent: "center",
                    }}
                  >
                    <Text style={styles.textHeader}>
                      No service requests available
                    </Text>
                  </View>
                )}
              </ScrollView>
            </SafeAreaView>
          </>
        )}
      </View>
      {errorMsg && <Text>{errorMsg}</Text>}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f3f3",
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
    marginTop: 18,
  },
  box: {
    padding: 5,
    width: "100%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  requestItem: {
    backgroundColor: "#ffffff",
    // borderWidth: 2,
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
    // borderLeftColor: "#00BE00",
    borderLeftWidth: 4,
  },
  textItem: {
    marginBottom: 10,
    fontSize: 17,
    fontWeight: "500",
  },
  button: {
    marginTop: 20,
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
  },
  acceptButton: {
    backgroundColor: "#00BE00",
  },
  declineButton: {
    backgroundColor: "#dd470b",
  },
  buybuttonText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
