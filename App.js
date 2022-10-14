import react, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity, Platform, Share } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import uploadToAnonymousFilesAsync from 'anonymous-files';

const App = () => {
  // console.log("dqwd");

  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  // localStorage.setItem('test', 1);

  const getMovies = async () => {
     try {
      const response = await fetch('https://acnhapi.com/v1/fish');
      const json = await response.json();
      setData(json);
      console.log(data['anchovy']);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getMovies();
  }, []);

  let openImagePickerAsync = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('Permission to access camera is required');
      return;
    }
    const pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (pickerResult.cancelled === true) {
      return;
    }
    if (Platform.OS === 'web') {
      // const remoteUri = await uploadToAnonymousFilesAsync(pickerResult.uri);
      // console.log(remoteUri);
      setSelectedImage({ localUri: pickerResult.uri });
      alert("Your device isn't compatible for sharing")
    } else {

      setSelectedImage({ localUri: pickerResult.uri });
    }
  }

  // let openShareDialog = async () => {
  //   console.log("dqwdqw");
  //   if (!(await Sharing.isAvailableAsync())) {
  //     alert("Sharing isn't available on your device");
  //     return;
  //   }
  //   await Sharing.shareAsync(selectedImage.localUri);
  // }


  let openShareDialog = async () => {
    try {
      const result = await Share.share({
        message: selectedImage.localUri,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pick an image!</Text>
      <TouchableOpacity onPress={openImagePickerAsync}>
        <Image source={{ uri: selectedImage !== null ? selectedImage.localUri : 'https://picsum.photos/200/200' }} style={styles.image} ></Image>
      </TouchableOpacity>
      {
        selectedImage ?
          <TouchableOpacity
            onPress={openShareDialog}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Share this image</Text>
          </TouchableOpacity>
          : <View />
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#292929' },
  title: { fontSize: 30, color: "#fff" },
  image: { height: 200, width: 200, borderRadius: 100, resizeMode: 'contain' },
  button: { backgroundColor: 'deepskyblue', padding: 7, marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 20 }
});

export default App;