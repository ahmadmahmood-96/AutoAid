import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function VehicleOwnerHomeScreen({ navigation }) {
  const handleLogoutPress = async () => {
    await AsyncStorage.removeItem("authToken");
    await AsyncStorage.removeItem("userRole");
    navigation.navigate("LoginScreen");
  };

  return (
    <>
      <View style={styles.container}>
        <StatusBar barStyle="auto" />
        <Text>Vehicle Owner Home Screen</Text>
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
  logout: {
    height: 50,
    width: "90%",
    backgroundColor: "#00BE00",
    borderRadius: 25,
    paddingLeft: 50,
    paddingRight: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  logoutButtonText: {
    fontSize: 18,
    color: "black",
    fontWeight: "bold",
  },
});
