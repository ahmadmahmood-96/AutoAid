import React from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
export default function Logout({ navigation }) {
  const handleLogoutPress = async () => {
    await AsyncStorage.removeItem("authToken");
    await AsyncStorage.removeItem("userRole");
  };
  return (
    <>
      <View>
        <TouchableOpacity style={styles.logout} onPress={handleLogoutPress}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  logout: {
    height: 50,
    width: "90%",
    backgroundColor: "#00BE00",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  logout: {
    fontSize: 18,
    color: "black",
    fontWeight: "bold",
  },
});
