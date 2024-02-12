import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ProductInfoScreen({ navigation, route }) {
  const { id, productName, price, description } = route.params;
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={32} color="#00BE00" />
        </TouchableOpacity>
        <Text>{productName}</Text>
        <Text>{id}</Text>
        <Text>{price}</Text>
        <Text>{description}</Text>
        {/* {console.log(product)} */}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  backButton: {
    marginLeft: 8,
    marginTop: 12,
  },
});
