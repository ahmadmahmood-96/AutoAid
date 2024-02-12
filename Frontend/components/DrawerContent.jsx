import { View, StyleSheet, Text } from "react-native";
import { Title, Drawer, Avatar } from "react-native-paper";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { decode } from "base-64";

global.atob = decode;

export default function DrawerContent(props) {
  const [name, setName] = useState("");
  useEffect(() => {
    async function fetchData() {
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwtDecode(token);
      setName(decodedToken.user.name);
    }
    fetchData();
  });

  const handleLogoutPress = async () => {
    await AsyncStorage.removeItem("authToken");
    await AsyncStorage.removeItem("userRole");
    props.navigation.navigate("LoginScreen");
  };

  const getInitials = (name) => {
    if (!name) return "";
    const names = name.split(" ");
    return names
      .map((n) => (n ? n[0].toUpperCase() : ""))
      .join("")
      .substring(0, 2);
  };

  return (
    <>
      <View style={{ flex: 1 }}>
        <DrawerContentScrollView {...props}>
          <View style={styles.drawerContent}>
            <View style={styles.userInfoSection}>
              <View style={{ flexDirection: "row", marginTop: 15 }}>
                <View style={styles.avatarContainer}>
                  <Avatar.Image
                    size={50}
                    style={{ backgroundColor: "#00BE00" }}
                  />
                  <Text style={styles.initialsText}>{getInitials(name)}</Text>
                </View>
                <View
                  style={{
                    marginLeft: 15,
                    flexDirection: "column",
                    marginTop: 6,
                  }}
                >
                  <Title style={styles.title}>{name}</Title>
                </View>
              </View>
            </View>
            <Drawer.Section style={styles.drawerSection} showDivider={false}>
              <DrawerItemList {...props} />
            </Drawer.Section>
          </View>
        </DrawerContentScrollView>
        <Drawer.Section showDivider={false}>
          <DrawerItem
            icon={() => <MaterialIcons name="logout" size={24} color="red" />}
            label="Logout"
            labelStyle={{ color: "red", fontWeight: "600", fontSize: 16 }}
            onPress={() => {
              handleLogoutPress();
            }}
            style={styles.bottomDrawerSection}
          />
        </Drawer.Section>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  initialsContainer: {
    position: "absolute",
    backgroundColor: "#00BE00", // Change the background color of the initials
    borderRadius: 50,
    padding: 5,
    width: 50,
    height: 50,
  },
  initialsText: {
    position: "absolute",
    left: "20%",
    bottom: "28%",
    color: "white", // Change the text color of the initials
    fontWeight: "bold",
    fontSize: 19,
  },
  title: {
    fontSize: 18,
    marginTop: 3,
    fontWeight: "bold",
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  paragraph: {
    fontWeight: "bold",
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    marginBottom: 40,
    borderTopColor: "#f4f4f4",
    borderBottomColor: "#f4f4f4",
    borderTopWidth: 1,
  },
  preference: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
