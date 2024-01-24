import React, { useState, useEffect } from "react";
import { Modal, View, Text, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import NetInfo from "@react-native-community/netinfo";
import LandingPage from "./screens/LandingPage";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import VehicleOwnerHomeScreen from "./screens/VehicleOwnerHomeScreen";
import ServiceProviderHomeScreen from "./screens/ServiceProviderHomeScreen";
import WorkshopOwnerHomeScreen from "./screens/WorkshopOwnerHomeScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [isConnected, setIsConnected] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);

      // Show/hide modal based on internet connection status
      setIsModalVisible(!state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="LandingPage"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen
          name="LandingPage"
          component={LandingPage}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name="ForgotPasswordScreen"
          component={ForgotPasswordScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name="RegisterScreen"
          component={RegisterScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name="VehicleOwnerHomeScreen"
          component={VehicleOwnerHomeScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name="WorkshopOwnerHomeScreen"
          component={WorkshopOwnerHomeScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name="ServiceProviderHomeScreen"
          component={ServiceProviderHomeScreen}
          options={{ gestureEnabled: false }}
        />
      </Stack.Navigator>

      <Modal
        animationType="slide"
        transparent={true}
        visible={!isConnected && isModalVisible}
      >
        <View style={styles.modalContainer}>
          <MaterialCommunityIcons name="wifi-off" size={42} color="white" />
          <Text style={styles.modalText}>No Internet Connection</Text>
        </View>
      </Modal>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Semi-transparent background
  },
  modalText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    padding: 10,
  },
});
