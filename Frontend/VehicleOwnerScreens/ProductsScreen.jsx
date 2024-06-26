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
  Modal,
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
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMake, setSelectedMake] = useState([]);
  const [selectedModel, setSelectedModel] = useState([]);

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
        console.error("Error fetching products:", error.message);
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

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleMakeChange = (make) => {
    setSelectedMake((prevSelectedMake) =>
      prevSelectedMake.includes(make)
        ? prevSelectedMake.filter((m) => m !== make)
        : [...prevSelectedMake, make]
    );
  };

  const handleModelChange = (model) => {
    setSelectedModel((prevSelectedModel) =>
      prevSelectedModel.includes(model)
        ? prevSelectedModel.filter((m) => m !== model)
        : [...prevSelectedModel, model]
    );
  };

  const applyFilter = () => {
    setFilteredProducts(
      products.filter(
        (product) =>
          (selectedMake.length === 0 || selectedMake.includes(product.make)) &&
          (selectedModel.length === 0 || selectedModel.includes(product.model))
      )
    );
    toggleModal();
  };

  const renderProductItem = ({ item }) => (
    <Pressable
      key={item._id}
      style={styles.card}
      onPress={() =>
        navigation.navigate("ProductInfoScreen", {
          id: item._id,
          productName: item.productName,
          price: item.price,
          description: item.description,
          images: item.images,
          likes: item.likes,
          make: item.make,
          model: item.model,
        })
      }
    >
      <View style={styles.box}>
        <Image source={{ uri: item.images[0].data }} style={styles.cardImage} />
        <View style={styles.cardProduct}>
          <Text style={styles.productTitle}>{item.productName}</Text>
          <Text numberOfLines={2} style={styles.productDescription}>
            {item.description}
          </Text>
          <View style={styles.priceContainer}>
            <Text style={styles.productPrice}>Rs. {item.price}</Text>
            <Pressable
              style={[styles.button, styles.buyButton, styles.selectedButton]}
              pointerEvents="none"
            >
              <Text style={styles.buybuttonText}>Buy</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Pressable>
  );

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.searchContainer}>
          <MaterialIcons
            name="search"
            size={24}
            style={styles.searchIcon}
            color="#00BE00"
          />
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
          <TouchableOpacity style={styles.filterButton} onPress={toggleModal}>
            <Text style={styles.filterButtonText}>Filter</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.rowContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#00BE00" />
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((item) => renderProductItem({ item }))
          ) : (
            <Text style={styles.heading}>No products to display</Text>
          )}
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

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter Products</Text>
            <Text style={styles.modalSubtitle}>Select Make</Text>
            {["Honda", "Toyota", "Suzuki", "Hyundai"].map((make) => (
              <TouchableOpacity
                key={make}
                style={styles.checkboxContainer}
                onPress={() => handleMakeChange(make)}
              >
                <Text style={styles.checkboxLabel}>{make}</Text>
                <View style={styles.checkbox}>
                  {selectedMake.includes(make) && (
                    <Ionicons name="checkmark" size={20} color="#00BE00" />
                  )}
                </View>
              </TouchableOpacity>
            ))}
            <Text style={styles.modalSubtitle}>Select Model</Text>
            {[
              "City",
              "Civic",
              "Corolla",
              "Altis",
              "Mehran",
              "Cultus",
              "WagonR",
              "70CC Bike",
              "100CC Bike",
              "125CC Bike",
              "150CC Bike",
            ].map((model) => (
              <TouchableOpacity
                key={model}
                style={styles.checkboxContainer}
                onPress={() => handleModelChange(model)}
              >
                <Text style={styles.checkboxLabel}>{model}</Text>
                <View style={styles.checkbox}>
                  {selectedModel.includes(model) && (
                    <Ionicons name="checkmark" size={20} color="#00BE00" />
                  )}
                </View>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.applyButton} onPress={applyFilter}>
              <Text style={styles.applyButtonText}>Apply Filter</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20, // Adjust the padding bottom as needed to make sure the content scrolls to the end
  },
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
  selectedButton: {
    backgroundColor: "#00BE00",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  selectedButtonText: {
    color: "#fff",
  },
  buybuttonText: {
    color: "#fff",
    fontWeight: "bold",
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
  cartIcon: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#dfdede",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cartItems: {
    position: "absolute",
    top: -5,
    right: 1,
    backgroundColor: "#00BE00",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    color: "#fff",
    fontSize: 12,
    zIndex: 9,
    borderRadius: 8,
    overflow: "hidden",
  },
  filterButton: {
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
    elevation: 5,
  },
  filterButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkboxLabel: {
    fontSize: 16,
    flex: 1,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  applyButton: {
    backgroundColor: "#00BE00",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  applyButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  closeButtonText: {
    color: "#000",
    textAlign: "center",
    fontSize: 16,
  },
});
