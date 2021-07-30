import React from "react";
import { StyleSheet, View, TouchableOpacity, Dimensions } from "react-native";

import Icon from "react-native-vector-icons/Ionicons";
import Logo from "../components/Logo";

const screenWidth = Math.round(Dimensions.get("window").width);
const screenHeight = Math.round(Dimensions.get("window").height);

const tempHeader = ({ navigationGoal }) => {
  return (
    <View style={styles.header}>
      <View style={styles.back}>
        <TouchableOpacity
          style={{ paddingLeft: 20 }}
          onPress={() => navigationGoal()}
        >
          <Icon name="arrow-back-outline" size={30} color="blue"></Icon>
        </TouchableOpacity>
      </View>
      <View style={styles.logo}>
        <Logo />
      </View>
      <View style={{ flex: 1 }}></View>
    </View>
  );
};
const styles = StyleSheet.create({
  header: {
    backgroundColor: "rgba(0, 0, 0, 0)",
    paddingTop: screenHeight * 0.03,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    resizeMode: "contain",
  },
  back: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
  },
});

export default tempHeader;
