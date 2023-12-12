import { StyleSheet, View, Text, StatusBar } from "react-native";

export default function VehicleOwnerHomeScreen() {
  return (
    <>
      <View style={styles.container}>
        <StatusBar barStyle="auto" />
        <Text>Vehicle Owner Home Screen</Text>
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
