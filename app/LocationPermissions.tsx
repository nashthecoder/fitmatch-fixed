import * as Location from "expo-location";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function LocationPermissionScreen() {
  const requestPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === "granted") {
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Pour bien fonctionner, FitMatch aura besoin de votre position précise
      </Text>
      <TouchableOpacity style={styles.button} onPress={requestPermission}>
        <Text style={styles.buttonText}>Autoriser</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "red",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
