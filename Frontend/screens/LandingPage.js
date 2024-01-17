import { StyleSheet, View, Image, StatusBar } from "react-native";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LandingPage({ navigation }) {
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        const userRole = await AsyncStorage.getItem("userRole");

        if (token && userRole && userRole === "VehicleOwner")
          navigation.navigate("VehicleOwnerHomeScreen");
        else if (token && userRole && userRole === "WorkshopOwner")
          navigation.navigate("WorkshopOwnerHomeScreen");
        else if (token && userRole && userRole === "ServiceProvider")
          navigation.navigate("ServiceProviderHomeScreen");
        else navigation.navigate("LoginScreen");
      } catch (error) {
        console.log(error.message);
      }
    };
    checkLoginStatus();
  }, []);

  return (
    <>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Image
          source={require("../assets/AutoAidLogo.png")}
          style={styles.logo}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00BE00", // Your provided green color
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 250, // Set the width as needed
    height: 150, // Set the height as needed
    resizeMode: "contain", // This ensures the logo is scaled properly
  },
});
