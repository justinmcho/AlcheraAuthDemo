import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  BackHandler,
} from "react-native";
import Header from "../components/Header";
import { useNavigation } from "@react-navigation/native";
import LicenseButton from "../components/LicenseButton";

const screenWidth = Math.round(Dimensions.get("window").width);
const screenHeight = Math.round(Dimensions.get("window").height);

const ChooseLicense = () => {
  const 주민등록증 = 100;
  const 운전면허증 = 101;
  // const 여권 = 102;
  // const 외국인등록증 = 103;

  const navigation = useNavigation();

  const goBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    const backAction = () => {
      goBack();
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
      <Header navigationGoal={goBack} />

      <View style={styles.screenDescriptionContainer}>
        <Text style={styles.screenDescriptionTitle}>신분증 선택</Text>
        <Text style={styles.screenDescriptionText}>
          신분증 종류를 선택해 주세요.
        </Text>
      </View>

      {/* 선택 버튼 */}
      <View style={styles.buttonsContainer}>
        <LicenseButton title="주민등록증" color="#406EFF" mode={주민등록증} />
        <LicenseButton title="운전면허증" color="#454EF4" mode={운전면허증} />
      </View>
      {/* 선택 버튼 끝 */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: screenHeight * 0.03947,
    backgroundColor: "white",
  },
  screenDescriptionContainer: {
    marginTop: screenHeight * 0.06,
    paddingLeft: screenWidth * 0.1,
    paddingBottom: screenHeight * 0.065,
  },
  screenDescriptionTitle: {
    color: "#363636",
    fontSize: screenWidth * 0.05,
    fontWeight: "700",
    fontFamily: "NotoSansKR-Regular",
  },
  screenDescriptionText: {
    color: "#363636",
    fontSize: screenWidth * 0.022,
    fontWeight: "700",
    paddingTop: 10,
    fontFamily: "NotoSansKR-Regular",
  },
  buttonsContainer: {
    alignItems: "center",
    alignSelf: "center",
    flexDirection: "row",
  },
});
export default ChooseLicense;
