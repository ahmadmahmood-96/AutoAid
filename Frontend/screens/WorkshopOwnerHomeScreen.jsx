import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons, Feather } from "@expo/vector-icons";
import DrawerContent from "../components/DrawerContent";
import { StyleSheet } from "react-native";
const Drawer = createDrawerNavigator();

import HomeScreen from "../WorkshopOwnerScreens/HomeScreen";
import AppointmentSlotsScreen from "../WorkshopOwnerScreens/AppointmentSlotsScreen";
import AvailableSlotsScreen from "../WorkshopOwnerScreens/AvailableSlotsScreen";

export default function WorkshopOwnerHomeScreen({ navigation }) {
  return (
    <>
      <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />}>
        <Drawer.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerTitle: "",
            drawerActiveBackgroundColor: "#e4efe4",
            drawerActiveTintColor: "#00BE00",
            drawerInactiveTintColor: "#1d1d1d",
            headerBackgroundContainerStyle: { display: "none" },
            drawerLabelStyle: {
              fontSize: 15,
            },
            headerTransparent: true,
            drawerIcon: ({ color }) => (
              <Ionicons name="home-outline" size={24} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="Create Slots"
          component={AppointmentSlotsScreen}
          options={{
            headerTitle: "",
            drawerActiveBackgroundColor: "#e4efe4",
            drawerActiveTintColor: "#00BE00",
            drawerInactiveTintColor: "#1d1d1d",
            headerBackgroundContainerStyle: { display: "none" },
            drawerLabelStyle: {
              fontSize: 15,
            },
            headerTransparent: true,
            drawerIcon: ({ color }) => (
              <Feather name="calendar" size={24} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="Available Slots"
          component={AvailableSlotsScreen}
          options={{
            headerTitle: "Available Slots",
            drawerActiveBackgroundColor: "#e4efe4",
            drawerActiveTintColor: "#00BE00",
            drawerInactiveTintColor: "#1d1d1d",
            headerBackgroundContainerStyle: { display: "none" },
            drawerLabelStyle: {
              fontSize: 15,
            },
            headerTransparent: true,
            drawerIcon: ({ color }) => (
              <Ionicons name="time-outline" size={24} color={color} />
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
