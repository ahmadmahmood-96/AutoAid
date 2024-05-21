import { createDrawerNavigator } from "@react-navigation/drawer";

import { Ionicons, FontAwesome5 } from "@expo/vector-icons";

import HomeScreen from "../VehicleOwnerScreens/HomeScreen";
import ProductsScreen from "../VehicleOwnerScreens/ProductsScreen";
import InsuranceHomeScreen from "../VehicleOwnerScreens/InsuranceHomeScreen";
import ChatbotScreen from "../VehicleOwnerScreens/ChatbotScreen";
import DrawerContent from "../components/DrawerContent";
import NearbyWorkshopsScreen from "../VehicleOwnerScreens/NearbyWorkshopsScreen";
import MileageScreen from "../VehicleOwnerScreens/MileageScreen";

const Drawer = createDrawerNavigator();

export default function VehicleOwnerHomeScreen({ navigation }) {
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
          name="Find Workshops"
          component={NearbyWorkshopsScreen}
          options={{
            headerTitle: "Nearby Workshops",
            drawerActiveBackgroundColor: "#e4efe4",
            drawerActiveTintColor: "#00BE00",
            drawerInactiveTintColor: "#1d1d1d",
            headerBackgroundContainerStyle: { display: "none" },
            drawerLabelStyle: {
              fontSize: 15,
            },
            headerTransparent: true,
            headerTitleStyle: { fontSize: 18 },
            drawerIcon: ({ color }) => (
              <Ionicons name="search-outline" size={24} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="Buy Spare Parts"
          component={ProductsScreen}
          options={{
            headerTitle: "Products",
            drawerActiveBackgroundColor: "#e4efe4",
            drawerActiveTintColor: "#00BE00",
            drawerInactiveTintColor: "#1d1d1d",
            headerBackgroundContainerStyle: { display: "none" },
            drawerLabelStyle: {
              fontSize: 15,
            },
            // headerTransparent: true,
            headerTitleStyle: { fontSize: 18 },
            drawerIcon: ({ color }) => (
              <Ionicons name="cart-outline" size={24} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="Insurance"
          component={InsuranceHomeScreen}
          options={{
            headerTitle: "Car Insurance",
            drawerActiveBackgroundColor: "#e4efe4",
            drawerActiveTintColor: "#00BE00",
            drawerInactiveTintColor: "#1d1d1d",
            headerBackgroundContainerStyle: { display: "none" },
            drawerLabelStyle: {
              fontSize: 15,
            },
            headerTransparent: true,
            headerTitleStyle: { fontSize: 18 },
            drawerIcon: ({ color }) => (
              <Ionicons name="car-sport" size={24} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="Maintenance"
          component={MileageScreen}
          options={{
            headerTitle: "Maintenance",
            drawerActiveBackgroundColor: "#e4efe4",
            drawerActiveTintColor: "#00BE00",
            drawerInactiveTintColor: "#1d1d1d",
            headerBackgroundContainerStyle: { display: "none" },
            drawerLabelStyle: {
              fontSize: 15,
            },
            headerTransparent: true,
            headerTitleStyle: { fontSize: 18 },
            drawerIcon: ({ color }) => (
              <FontAwesome5 name="screwdriver" size={24} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="Chat Support"
          component={ChatbotScreen}
          options={{
            headerTitle: "Chat Support",
            drawerActiveBackgroundColor: "#e4efe4",
            drawerActiveTintColor: "#00BE00",
            drawerInactiveTintColor: "#1d1d1d",
            headerBackgroundContainerStyle: { display: "none" },
            drawerLabelStyle: {
              fontSize: 15,
            },
            headerTransparent: false,
            headerTitleStyle: { fontSize: 18 },
            drawerIcon: ({ color }) => (
              <Ionicons name="chatbox-ellipses" size={24} color={color} />
            ),
          }}
        />
      </Drawer.Navigator>
    </>
  );
}
