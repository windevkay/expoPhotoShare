import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";

import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import * as Sharing from "expo-sharing";
import uploadToAnonymousFilesAsync from "anonymous-files";

import logo from "./assets/tylogo.png";

export default function App() {
  const [image, setImage] = useState(null);

  const openImagePickerAsync = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission is required to pick images!");
      return;
    }
    const pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (pickerResult.cancelled) return;

    if (Platform.OS === "web") {
      const remoteUri = await uploadToAnonymousFilesAsync(pickerResult.uri);
      setImage({ localUri: pickerResult.uri, remoteUri });
    } else {
      setImage({ localUri: pickerResult.uri, remoteUri: null });
    }
  };

  const openShareDialogAsync = async () => {
    const isSharingAvailable = await Sharing.isAvailableAsync();
    if (!isSharingAvailable) {
      alert(`You can share this image via ${image.remoteUri}`);
      return;
    }
    await Sharing.shareAsync(image.localUri);
    setImage(null);
  };

  if (image) {
    return (
      <View style={styles.container}>
        <Image style={styles.thumbnail} source={{ uri: image.localUri }} />
        <TouchableOpacity onPress={openShareDialogAsync} style={styles.button}>
          <Text style={styles.buttonText}>Share photo 🚀</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />
      <Text style={styles.instruct}>
        Share photos with friends 😊 using the button below!
      </Text>
      <StatusBar style="auto" />

      <TouchableOpacity onPress={openImagePickerAsync} style={styles.button}>
        <Text style={styles.buttonText}>Pick a photo 🖼️</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: { width: 150, height: 150, marginBottom: 10 },
  instruct: {
    color: "#888",
    fontSize: 18,
    marginHorizontal: 15,
    marginBottom: 5,
  },
  button: { backgroundColor: "blue", padding: 15, borderRadius: 5 },
  buttonText: { fontSize: 20, color: "#fff" },
  thumbnail: {
    width: 300,
    height: 300,
    resizeMode: "contain",
  },
});
