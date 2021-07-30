import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  BackHandler,
} from "react-native";
import Logo from "../components/Logo";
import AsyncStorage from "@react-native-async-storage/async-storage";

const screenWidth = Math.round(Dimensions.get("window").width);
const screenHeight = Math.round(Dimensions.get("window").height);

const DeveloperScreen = ({ route, navigation }) => {
  const { OCR } = route.params;

  const [visits, setVisits] = useState([1, 2, 3]);

  const [isLoading, setIsLoading] = useState(false);
  const [OCRExists, setOCRExists] = useState(false);

  // Used to count the number of users who used the app
  const getAllKeys = async () => {
    let keys = [];
    let values;
    try {
      keys = await AsyncStorage.getAllKeys();
      values = await AsyncStorage.multiGet(keys);
    } catch (e) {
      // read key error
    }
    setVisits(values);
  };

  const goBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    // getData(date);
    getAllKeys();
    if (OCR !== "none") {
      setOCRExists(true);
    }

    // Android back button
    const backAction = () => {
      goBack();
      return true;
    };

    BackHandler.addEventListener("hardwareBackPress", backAction);

    return () =>
      BackHandler.removeEventListener("hardwareBackPress", backAction);
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <Logo />
      <View style={{ marginTop: 60 }}>
        <Text style={{ fontSize: 30, fontWeight: "700", color: "black" }}>
          전시회 유저 수
        </Text>
      </View>
      <View style={styles.dateContainer}>
        {isLoading ? (
          <View></View>
        ) : (
          visits.map((date) => {
            return (
              <Text style={{ fontSize: 20, marginBottom: 10 }}>
                날짜: {date[0]} 유저 수: {date[1]}
              </Text>
            );
          })
        )}
      </View>
      <View style={{ marginTop: 100 }}>
        {OCRExists ? (
          <Text style={{ fontSize: 20, color: "black", fontWeight: "700" }}>
            OCR 결과:
          </Text>
        ) : (
          <View></View>
        )}
        {OCRExists ? (
          OCR.map((word) => {
            return (
              <Text style={{ fontSize: 20, marginBottom: 10 }}>
                {word.recognition_words}
              </Text>
            );
          })
        ) : (
          <View></View>
        )}
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
  dateContainer: {
    paddingTop: screenHeight * 0.05,
  },
  buttonContainer: {
    paddingTop: screenHeight * 0.05,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    width: screenWidth * 0.8333,
    height: screenHeight * 0.092,
    borderRadius: screenWidth * 0.1,
    backgroundColor: "#3B45FF",
  },
});
export default DeveloperScreen;
