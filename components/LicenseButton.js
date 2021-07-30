import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";

import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const screenWidth = Math.round(Dimensions.get("window").width);
const screenHeight = Math.round(Dimensions.get("window").height);

const smallerOne = (x, y) => {
  if (x > y) {
    return y;
  } else {
    return x;
  }
};

const LicenseButton = ({ title, color, mode }) => {
  const navigation = useNavigation();

  return (
    <View style={{ paddingBottom: screenHeight * 0.0197 }}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("CameraScreen", { ID: true, mode: mode })
        }
      >
        <View style={[styles.buttonID, { backgroundColor: color }]}>
          <Text style={styles.buttonTextID}>{title}</Text>
          <View
            style={{ flex: 1, justifyContent: "flex-end", marginBottom: 25 }}
          >
            <View style={styles.arrowContainer}>
              <Icon
                name="arrow-forward-outline"
                size={smallerOne(
                  screenHeight * 0.03289,
                  screenWidth * 0.069444
                )}
                color={color}
              ></Icon>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonID: {
    flexDirection: "column",
    paddingLeft: screenWidth * 0.0277,
    paddingRight: screenWidth * 0.0277,
    borderRadius: screenHeight * 0.05,
    width: screenWidth * 0.38,
    height: screenHeight * 0.2881,
    marginHorizontal: 20,
  },
  buttonTextID: {
    color: "white",
    fontWeight: "700",
    fontSize: screenWidth * 0.04,
    marginLeft: screenWidth * 0.03,
    marginTop: 50,
    fontFamily: "NotoSansKR-Regular",
  },
  arrowContainer: {
    backgroundColor: "white",
    width: screenHeight * 0.0315,
    height: screenHeight * 0.0315,
    borderRadius: screenHeight * 0.0315,
    alignSelf: "flex-end",
    alignItems: "center",
    justifyContent: "center",
    marginRight: screenWidth * 0.03,
  },
});

export default LicenseButton;
