import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Image,
  StatusBar,
  BackHandler,
  Platform,
  SafeAreaView,
} from "react-native";

import { Svg, Defs, Rect, Mask, Circle, Ellipse } from "react-native-svg";
import { RNCamera } from "react-native-camera";
import BackHeader from "../components/tempHeader";

const screenWidth = Math.round(Dimensions.get("window").width);
const screenHeight = Math.round(Dimensions.get("window").height);

const CameraScreen = ({ route, navigation }) => {
  const CameraButton = require("../assets/CameraButton.png");

  const {
    ID,
    ReceivedIDPhotoURI,
    ReceivedFacePhotoURI,
    redo,
    secondTry,
    mode,
  } = route.params;

  const [cameraType, setCameraType] = useState();

  // function that resizes font if device's screenWidth is significantly larger than normal
  const resizableFont = () => {
    if (screenWidth * 0.0555 > screenHeight * 0.0263) {
      return screenHeight * 0.0263;
    } else {
      return screenWidth * 0.0555;
    }
  };

  const MaskedPortion = () => {
    if (!ID) {
      return (
        <Ellipse
          rx={screenWidth * 0.2}
          ry={screenWidth * 0.28}
          cx={screenWidth * 0.5}
          cy={screenWidth * (4 / 3) * 0.48}
          fill="black"
        />

        // Below is the circle version
        // <Circle
        //   r={screenWidth * 0.3}
        //   cx={screenWidth * 0.5}
        //   cy={screenWidth * (4 / 3) * 0.48}
        //   fill="black"
        // />
      );
    } else {
      if (Platform.OS === "ios") {
        return (
          <Rect
            x={screenWidth * 0.05}
            y={screenHeight * 0.335}
            width={screenWidth * 0.9}
            height={screenHeight * 0.275}
            fill="black"
          />
        );
      } else {
        return (
          // 5.4/8.6 신분증 비율
          // @FIXME Fix dimensions below for image crop
          <Rect
            // x={screenWidth * 0.245}
            // y={((screenWidth * 4) / 3) * 0.32}
            // width={screenWidth * 0.51}
            // height={screenWidth * 0.51 * (5.4 / 8.6)}

            //1A dimensions
            x={screenWidth * 0.297}
            y={((screenWidth * 4) / 3) * 0.485}
            width={screenWidth * 0.41}
            height={screenWidth * 0.423 * (5.4 / 8.6)}
            //2B dimensions
            // x={screenWidth * 0.2885}
            // y={((screenWidth * 4) / 3) * 0.445}
            // width={screenWidth * 0.423}
            // height={screenWidth * 0.423 * (5.4 / 8.6)}
            fill="black"
          />
        );
      }
    }
  };

  const CameraMask = () => {
    return (
      <Svg style={{ position: "absolute", flex: 1, margin: 0 }}>
        <Defs>
          <Mask id="mask">
            <Rect height="100%" width="100%" fill="white" />
            <MaskedPortion />
          </Mask>
        </Defs>
        <Rect
          height="100%"
          width="100%"
          fill="rgba(0, 0, 0, 0.8)"
          mask="url(#mask)"
          fill-opacity="0"
        />
      </Svg>
    );
  };

  const takePicture = async () => {
    try {
      if (camera) {
        const options = {
          quality: 0.5,
          base64: true,
          pauseAfterCapture: true,
          orientation: "portrait",
        };
        const data = await camera.takePictureAsync(options);
        nextScreen(data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const nextScreen = (data) => {
    if (ID) {
      navigation.replace("IDPhotoScreen", {
        ReceivedIDPhotoURI: data.uri,
        ReceivedFacePhotoURI: ReceivedFacePhotoURI,
        secondTry: secondTry,
        mode: mode,
      });
    } else {
      navigation.replace("FaceRecognition", {
        ReceivedIDPhotoURI: ReceivedIDPhotoURI,
        ReceivedFacePhotoURI: data.uri,
        mode: mode,
      });
    }
  };

  const redoTakeIDPicture = () => {
    if (!redo) {
      navigation.goBack();
    } else {
      navigation.navigate("IDPhotoScreen");
    }
  };
  const redoTakeFacePicture = () => {
    if (!redo) {
      navigation.goBack();
    } else {
      navigation.navigate("FaceRecognition", {
        ReceivedIDPhotoURI: ReceivedIDPhotoURI,
        mode: mode,
      });
    }
  };

  useEffect(() => {
    let backAction = () => {
      redoTakeIDPicture();
      return true;
    };
    if (ID) {
      setCameraType(RNCamera.Constants.Type.back);
    } else {
      setCameraType(RNCamera.Constants.Type.front);
      backAction = () => {
        redoTakeFacePicture();
        return true;
      };
    }

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      {cameraType === RNCamera.Constants.Type.back && Platform.OS === "ios" ? (
        <View style={styles.previewContainer}>
          <RNCamera
            type={cameraType}
            captureAudio={true}
            style={[
              styles.cameraContainer,
              {
                height:
                  Platform.OS === "ios" ? screenHeight : (screenWidth * 4) / 3,
              },
            ]}
            ratio="4:3"
            ref={(ref) => {
              camera = ref;
            }}
          >
            <CameraMask />

            {ID ? (
              <BackHeader navigationGoal={redoTakeIDPicture} />
            ) : (
              <BackHeader navigationGoal={redoTakeFacePicture} />
            )}
            {ID ? (
              <View style={styles.screenDescriptionContainer}>
                <Text style={styles.screenDescriptionTitle}>신분증 촬영</Text>
                <Text style={styles.screenDescriptionText}>
                  가이드 영역에 맞추어 빛반사가 없도록 신분증을 촬영해주세요.
                </Text>
              </View>
            ) : (
              <View
                style={{
                  paddingTop: "5%",
                  paddingBottom: "5%",
                  paddingHorizontal: "5%",
                }}
              >
                <Text
                  style={{
                    fontSize: resizableFont(),
                    color: "white",
                    alignSelf: "center",
                    textAlign: "center",
                  }}
                >
                  가이드 영역에 얼굴을 맞추어 {"\n"}셀카를 촬영해 주세요.
                </Text>
              </View>
            )}
            <View style={{ flex: 1 }}></View>
            <TouchableOpacity
              onPress={() => takePicture()}
              style={styles.captureButton}
            >
              <Image
                source={CameraButton}
                style={{
                  width: screenHeight * 0.0789,
                  height: screenHeight * 0.0789,
                }}
              />
            </TouchableOpacity>
          </RNCamera>
        </View>
      ) : (
        <View style={styles.previewContainer}>
          <RNCamera
            type={cameraType}
            captureAudio={true}
            style={[
              styles.cameraContainer,
              {
                height: (screenWidth * 4) / 3,
              },
            ]}
            ratio="4:3"
            ref={(ref) => {
              camera = ref;
            }}
          >
            <CameraMask />
          </RNCamera>
          {ID ? (
            <BackHeader navigationGoal={redoTakeIDPicture} />
          ) : (
            <BackHeader navigationGoal={redoTakeFacePicture} />
          )}
          {ID ? (
            <View style={styles.screenDescriptionContainer}>
              <Text style={styles.screenDescriptionTitle}>신분증 촬영</Text>
              <Text style={styles.screenDescriptionText}>
                가이드 영역에 맞추어{" "}
                <Text style={{ fontWeight: "700" }}>
                  빛반사가 없도록 신분증을 촬영
                </Text>
                해 주세요.
              </Text>
            </View>
          ) : (
            <View style={styles.screenDescriptionContainer}>
              <Text style={styles.screenDescriptionTitle}>셀카 촬영</Text>
              <Text style={styles.screenDescriptionText}>
                가이드 영역에 맞추어{" "}
                <Text style={{ fontWeight: "700" }}>
                  빛반사가 없도록 셀카를 촬영
                </Text>
                해 주세요.
              </Text>
            </View>
          )}
          <View style={{ flex: 1 }}></View>
          <TouchableOpacity
            onPress={() => takePicture()}
            style={styles.captureButton}
          >
            <Image
              source={CameraButton}
              style={{
                width: screenHeight * 0.0789,
                height: screenHeight * 0.0789,
              }}
            />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  previewContainer: {
    flex: 1,
    alignItems: "center",
    paddingTop: screenHeight * 0.03947,
    justifyContent: "center",
    height: screenHeight,
  },
  cameraContainer: {
    flex: 1,
    alignSelf: "center",
    width: screenWidth,
    position: "absolute",
  },
  captureButton: {
    flex: 0,
    alignSelf: "center",
    marginTop: screenHeight * 0.05,
    marginBottom: screenHeight * 0.17109375,
  },
  screenDescriptionContainer: {
    marginTop: screenHeight * 0.03,
    marginLeft: screenWidth * 0.1,
    paddingBottom: screenHeight * 0.1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    alignSelf: "flex-start",
  },
  screenDescriptionTitle: {
    fontSize: screenWidth * 0.05,
    fontWeight: "700",
    color: "white",
    fontFamily: "NotoSansKR-Regular",
  },
  screenDescriptionText: {
    paddingTop: 10,
    fontSize: screenWidth * 0.0265,
    color: "white",
    fontFamily: "NotoSansKR-Regular",
  },
});

export default CameraScreen;
