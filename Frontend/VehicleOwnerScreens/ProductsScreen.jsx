import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
  Pressable,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const baseUrl = process.env.BASE_URL;

export default function ProductScreen({ navigation }) {
  const [searchText, setSearchText] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedButton, setSelectedButton] = useState("All");
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);

  const handleButtonPress = (button) => {
    setSelectedButton(button);
    switch (button) {
      case "All":
        setFilteredProducts(products); // Show all products
        break;
      case "Car":
        setFilteredProducts(
          products.filter((product) => product.category === button)
        );
        break;
      case "Bike":
        setFilteredProducts(
          products.filter((product) => product.category === button)
        );
        break;
      default:
        setFilteredProducts([]); // Default to an empty array if no matching category
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
    // Filter products based on the search text
    setFilteredProducts(
      products.filter(
        (product) =>
          product.productName.toLowerCase().includes(text.toLowerCase()) ||
          product.description.toLowerCase().includes(text.toLowerCase())
      )
    );
  };

  const fetchCartItems = async () => {
    const jsonValue = await AsyncStorage.getItem("cartItems");
    if (jsonValue !== null) {
      // Array found, parse the JSON and check if it's empty
      const array = JSON.parse(jsonValue);
      if (array.length > 0) {
        setCartItems(array);
      } else {
        setCartItems([]);
      }
    }
  };

  async function fetchData() {
    const token = await AsyncStorage.getItem("authToken");
    await axios
      .get(`${baseUrl}product/get-products`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setProducts(response.data);
        setFilteredProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchCartItems();
  }, [cartItems]);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.searchContainer}>
            {/* Search Icon */}
            <MaterialIcons
              name="search"
              size={24}
              style={styles.searchIcon}
              color="#00BE00"
            />
            {/* Text Input with Search Icon */}
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              value={searchText}
              onChangeText={handleSearch}
            />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                selectedButton === "All" && styles.selectedButton,
              ]}
              onPress={() => handleButtonPress("All")}
            >
              <Text
                style={[
                  styles.buttonText,
                  selectedButton === "All" && styles.selectedButtonText,
                ]}
              >
                All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                selectedButton === "Car" && styles.selectedButton,
              ]}
              onPress={() => handleButtonPress("Car")}
            >
              <Text
                style={[
                  styles.buttonText,
                  selectedButton === "Car" && styles.selectedButtonText,
                ]}
              >
                Car
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                selectedButton === "Bike" && styles.selectedButton,
              ]}
              onPress={() => handleButtonPress("Bike")}
            >
              <Text
                style={[
                  styles.buttonText,
                  selectedButton === "Bike" && styles.selectedButtonText,
                ]}
              >
                Bike
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.rowContainer}>
            {loading ? (
              <ActivityIndicator size="large" color="#00BE00" /> // Show loading indicator while data is being fetched
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <Pressable
                  style={styles.card}
                  key={product._id}
                  onPress={() =>
                    navigation.navigate("ProductInfoScreen", {
                      id: product._id,
                      productName: product.productName,
                      price: product.price,
                      description: product.description,
                      // images: product.images, original line uncomment this at the time of pushing
                    })
                  }
                >
                  <View style={styles.box}>
                    <Image
                      // source={{ uri: product.images[0].data }} original line uncomment this at the time of pushing
                      source={require("../assets/icon.png")}
                      style={styles.cardImage}
                    />
                    <View style={styles.cardProduct}>
                      <Text style={styles.productTitle}>
                        {product.productName}
                      </Text>
                      <Text style={styles.productDescription}>
                        {product.description}
                      </Text>
                      <View style={styles.priceContainer}>
                        <Text style={styles.productPrice}>
                          Rs. {product.price}
                        </Text>
                        <Pressable
                          style={[
                            styles.button,
                            styles.buyButton,
                            styles.selectedButton,
                          ]}
                          pointerEvents="none"
                        >
                          <Text style={styles.buybuttonText}>Buy</Text>
                        </Pressable>
                      </View>
                    </View>
                  </View>
                </Pressable>
              ))
            ) : (
              <View style={styles.container}>
                <Text style={styles.heading}>No products to display</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity
        style={styles.cartIcon}
        onPress={() => navigation.navigate("CartScreen")}
      >
        {cartItems.length > 0 && (
          <Text style={styles.cartItems}>{cartItems.length}</Text>
        )}
        <Ionicons name="cart-outline" size={30} color="black" />
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  box: {
    borderRadius: 5,
    padding: 5,
    flexDirection: "row",
    height: 210,
    width: "100%",
    marginHorizontal: 4,
  },
  cardImage: {
    width: "37%",
    height: "100%",
    backgroundColor: "#cbf4cb6b",
    marginRight: 10,
    borderRadius: 5,
  },
  cardProduct: {
    width: "57%",
  },
  buttonContainer: {
    flexDirection: "row",
    margin: 10,
  },
  button: {
    marginHorizontal: 5,
    backgroundColor: "#f7f7f7",
    padding: 7,
    paddingHorizontal: 14,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5, // for Android
  },
  buttonText: {
    fontSize: 18,
    color: "#00BE00",
  },
  selectedButton: {
    backgroundColor: "#00BE00", // Change the color to indicate selection
  },
  selectedButtonText: {
    fontSize: 18,
    color: "#f7f7f7",
  },
  buybuttonText: {
    fontSize: 15,
    color: "#f7f7f7",
  },
  priceContainer: {
    position: "absolute",
    bottom: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  buyButton: {
    position: "absolute",
    bottom: -2,
    left: 150,
  },
  container: {
    flex: 1,
    backgroundColor: "#f1f1f1",
  },
  searchContainer: {
    margin: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 9,
    padding: 5,
    width: "95%",
  },
  searchIcon: {
    width: 20,
    height: 20,
    margin: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 17,
  },
  rowContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 5,
    width: "100%",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 5,
    margin: 7.5,
    padding: 2,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: "96%",
  },
  productTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#00BE00",
    marginBottom: 5,
  },
  productDescription: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 15,
    color: "#979797",
  },
  heading: {
    fontSize: 22,
  },
  cartIcon: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 55,
    backgroundColor: "#979797c0",
    borderRadius: 50,
    padding: 10,
  },
  cartItems: {
    backgroundColor: "red",
    position: "absolute",
    right: 11,
    padding: 1,
    paddingHorizontal: 7,
    zIndex: 9,
    borderRadius: 10,
    overflow: "hidden",
  },
});
