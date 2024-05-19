import { createDrawerNavigator } from "@react-navigation/drawer";

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet } from "react-native";
import DrawerContent from "../components/DrawerContent";
import HomeScreen from "../SeviceProviderScreens/HomeScreen";
const Drawer = createDrawerNavigator();

export default function ServiceProviderHomeScreen({ navigation }) {
  return (
    <>
      <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />}>
        <Drawer.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerTitle: "Service Requests",
            drawerActiveBackgroundColor: "#e4efe4",
            drawerActiveTintColor: "#00BE00",
            drawerInactiveTintColor: "#1d1d1d",
            headerBackgroundContainerStyle: { display: "none" },
            drawerLabelStyle: {
              fontSize: 15,
            },
            // headerTransparent: true,
            drawerIcon: ({ color }) => (
              <Ionicons name="home-outline" size={24} color={color} />
            ),
          }}
        />
      </Drawer.Navigator>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
});
