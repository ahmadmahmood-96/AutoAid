import "react-native-gesture-handler";
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
import ProductInfoScreen from "./VehicleOwnerScreens/ProductInfoScreen";
import CartScreen from "./VehicleOwnerScreens/CartScreen";
import CheckoutScreen from "./VehicleOwnerScreens/CheckoutScreen";
import InsuranceFormScreen from "./VehicleOwnerScreens/InsuranceFormScreen";
import InsuranceBuyScreen from "./VehicleOwnerScreens/InsuranceBuyScreen";
import InsuranceInfoScreen from "./VehicleOwnerScreens/InsuranceInfoScreen";
import ServiceAcceptedScreen from "./SeviceProviderScreens/ServiceAcceptedScreen";

import { StripeProvider } from "@stripe/stripe-react-native";

const Stack = createNativeStackNavigator();

export default function App() {
  const [isConnected, setIsConnected] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const STRIPE_KEY =
    "pk_test_51OvjfW047NJZ4EdhMRFWEHaCmq6JZWuc1mntnnFUjNMlo4owg3TWmiO8H4McKdC0pNAxBVq5oUEuu9nkiXSPw6vv00j5xDFfaV";

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
      <StripeProvider publishableKey={STRIPE_KEY}>
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
          <Stack.Screen
            name="ProductInfoScreen"
            component={ProductInfoScreen}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen
            name="CartScreen"
            component={CartScreen}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen name="CheckoutScreen" component={CheckoutScreen} />
          <Stack.Screen
            name="InsuranceFormScreen"
            component={InsuranceFormScreen}
          />
          <Stack.Screen
            name="InsuranceBuyScreen"
            component={InsuranceBuyScreen}
          />
          <Stack.Screen
            name="InsuranceInfoScreen"
            component={InsuranceInfoScreen}
          />
          <Stack.Screen
            name="ServiceProviderServiceAcceptedScreen"
            component={ServiceAcceptedScreen}
            // options={{ gestureEnabled: false }}
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
      </StripeProvider>
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
