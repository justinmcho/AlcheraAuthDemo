import React, { useEffect } from "react";
import { StyleSheet, Text, View, Image } from "react-native";

const MatchStatus = () => {
  const success = require("../assets/success.png");
  const fail = require("../assets/fail.png");
  return (
    <View>
      <View style={styles.matchStatus}>
        <View style={{ marginBottom: screenHeight * 0.0263 }}>
          <Text style={{ fontWeight: "700", fontSize: screenWidth * 0.05555 }}>
            신분증과 얼굴 매칭에 <Text style={{ color: "#34C759" }}>성공</Text>
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
      <View style={styles.matchStatus}>
        <View style={{ marginBottom: screenHeight * 0.0263 }}>
          <Text style={{ fontWeight: "700", fontSize: screenWidth * 0.05555 }}>
            신분증과 얼굴 매칭에 <Text style={{ color: "#FF3B30" }}>실패</Text>
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
    </View>
  );
};
const styles = StyleSheet.create({
  matchStatus: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default MatchStatus;
