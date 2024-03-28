import { createDrawerNavigator } from "@react-navigation/drawer";

import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "../VehicleOwnerScreens/HomeScreen";
import ProductsScreen from "../VehicleOwnerScreens/ProductsScreen";
import InsuranceHomeScreen from "../VehicleOwnerScreens/InsuranceHomeScreen";
import DrawerContent from "../components/DrawerContent";

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
      </Drawer.Navigator>
    </>
  );
}
