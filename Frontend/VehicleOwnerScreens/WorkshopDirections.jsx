import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import MapView, { Marker } from "react-native-maps";
import axios from "axios";

const WorkshopDirections = ({ route }) => {
  const { workshopCoordinates, userCoordinates } = route.params;
  const [distance, setDistance] = useState(null);
  const [eta, setEta] = useState(null);
  const [loading, setLoading] = useState(false);
  const MAPS_API_KEY = process.env.MAPS_API_KEY;

  useEffect(() => {
    const fetchDistance = async () => {
      try {
        const origin = `${userCoordinates[1]},${userCoordinates[0]}`;
        const destination = `${workshopCoordinates[1]},${workshopCoordinates[0]}`;

        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${userCoordinates[1]},${userCoordinates[0]}&destinations=${workshopCoordinates[1]},${workshopCoordinates[0]}&key=${MAPS_API_KEY}`
        );
        console.log(response.data.rows[0].elements[0].distance);

        if (response.data.status === "OK") {
          const distanceValue =
            response.data.rows[0].elements[0].distance.value;
          const distanceText = distanceValue / 1000;
          const durationText = response.data.rows[0].elements[0].duration.text;

          setDistance(distanceText);
          setEta(durationText);
        } else {
          throw new Error("Failed to fetch distance");
        }
      } catch (error) {
        console.error("Error fetching distance:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching distance
      }
    };

    fetchDistance();
  }, [userCoordinates, workshopCoordinates]);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" color="#00BE00" />
      ) : (
        <>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: (workshopCoordinates[1] + userCoordinates[1]) / 2,
              longitude: (workshopCoordinates[0] + userCoordinates[0]) / 2,
              latitudeDelta:
                Math.abs(workshopCoordinates[1] - userCoordinates[1]) * 2,
              longitudeDelta:
                Math.abs(workshopCoordinates[0] - userCoordinates[0]) * 2,
            }}
          >
            <Marker
              coordinate={{
                latitude: workshopCoordinates[1],
                longitude: workshopCoordinates[0],
              }}
              title="Workshop Location"
              description="This is the workshop location"
              pinColor="green"
            />
            <Marker
              coordinate={{
                latitude: userCoordinates[1],
                longitude: userCoordinates[0],
              }}
              title="Your Location"
              description="This is your location"
            />
          </MapView>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>Distance: {distance} km</Text>
            <Text style={styles.infoText}>ETA: {eta}</Text>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    flex: 1,
  },
  infoContainer: {
    position: "absolute",
    bottom: 20,
    left: 10,
    right: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 10,
    borderRadius: 10,
    height: 100,
  },
  infoText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default WorkshopDirections;
