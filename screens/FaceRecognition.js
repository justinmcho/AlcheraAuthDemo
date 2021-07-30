import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
  BackHandler,
  Dimensions,
} from "react-native";

import Header from "../components/Header";
import temporaryFace from "../assets/face.png";

// below CameraRoll is used to save image to phone cameraroll
import CameraRoll from "@react-native-community/cameraroll";
import ImageEditor from "@react-native-community/image-editor";

const screenWidth = Math.round(Dimensions.get("window").width);
const screenHeight = Math.round(Dimensions.get("window").height);

const FaceRecognition = ({ route, navigation }) => {
  const [isLoading, setLoading] = useState(true);

  const { ReceivedIDPhotoURI, ReceivedFacePhotoURI, mode } = route.params;
  const [imageWidth, setImageWidth] = useState();
  const [imageHeight, setImageHeight] = useState();

  const [IDPhoto, setIDPhoto] = useState(ReceivedIDPhotoURI);
  const [facePhoto, setFacePhoto] = useState(
    Image.resolveAssetSource(temporaryFace).uri
  );

  const nextScreen = () => {
    let cropData = {
      offset: {
        x:
          Platform.OS === "android"
            ? imageWidth * (4 / 3) * 0.48 - imageWidth * 0.275
            : imageWidth * 0.05,
        y: Platform.OS === "android" ? imageWidth * 0.3 : imageHeight * 0.335,
      },
      size: {
        width: Platform.OS === "android" ? imageWidth * 0.6 : imageWidth,
        height:
          Platform.OS === "android" ? imageWidth * 0.4 : imageHeight * 0.275,
      },
      displaySize: {
        width: ((imageWidth * 4) / 3) * 0.3,
        height: imageWidth * 0.3,
      },
    };
    ImageEditor.cropImage(ReceivedFacePhotoURI, cropData).then((url) => {
      navigation.navigate("FinishScreen", {
        mode: mode,
        ReceivedIDPhotoURI: IDPhoto,
        ReceivedFacePhotoURI: url,
      });
    });
  };

  useEffect(() => {
    setFacePhoto(ReceivedFacePhotoURI);
    Image.getSize(
      ReceivedFacePhotoURI,
      (width, height) => {
        setImageWidth(width);
        setImageHeight(height);
      },
      (error) => {
        console.error(`Couldn't get the image size: ${error.message}`);
      }
    );

    // Android back button
    const backAction = () => {
      goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    setLoading(false);
    return () => backHandler.remove();
  }, []);

  const goBack = () => {
    navigation.navigate("IDPhotoScreen", {
      secondTry: false,
      mode: mode,
      ReceivedFacePhotoURI: ReceivedFacePhotoURI,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <View></View>
      ) : (
        <View>
          <Header navigationGoal={goBack} />
          <View style={styles.screenDescriptionContainer}>
            <Text style={styles.screenDescriptionTitle}>셀카 확인</Text>
            <Text style={styles.screenDescriptionText}>
              촬영한 얼굴 사진을 확인합니다.
            </Text>
          </View>

          <View style={styles.imageContainer}>
            <Image source={{ uri: facePhoto }} style={styles.image} />
          </View>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity onPress={() => nextScreen()}>
              <View style={styles.buttonCheck}>
                <Text style={styles.buttonTextCheck}>확인</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("CameraScreen", {
                  ID: false,
                  mode: mode,
                  ReceivedIDPhotoURI: ReceivedIDPhotoURI,
                  redo: true,
                })
              }
            >
              <View style={styles.buttonRedo}>
                <Text style={styles.buttonTextRedo}>재촬영</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: screenHeight * 0.03947,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  back: {
    alignItems: "flex-start",
    justifyContent: "center",
    flex: 1,
  },
  screenDescriptionContainer: {
    marginTop: screenHeight * 0.03,
    paddingLeft: screenWidth * 0.1,
  },
  screenDescriptionTitle: {
    fontSize: screenWidth * 0.05,
    fontWeight: "700",
    color: "black",
    fontFamily: "NotoSansKR-Regular",
  },
  screenDescriptionText: {
    paddingTop: 10,
    fontSize: screenWidth * 0.0265,
    color: "black",
    fontFamily: "NotoSansKR-Regular",
  },
  buttonsContainer: {
    paddingTop: screenHeight * 0.075,
    paddingBottom: screenHeight * 0.05,
    alignItems: "center",
  },
  buttonCheck: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3B45FF",
    borderRadius: screenHeight * 0.05,
    height: screenHeight * 0.078125,
    width: screenWidth * 0.76125,
    elevation: 3,
  },
  buttonTextCheck: {
    color: "white",
    fontWeight: "600",
    fontSize: 20,
    fontFamily: "NotoSansKR-Regular",
  },
  buttonRedo: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FAFAFA",
    borderRadius: screenHeight * 0.05,
    marginTop: 15,
    height: screenHeight * 0.078125,
    width: screenWidth * 0.76125,
    elevation: 3,
    fontFamily: "NotoSansKR-Regular",
  },
  buttonTextRedo: {
    color: "black",
    fontWeight: "500",
    fontSize: 20,
  },
  imageContainer: {
    alignSelf: "center",
    marginTop: screenHeight * 0.05,
    width: screenWidth * 0.55,
    height: screenWidth * 0.55,
    borderRadius: screenWidth * 0.3,
    // borderTopLeftRadius: screenWidth * 0.3,
    // borderTopRightRadius: screenWidth * 0.3,
    // borderBottomLeftRadius: screenWidth * 0.3,
    // borderBottomRightRadius: screenWidth * 0.3,
    resizeMode: "cover",
    overflow: "hidden",
  },
  image: {
    height: (screenWidth * 4) / 3,
    width: screenWidth,
    marginLeft: -(screenWidth * 0.225),
    marginTop: -(screenWidth * (4 / 3) * 0.5 - screenWidth * 0.3),
    backgroundColor: "#d8d8d8",
    resizeMode: "cover",
    transform: [{ scaleX: -1 }],
  },
});

export default FaceRecognition;
