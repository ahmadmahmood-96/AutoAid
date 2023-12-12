import { StyleSheet, View, Text, StatusBar } from "react-native";

export default function ServiceProviderHomeScreen() {
  return (
    <>
      <View style={styles.container}>
        <StatusBar barStyle="auto" />
        <Text>Service Provider Home Screen</Text>
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
