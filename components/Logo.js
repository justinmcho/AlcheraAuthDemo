import React from "react";
import { StyleSheet, View, Image, Dimensions } from "react-native";

const screenWidth = Math.round(Dimensions.get("window").width);
const screenHeight = Math.round(Dimensions.get("window").height);

const Logo = () => {
  const logo = require("../assets/alchera.png");
  return (
    <View>
      <Image
        source={logo}
        style={{
          width: screenWidth * 0.211725,
          height: (screenWidth * 0.211725 * 467) / 2192,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({});
export default Logo;
