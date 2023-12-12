import { StyleSheet, View, Text, StatusBar } from "react-native";

export default function WorkshopOwnerHomeScreen() {
  return (
    <>
      <View style={styles.container}>
        <StatusBar barStyle="auto" />
        <Text>Workshop Owner Home Screen</Text>
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
});
