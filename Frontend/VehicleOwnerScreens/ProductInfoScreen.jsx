import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  FlatList,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ProductInfoScreen({ navigation, route }) {
  const { id, productName, price, description, images } = route.params;
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
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
        <FlatList
          data={images}
          keyExtractor={(item) => item._id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <Image
              source={{ uri: item.data }} // Assuming images are stored as URIs
              style={styles.image}
            />
          )}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  backButton: {
    marginLeft: 8,
    marginTop: 12,
  },
  container: {
    flex: 1,
  },
  backButton: {
    marginLeft: 8,
    marginTop: 12,
  },
  image: {
    width: 100,
    height: 200, // Set the height of each image as needed
    margin: 5,
    borderRadius: 5,
  },
});
