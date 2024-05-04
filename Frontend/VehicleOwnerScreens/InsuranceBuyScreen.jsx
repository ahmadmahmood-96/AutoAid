const baseUrl = process.env.BASE_URL;

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Pressable,
  ActivityIndicator,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

import axios from "axios";

export default function InsuranceBuyScreen({ navigation }) {
  const [insurances, setInsurances] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const token = await AsyncStorage.getItem("authToken");
    axios
      .get(`${baseUrl}insurance/get-insurances`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setInsurances(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching insurances:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("InsuranceFormScreen")}
        >
          <Ionicons name="chevron-back" size={32} color="#00BE00" />
        </TouchableOpacity>
        <Text style={styles.cartHeading}>Insurance Packages</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#00BE00" />
        ) : (
          <>
            {insurances.length > 0 ? (
              <FlatList
                data={insurances}
                keyExtractor={(item) => item._id.toString()}
                renderItem={({ item }) => (
                  <Pressable
                    style={styles.card}
                    onPress={() =>
                      navigation.navigate("InsuranceInfoScreen", {
                        id: item._id,
                        name: item.name,
                        price: item.price,
                        description: item.description,
                        coverage: item.coverage,
                        duration: item.duration,
                      })
                    }
                  >
                    <View style={styles.box}>
                      <View style={styles.cardProduct}>
                        <Text style={styles.productTitle}>{item.name}</Text>

                        <View style={styles.quantityContainer}>
                          <Text style={styles.productQuantity}>
                            {item.description}
                          </Text>
                        </View>

                        <View style={styles.priceContainer}>
                          <Text style={styles.productPrice}>
                            Rs. {item.price}
                          </Text>
                        </View>
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
                  </Pressable>
                )}
              />
            ) : (
              <View style={styles.centerContainer}>
                <View style={styles.rowConatiner}>
                  <Text style={styles.noItemsText}>
                    No insurance packages available
                  </Text>
                  <MaterialIcons
                    name="safety-check"
                    size={30}
                    color="#00BE00"
                  />
                </View>
              </View>
            )}
          </>
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
    color: "#00BE00",
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
    flexDirection: "row",
  },
  productQuantity: {
    fontSize: 15,
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
  buybuttonText: {
    fontSize: 15,
    color: "#f7f7f7",
  },
  selectedButton: {
    backgroundColor: "#00BE00", // Change the color to indicate selection
  },
  buyButton: {
    position: "absolute",
    bottom: -2,
    left: 300,
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
});
