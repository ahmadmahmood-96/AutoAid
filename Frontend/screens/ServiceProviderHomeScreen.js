import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ServiceProviderHomeScreen({ navigation }) {
  const handleLogoutPress = async () => {
    await AsyncStorage.removeItem("authToken");
    await AsyncStorage.removeItem("userRole");
    navigation.navigate("LoginScreen");
  };
  return (
    <>
      <View style={styles.container}>
        <StatusBar barStyle="auto" />
        <Text>Service Provider Home Screen</Text>
        <View>
          <TouchableOpacity style={styles.logout} onPress={handleLogoutPress}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
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
