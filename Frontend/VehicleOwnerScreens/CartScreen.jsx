import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Ionicons, Feather, FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CartScreen({ navigation }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("cartItems");
      if (jsonValue !== null) {
        const array = JSON.parse(jsonValue);
        if (array.length > 0) {
          setCartItems(array);
        } else {
          setCartItems([]);
        }
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId) => {
    try {
      // Get the current cart items from AsyncStorage
      const jsonValue = await AsyncStorage.getItem("cartItems");
      if (jsonValue !== null) {
        const existingItems = JSON.parse(jsonValue);

        // Filter out the item to be removed
        const updatedItems = existingItems.filter((item) => item.id !== itemId);

        // Update the state and AsyncStorage with the new items
        setCartItems(updatedItems);
        await AsyncStorage.setItem("cartItems", JSON.stringify(updatedItems));
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  // Calculate total price of items in cart
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("Buy Spare Parts")}
        >
          <Ionicons name="chevron-back" size={32} color="#00BE00" />
        </TouchableOpacity>
        <ScrollView>
          <Text style={styles.cartHeading}>Cart</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#00BE00" />
          ) : (
            <>
              {cartItems.length > 0 ? (
                cartItems.map((product) => (
                  <Pressable style={styles.card} key={product.id}>
                    <View style={styles.box}>
                      <Image
                        source={require("../assets/icon.png")}
                        style={styles.cardImage}
                      />
                      <View style={styles.cardProduct}>
                        <Text style={styles.productTitle}>
                          {product.productName}
                        </Text>

                        <View style={styles.quantityContainer}>
                          <Text style={styles.productQuantity}>
                            Quantity: {product.quantity}
                          </Text>
                        </View>

                        <View style={styles.priceContainer}>
                          <Text style={styles.productPrice}>
                            Rs. {product.price}
                          </Text>
                        </View>
                      </View>

                      {/* Add a remove button */}
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => removeItem(product.id)}
                      >
                        <Feather name="trash-2" size={24} color="#FF0000" />
                      </TouchableOpacity>
                    </View>
                  </Pressable>
                ))
              ) : (
                <View style={styles.centerContainer}>
                  <View style={styles.rowConatiner}>
                    <Text style={styles.noItemsText}>No items in the cart</Text>
                    <FontAwesome5
                      name="shopping-cart"
                      size={30}
                      color="#00BE00"
                    />
                  </View>
                </View>
              )}
              {/* Display total price */}
              {cartItems.length > 0 && (
                <View style={styles.totalPriceContainer}>
                  <Text style={styles.totalPriceText}>
                    Total Price: Rs. {totalPrice.toFixed(2)}
                  </Text>
                </View>
              )}
              {/* Checkout button */}
            </>
          )}
        </ScrollView>
        {cartItems.length > 0 && (
          <View style={styles.addToCartbutton}>
            <TouchableOpacity
              style={styles.addToCart}
              onPress={() => navigation.navigate("CheckoutScreen")}
            >
              <Text style={styles.addToCartButtonText}>Checkout</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f1f1",
  },
  backButton: {
    marginLeft: 8,
    marginTop: 12,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  rowConatiner: {
    flexDirection: "row",
    margin: 10,
  },
  noItemsText: {
    fontSize: 22,
    fontWeight: "400",
    marginRight: 15,
    textAlign: "center",
  },
  cartHeading: {
    fontSize: 26,
    fontWeight: "bold",
    margin: 10,
  },
  card: {
    backgroundColor: "#fff",
    margin: 10,
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.8,
    elevation: 3,
  },
  box: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginRight: 15,
  },
  cardProduct: {
    flex: 1,
  },
  productTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  productDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    flexDirection: "row-reverse",
  },
  productQuantity: {
    fontSize: 15,
    fontWeight: "bold",
    marginRight: 10,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10,
    color: "#00BE00",
  },
  removeButton: {
    marginLeft: 10,
    padding: 5,
  },
  totalPriceContainer: {
    marginRight: 20,
    marginTop: 10,
  },
  totalPriceText: {
    fontSize: 18,
    textAlign: "right",
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
