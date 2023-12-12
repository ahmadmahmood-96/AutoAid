import { StyleSheet, View, Image, StatusBar } from "react-native";
import { useEffect } from "react";

export default function LandingPage({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate("LoginScreen"); // Replace 'LoginScreen' with your actual login screen route name
    }, 2000); // 2 seconds delay

    return () => clearTimeout(timer); // Cleanup the timer when the component is unmounted
  }, [navigation]); // Empty dependency array means it will only run once on mount

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
