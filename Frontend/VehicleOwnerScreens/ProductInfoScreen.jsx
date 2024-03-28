import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  FlatList,
  Image,
  Dimensions,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
const { height, width } = Dimensions.get("window");

export default function ProductInfoScreen({ navigation, route }) {
  const { id, productName, price, description, images } = route.params;
  const [indicators, setIndicators] = useState(Array(images.length).fill(1));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const handleAddItem = () => {
    if (quantity < 10) {
      setQuantity(quantity + 1);
    }
  };

  const handleRemoveItem = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCartPress = async () => {
    try {
      // Fetch the current cart items from AsyncStorage
      const existingCartItems = await AsyncStorage.getItem("cartItems");
      let cart = existingCartItems ? JSON.parse(existingCartItems) : [];

      // Check if the item is already in the cart
      const existingItemIndex = cart.findIndex((item) => item.id === id);

      if (existingItemIndex !== -1) {
        // If the item is already in the cart, update its quantity
        cart[existingItemIndex].quantity += quantity;
      } else {
        // If the item is not in the cart, add it
        cart.push({
          id,
          productName,
          price,
          quantity,
          images,
        });
      }

      // Save the updated cart back to AsyncStorage
      await AsyncStorage.setItem("cartItems", JSON.stringify(cart));

      Alert.alert("Success", "Item added to cart successfully!", [
        {
          text: "OK",
          onPress: () => {
            // Optionally, you can navigate to the cart screen
            navigation.navigate("Buy Spare Parts");
          },
        },
      ]);

      // Optionally, you can navigate to the cart screen or show a success message
      // navigation.navigate('CartScreen'); // Uncomment this line if you have a CartScreen
    } catch (error) {
      console.error("Error adding item to cart:", error);
      // Handle the error, show an error message, etc.
    }
  };

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
        <View style={styles.contentContainer}>
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
            onScroll={(e) => {
              const x = e.nativeEvent.contentOffset.x;
              setCurrentIndex((x / width).toFixed(0));
            }}
          />
          <View style={styles.indicator}>
            {indicators.map((item, index) => {
              return (
                <View
                  key={index}
                  style={{
                    width: currentIndex == index ? 30 : 8,
                    height: currentIndex == index ? 10 : 8,
                    borderRadius: currentIndex == index ? 5 : 4,
                    backgroundColor: currentIndex == index ? "#00BE00" : "gray",
                    marginLeft: 5,
                  }}
                ></View>
              );
            })}
          </View>
        </View>
        <View style={styles.productInformationContainer}>
          <Text style={styles.productName}>{productName}</Text>
          <View style={styles.quantitySection}>
            <TouchableOpacity
              style={styles.quantityIndicators}
              onPress={handleAddItem}
            >
              <Text style={styles.quantityIcons}>+</Text>
            </TouchableOpacity>
            <Text style={[styles.quantityIcons, styles.quantityText]}>
              {quantity}
            </Text>
            <TouchableOpacity
              style={styles.quantityIndicators}
              onPress={handleRemoveItem}
            >
              <Text style={styles.quantityIcons}>-</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.priceSection}>
          <Text style={styles.priceText}>Rs. {price}</Text>
        </View>
        <View style={styles.descriptionSection}>
          <Text style={styles.descriptionHeading}>Description</Text>
          <Text style={styles.descriptionText}>{description}</Text>
        </View>
        <View style={styles.addToCartbutton}>
          <TouchableOpacity
            style={styles.addToCart}
            onPress={handleAddToCartPress}
          >
            <Text style={styles.addToCartButtonText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
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
    backgroundColor: "#f9f9f9",
  },
  contentContainer: {
    flexDirection: "column",
  },
  backButton: {
    marginLeft: 8,
    marginTop: 12,
  },
  image: {
    width: width,
    height: height / 2.5,
    margin: 5,
    borderRadius: 5,
  },
  indicator: {
    flexDirection: "row",
    width: width,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 8,
  },
  productInformationContainer: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  quantitySection: {
    flexDirection: "row",
  },
  quantityIndicators: {
    backgroundColor: "#e9e9e9",
    marginHorizontal: 5,
    borderRadius: 8,
  },
  quantityIcons: {
    marginHorizontal: 12,
    marginVertical: 4,
    fontSize: 24,
  },
  quantityText: {
    color: "#00BE00",
    fontWeight: "bold",
  },
  descriptionSection: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  descriptionHeading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 3,
  },
  descriptionText: {
    fontSize: 16,
  },
  priceSection: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  priceText: {
    fontSize: 20,
    color: "#00BE00",
    fontWeight: "bold",
  },
  addToCartbutton: {
    position: "absolute",
    bottom: 15,
    alignItems: "center",
    width: "100%",
  },
  addToCart: {
    height: 50,
    width: "90%",
    backgroundColor: "#00BE00",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  addToCartButtonText: {
    fontSize: 18,
    color: "black",
    fontWeight: "bold",
  },
});
