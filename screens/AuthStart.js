import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Image,
  BackHandler,
  Alert,
  TouchableWithoutFeedback,
} from "react-native";
import Logo from "../components/Logo";
import AsyncStorage from "@react-native-async-storage/async-storage";

const screenWidth = Math.round(Dimensions.get("window").width);
const screenHeight = Math.round(Dimensions.get("window").height);

const AuthStart = ({ navigation }) => {
  const alcheraCard = require("../assets/AlcheraCard.png");

  const [todayUserNumber, setTodayUserNumber] = useState(0);

  // The AsyncStorage below is used to count the number of users for the app
  var today = new Date();
  let date =
    parseInt(today.getMonth() + 1) +
    "/" +
    today.getDate() +
    "/" +
    today.getFullYear();

  const storeData = async (value, date) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(date, jsonValue);
    } catch (e) {
      // saving error
    }
  };

  const getData = async (target) => {
    try {
      const jsonValue = await AsyncStorage.getItem(target);
      const value = JSON.parse(jsonValue);
      if (value !== null) {
        setTodayUserNumber(value);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const nextScreen = () => {
    storeData(todayUserNumber + 1, date);
    navigation.navigate("ChooseLicenseScreen");
  };

  useEffect(() => {
    getData(date);
    // Android Back button handler
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

    BackHandler.addEventListener("hardwareBackPress", backAction);

    return () =>
      BackHandler.removeEventListener("hardwareBackPress", backAction);
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback
        delayLongPress="1000"
        onLongPress={() =>
          navigation.navigate("DeveloperScreen", { OCR: "none" })
        }
      >
        <View>
          <Logo />
        </View>
      </TouchableWithoutFeedback>
      <View style={styles.imageContainer}>
        <Image source={alcheraCard} style={styles.image} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.text}>
          신분증과 얼굴을 비교하는{" "}
          <Text style={{ color: "#3B45FF", fontWeight: "bold" }}>
            AIIR ID 신분인증
          </Text>
          을 체험해 보세요.
        </Text>
        <Text style={styles.text}>
          촬영된 모든 사진 및 정보는{" "}
          <Text style={{ color: "#3B45FF", fontWeight: "bold" }}>
            저장되지 않습니다
          </Text>
          .
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => nextScreen()}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>확인</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: screenHeight * 0.0394,
    backgroundColor: "white",
  },
  imageContainer: {
    paddingTop: screenHeight * 0.1,
  },
  image: {
    width: screenWidth * 0.60835,
    height: screenWidth * 0.60835,
  },
  textContainer: {
    marginTop: screenHeight * 0.005,
  },
  text: {
    fontSize: screenWidth * 0.032,
    color: "black",
    textAlign: "center",
    fontFamily: "NotoSansKR-Regular",
  },

  buttonContainer: {
    paddingTop: screenHeight * 0.09,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    width: screenWidth * 0.2931,
    height: screenHeight * 0.06953,
    borderRadius: screenWidth * 0.1,
    backgroundColor: "#3B45FF",
  },
  buttonText: {
    color: "white",
    fontSize: screenWidth * 0.035,
    fontWeight: "bold",
    fontFamily: "NotoSansKR-Regular",
  },
});
export default AuthStart;
