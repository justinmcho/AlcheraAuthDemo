import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  BackHandler,
  Alert,
  Image,
} from "react-native";

import Logo from "../components/Logo";

// below CameraRoll is used to save image to phone cameraroll
import CameraRoll from "@react-native-community/cameraroll";

const screenWidth = Math.round(Dimensions.get("window").width);
const screenHeight = Math.round(Dimensions.get("window").height);

const Finish = ({ route, navigation }) => {
  const success = require("../assets/success.png");
  const fail = require("../assets/fail.png");

  const { ReceivedIDPhotoURI, ReceivedFacePhotoURI, mode } = route.params;
  const [match, setMatch] = useState();
  const [compareFinish, setCompareFinish] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  // @FIXME Insert API Key
  const APIKey = "INSERT API KEY";
  const compareFaces = () => {
    let formdata = new FormData();
    formdata.append("imageA", {
      type: "image/jpeg",
      uri: ReceivedIDPhotoURI,
      name: "testing.jpeg",
    });
    formdata.append("imageB", {
      type: "image/jpeg",
      uri: ReceivedFacePhotoURI,
      name: "testing2.jpeg",
    });

    fetch("https://id.aiir.ai/v2/face/compare", {
      method: "POST",
      headers: {
        "x-api-key": APIKey,
        "content-type": "multipart/form-data",
        Accept: "application/json",
      },
      body: formdata,
    })
      .then((response) => response.json())
      .then((json) => {
        setMatch(json.match);
        if (!json.match) {
          console.log(json);
          if (json.result.message != "OK") {
            setErrorMessage(json.result.message);
          }
        }
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setCompareFinish(true);
      });
  };

  const ShowResult = () => {
    if (!compareFinish) {
      return (
        <View>
          <Text>결과 로딩 중</Text>
        </View>
      );
    } else if (match) {
      return (
        <View style={styles.matchStatus}>
          <View style={{ marginBottom: screenHeight * 0.0263 }}>
            <Text
              style={{
                fontWeight: "700",
                fontSize: screenWidth * 0.05555,
                fontFamily: "NotoSansKR-Regular",
              }}
            >
              인증에 <Text style={{ color: "#34C759" }}>성공</Text>
              했습니다.
            </Text>
          </View>
          <Image
            source={success}
            style={{
              resizeMode: "contain",
              width: screenWidth * 0.588,
              height: screenHeight * 0.3289,
            }}
          />
        </View>
      );
    } else {
      return (
        <View style={styles.matchStatus}>
          <View style={{ marginBottom: screenHeight * 0.0263 }}>
            <Text
              style={{
                fontWeight: "700",
                fontSize: screenWidth * 0.05555,
                fontFamily: "NotoSansKR-Regular",
              }}
            >
              인증에 <Text style={{ color: "#FF3B30" }}>실패</Text>
              했습니다.
            </Text>
          </View>
          <Image
            source={fail}
            style={{
              resizeMode: "contain",
              width: screenWidth * 0.588,
              height: screenHeight * 0.3289,
            }}
          />
          <Text>{errorMessage}</Text>
        </View>
      );
    }
  };

  useEffect(() => {
    setCompareFinish(false);
    compareFaces();

    // Android back button
    const backAction = () => {
      Alert.alert("데모앱을 종료하시겠습니까?", "", [
        {
          text: "아니요",
          style: "cancel",
        },
        { text: "예", onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logo}>
        <Logo />
      </View>

      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          marginTop: screenHeight * 0.08,
        }}
      >
        <View
          style={{ flex: 1.5, alignItems: "center", justifyContent: "center" }}
        >
          <ShowResult />
        </View>
        <View style={styles.buttonsContainer}>
          <View style={styles.selectRedo}>
            <TouchableOpacity
              onPress={() =>
                navigation.replace("CameraScreen", {
                  secondTry: true,
                  ID: true,
                  redo: true,
                  mode: mode,
                  ReceivedIDPhotoURI: ReceivedIDPhotoURI,
                  ReceivedFacePhotoURI: ReceivedFacePhotoURI,
                })
              }
            >
              <View style={styles.redoLeft}>
                <Text style={styles.text}>신분증 재촬영</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigation.replace("CameraScreen", {
                  ID: false,
                  secondTry: true,
                  redo: true,
                  mode: mode,
                  ReceivedIDPhotoURI: ReceivedIDPhotoURI,
                  ReceivedFacePhotoURI: ReceivedFacePhotoURI,
                })
              }
            >
              <View style={styles.redoRight}>
                <Text style={styles.text}>셀카 재촬영</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ marginTop: screenHeight * 0.03 }}>
            <TouchableOpacity
              onPress={() => navigation.navigate("AuthStartScreen")}
            >
              <View style={styles.buttonRedo}>
                <Text style={styles.buttonTextRedo}>다시 시작</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: screenHeight * 0.0394,
  },
  logo: {
    alignItems: "center",
    justifyContent: "center",
  },
  matchStatus: {
    alignItems: "center",
    justifyContent: "center",
  },
  redoLeft: {
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#1870d5",
    borderRadius: screenHeight * 0.05,
    backgroundColor: "#3B45FF",
    height: screenHeight * 0.078125,
    width: screenWidth * 0.366875,
    elevation: 3,
  },
  redoRight: {
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#1870d5",
    borderRadius: screenHeight * 0.05,
    backgroundColor: "#5B63F3",
    height: screenHeight * 0.078125,
    width: screenWidth * 0.366875,
    marginLeft: screenWidth * 0.016798,
    elevation: 3,
  },
  selectRedo: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  buttonsContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: screenHeight * 0.05,
  },
  buttonRedo: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FAFAFA",
    borderRadius: screenHeight * 0.05,
    height: screenHeight * 0.078125,
    width: screenWidth * 0.76125,
    elevation: 3,
  },
  buttonTextRedo: {
    color: "black",
    fontWeight: "600",
    fontSize: screenWidth * 0.04,
    fontFamily: "NotoSansKR-Regular",
  },
  text: {
    color: "white",
    fontWeight: "500",
    fontSize: screenWidth * 0.035,
    fontFamily: "NotoSansKR-Regular",
  },
});
export default Finish;
