import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LandingPage from "./screens/LandingPage";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import VehicleOwnerHomeScreen from "./screens/VehicleOwnerHomeScreen";
import ServiceProviderHomeScreen from "./screens/ServiceProviderHomeScreen";
import WorkshopOwnerHomeScreen from "./screens/WorkshopOwnerHomeScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="LandingPage"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="LandingPage" component={LandingPage} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen
          name="ForgotPasswordScreen"
          component={ForgotPasswordScreen}
        />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        <Stack.Screen
          name="VehicleOwnerHomeScreen"
          component={VehicleOwnerHomeScreen}
        />
        <Stack.Screen
          name="WorkshopOwnerHomeScreen"
          component={WorkshopOwnerHomeScreen}
        />
        <Stack.Screen
          name="ServiceProviderHomeScreen"
          component={ServiceProviderHomeScreen}
        />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
