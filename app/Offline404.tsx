import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Offline404 = () => (
  <View style={styles.container}>
    <Ionicons name="cloud-offline-outline" size={80} color="#555" />
    <MaterialIcons name="wifi-off" size={80} color="#555" />
    <Text style={styles.title}>404</Text>
    <Text style={styles.message}>Vous n&apos;êtes pas connecté à Internet</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    marginTop: 20,
    fontSize: 48,
    fontWeight: "bold",
    color: "#333",
  },
  message: {
    marginTop: 12,
    fontSize: 18,
    color: "#666",
    textAlign: "center",
  },
});

export default Offline404;
