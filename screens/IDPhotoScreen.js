import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Dimensions,
  BackHandler,
  Platform,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  PixelRatio,
  Alert,
} from "react-native";
import placeholder from "../assets/license.png";

// below CameraRoll is used to save image to phone cameraroll
import CameraRoll from "@react-native-community/cameraroll";
import Header from "../components/Header";
import ImageEditor from "@react-native-community/image-editor";
import AsyncStorage from "@react-native-async-storage/async-storage";

const screenWidth = Math.round(Dimensions.get("window").width);
const screenHeight = Math.round(Dimensions.get("window").height);

const IDPhotoScreen = ({ route, navigation }) => {
  const [isLoading, setLoading] = useState(true);
  const { secondTry, ReceivedIDPhotoURI, ReceivedFacePhotoURI, mode } =
    route.params;
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);

  const [allOCR, setAllOCR] = useState();
  const [OCRBoxes, setOCRBoxes] = useState([
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
  ]);

  const [finishedCrop, setFinishedCrop] = useState();

  const [username, setUsername] = useState();
  const [userBirthday, setUserBirthday] = useState();

  // @FIXME KakaoAPIKey
  const KakaoAPIKey = "ENTER KAKAO VISION API KEY";

  const [IDPhoto, setIDPhoto] = useState(
    Image.resolveAssetSource(placeholder).uri
  );

  // value is the OCR value we want to store
  // target is the target OCR category name (EX. name or birthday 생년월일)
  const storeData = async (value, target) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(target, jsonValue);
    } catch (e) {
      console.log(e);
    }
  };

  const nextScreen = async () => {
    let cropData;
    if (mode === 100) {
      if (secondTry) {
        navigation.reset({
          index: 4,
          routes: [
            { name: "AuthStartScreen" },
            { name: "ChooseLicenseScreen" },
            {
              name: "IDPhotoScreen",
              params: {
                secondTry: true,
                mode: mode,
                ReceivedIDPhotoURI: finishedCrop,
                ReceivedFacePhotoURI: ReceivedFacePhotoURI,
              },
            },
            {
              name: "FaceRecognition",
              params: {
                secondTry: true,
                mode: mode,
                ReceivedIDPhotoURI: finishedCrop,
                ReceivedFacePhotoURI: ReceivedFacePhotoURI,
              },
            },
            {
              name: "FinishScreen",
              params: {
                mode: mode,
                ReceivedIDPhotoURI: finishedCrop,
                ReceivedFacePhotoURI: ReceivedFacePhotoURI,
              },
            },
          ],
        });
        navigation.navigate("FinishScreen", {
          mode: mode,
          ReceivedIDPhotoURI: finishedCrop,
          ReceivedFacePhotoURI: ReceivedFacePhotoURI,
        });
      } else {
        navigation.navigate("CameraScreen", {
          ID: false,
          mode: mode,
          ReceivedIDPhotoURI: finishedCrop,
          redo: false,
        });
      }
    } else if (mode === 101) {
      cropData = {
        offset: {
          x:
            Platform.OS === "android"
              ? ((imageWidth * 4) / 3) * 0.45 + imageWidth * 0.08
              : imageWidth * 0.05,
          y: Platform.OS === "android" ? imageWidth * 0.3 : imageHeight * 0.335,
        },
        size: {
          width:
            Platform.OS === "android"
              ? imageWidth * 0.35 * (5.4 / 8.6)
              : imageWidth,
          height:
            Platform.OS === "android" ? imageWidth * 0.51 : imageHeight * 0.275,
        },
        displaySize: { width: imageWidth * 0.3, height: imageHeight * 0.3 },
      };
      ImageEditor.cropImage(ReceivedIDPhotoURI, cropData).then((url) => {
        // CameraRoll.save(url);
        if (secondTry) {
          navigation.reset({
            index: 4,
            routes: [
              { name: "AuthStartScreen" },
              { name: "ChooseLicenseScreen" },
              {
                name: "IDPhotoScreen",
                params: {
                  secondTry: true,
                  mode: mode,
                  ReceivedIDPhotoURI: url,
                  ReceivedFacePhotoURI: ReceivedFacePhotoURI,
                },
              },
              {
                name: "FaceRecognition",
                params: {
                  secondTry: true,
                  mode: mode,
                  ReceivedIDPhotoURI: url,
                  ReceivedFacePhotoURI: ReceivedFacePhotoURI,
                },
              },
              {
                name: "FinishScreen",
                params: {
                  mode: mode,
                  ReceivedIDPhotoURI: url,
                  ReceivedFacePhotoURI: ReceivedFacePhotoURI,
                },
              },
            ],
          });
          navigation.navigate("FinishScreen", {
            mode: mode,
            ReceivedIDPhotoURI: url,
            ReceivedFacePhotoURI: ReceivedFacePhotoURI,
          });
        } else {
          navigation.navigate("CameraScreen", {
            ID: false,
            mode: mode,
            RqeceivedIDPhotoURI: url,
            redo: false,
          });
        }
      });
    }
  };

  const readID = (pictureWidth, pictureHeight) => {
    cropID(pictureWidth, pictureHeight).then((croppedImage) => {
      setFinishedCrop(croppedImage);
      // CameraRoll.save(croppedImage);
      OCR(croppedImage);
    });
  };

  const cropID = async (pictureWidth, pictureHeight) => {
    let cropData;
    if (mode === 100) {
      cropData = {
        offset: {
          x:
            Platform.OS === "android"
              ? ((pictureWidth * 4) / 3) * 0.485
              : pictureWidth * 0.05,
          y:
            Platform.OS === "android"
              ? pictureWidth * 0.297
              : pictureHeight * 0.335,
        },
        size: {
          width:
            Platform.OS === "android"
              ? pictureWidth * 0.423 * (5.4 / 8.6)
              : pictureWidth,
          height:
            Platform.OS === "android"
              ? pictureWidth * 0.423
              : pictureHeight * 0.275,
        },
        displaySize: { width: pictureWidth * 0.3, height: pictureHeight * 0.3 },
      };
      return await Promise.resolve(
        ImageEditor.cropImage(ReceivedIDPhotoURI, cropData)
      );
    } else if (mode === 101) {
      cropData = {
        offset: {
          x:
            Platform.OS === "android"
              ? ((pictureWidth * 4) / 3) * 0.485
              : pictureWidth * 0.05,
          y:
            Platform.OS === "android"
              ? pictureWidth * 0.245 - pictureWidth * 0.085
              : pictureHeight * 0.335,
        },
        size: {
          width:
            Platform.OS === "android"
              ? pictureWidth * 0.35 * (5.4 / 8.6)
              : pictureWidth,
          height:
            Platform.OS === "android"
              ? pictureWidth * 0.51
              : pictureHeight * 0.275,
        },
        displaySize: {
          width: pictureWidth * 0.3,
          height: ((pictureWidth * 4) / 3) * 0.3,
        },
      };
      return await Promise.resolve(
        ImageEditor.cropImage(ReceivedIDPhotoURI, cropData)
      );
    }
  };

  const OCR = (croppedImage) => {
    let formdata = new FormData();
    formdata.append("image", {
      type: "image/binary",
      uri: croppedImage,
      name: "ID.jpeg",
    });

    fetch("https://dapi.kakao.com/v2/vision/text/ocr", {
      method: "POST",
      headers: {
        Authorization: "KakaoAK " + KakaoAPIKey,
        "content-type": "multipart/form-data",
        Accept: "application/json",
      },
      body: formdata,
    })
      .then((response) => response.json())
      .then((json) => {
        // let i;
        // for (i=0; i < json.result.length; i++) {
        //   if (json.result[i].recognition_words )
        // }
        if (json.result[0]) {
          setAllOCR(json.result);
          let ocrFinished = filterOCR(json);
          let name = ocrFinished[0];
          let birthday = ocrFinished[1];
          setUsername(name);
          setUserBirthday(birthday);
        } else {
          Alert.alert("신분증을 재촬영 해주세요.");
          navigation.navigate("ChooseLicenseScreen");
        }
      })
      .catch((error) => console.log("This is the error:", error))
      .finally(() => {
        setLoading(false);
      });
  };

  const filterOCR = (json) => {
    let name;
    let birthday;
    var i;
    // logs all recognition_words
    for (i = 0; i < json.result.length; i++) {
      console.log(json.result[i].recognition_words);
    }
    if (mode === 100) {
      if (json.result[0].recognition_words[0] === "주민등록증") {
        if (json.result[1].recognition_words[0][0] === "(") {
          name = json.result[2].recognition_words;
          if (json.result[3].recognition_words[0][0] === "(") {
            birthday = json.result[4].recognition_words;
            setOCRBoxes(json.result[4].boxes);
          } else {
            birthday = json.result[3].recognition_words;
            setOCRBoxes(json.result[3].boxes);
          }
        } else {
          name = json.result[1].recognition_words;
          if (json.result[2].recognition_words[0][0] === "(") {
            birthday = json.result[3].recognition_words;
            setOCRBoxes(json.result[3].boxes);
          } else {
            birthday = json.result[2].recognition_words;
            setOCRBoxes(json.result[2].boxes);
          }
        }
      } else {
        Alert.alert("주민등록증이 아닙니다.");
        navigation.navigate("ChooseLicenseScreen");
      }
    } else if (mode === 101) {
      var i = 0;
      if (json.result[0].recognition_words[0] === "주민등록증") {
        Alert.alert("재촬영 해주세요");
        navigation.navigate("ChooseLicenseScreen");
      }
      while (!/\d/.test(json.result[i].recognition_words[0][0])) {
        i += 1;
      }
      console.log(i);
      console.log(json.result[i].recognition_words[0]);
      while (
        /\d/.test(json.result[i].recognition_words[0]) ||
        json.result[i].recognition_words[0] === "" ||
        !/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(json.result[0].recognition_words[0])
      ) {
        i++;
      }
      name = json.result[i].recognition_words;
      var j = i + 1;
      while (birthday === undefined) {
        if (/\d/.test(json.result[j].recognition_words[0])) {
          birthday = json.result[j];
        } else {
          j++;
        }
      }

      setOCRBoxes(birthday.boxes);
      birthday = birthday.recognition_words;
      while (birthday[0].length < 6) {
        j++;
        birthday[0] += json.result[j].recognition_words[0];
      }
    }
    name = name[0];
    birthday = birthday[0];

    name = editOCRText(name, "name");
    birthday = editOCRText(birthday, "birthday");

    return [name, birthday];
  };

  const editOCRText = (value, target) => {
    let finalValue;
    if (mode === 100 || target === "birthday") {
      var i;

      finalValue = value[0];
      for (i = 1; i < value.length; i++) {
        if (value[i] === "(" || value[i] === "-" || value[i] === "C") {
          break;
        } else {
          finalValue += value[i];
        }
      }
    } else if (mode === 101) {
      finalValue = value;
    }
    if (target === "name") {
      return finalValue
        .replace(/\s/g, "")
        .replace(/\./g, "")
        .replace(/\,/g, "");
    } else {
      return finalValue
        .replace(/\s/g, "")
        .replace(/\./g, "")
        .replace(/\,/g, "");
    }
  };

  useEffect(() => {
    setIDPhoto(ReceivedIDPhotoURI);
    Image.getSize(
      ReceivedIDPhotoURI,
      (width, height) => {
        setImageWidth(width);
        setImageHeight(height);
        readID(width, height);
      },
      (error) => {
        console.error(`Couldn't get the image size: ${error.message}`);
      }
    );
    const backAction = () => {
      goBackToLicense();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);

  const goBackToLicense = () => {
    navigation.navigate("ChooseLicenseScreen");
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <View>
          <Text>로딩중...</Text>
        </View>
      ) : (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View>
            <Header navigationGoal={goBackToLicense} />
            <TouchableWithoutFeedback
              delayLongPress="1000"
              onLongPress={() =>
                navigation.navigate("DeveloperScreen", { OCR: allOCR })
              }
            >
              <View style={styles.screenDescriptionContainer}>
                <Text style={styles.screenDescriptionTitle}>신분증 확인</Text>
                <Text style={styles.screenDescriptionText}>
                  신분증 사진과 자동인식된 정보를 확인해 주세요.
                </Text>
              </View>
            </TouchableWithoutFeedback>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: IDPhoto }}
                style={[
                  styles.image,
                  {
                    height:
                      Platform.OS === "ios"
                        ? screenHeight
                        : // : (screenWidth * 4) / 3,
                          (screenWidth * 4) / 3,
                    marginTop:
                      Platform.OS === "ios"
                        ? -screenHeight * 0.335
                        : -(((screenWidth * 4) / 3) * 0.485),
                    marginLeft:
                      Platform.OS === "ios" ? 0 : -(screenWidth * 0.291),
                  },
                ]}
              />
              {mode === 100 ? (
                <View
                  style={[
                    styles.masking,
                    {
                      height: (OCRBoxes[3][1] - OCRBoxes[0][1]) / 3 + 3,
                      width: 130,
                      marginLeft: 25,
                      // screenWidth * 0.51 -
                      // (OCRBoxes[1][0] - OCRBoxes[0][0]) / 3 -
                      // screenWidth * 0.155,
                      marginTop: 65,

                      // + OCRBoxes[0][0]/3,
                      // ((imageWidth * 4) / 3) * 0.32 + imageWidth * 0.08
                      // marginTop: screenWidth * 0.05,
                      // marginTop: OCRBoxes[0][1] / 3,
                    },
                  ]}
                />
              ) : (
                <View
                  style={[
                    styles.masking,
                    {
                      height: 15,
                      width: 130,
                      // marginLeft: screenWidth * 0.155 + OCRBoxes[0][0] / 3,
                      marginLeft: 110,
                      // screenWidth * 0.51 -
                      // (OCRBoxes[1][0] - OCRBoxes[0][0]) / 3 -
                      // screenWidth * 0.155,
                      // marginTop: screenWidth * 0.03 + OCRBoxes[0][1] / 3,
                      marginTop: 60,

                      // + OCRBoxes[0][0]/3,
                      // ((imageWidth * 4) / 3) * 0.32 + imageWidth * 0.08
                      // marginTop: screenWidth * 0.05,
                      // marginTop: OCRBoxes[0][1] / 3,
                    },
                  ]}
                />
              )}
            </View>
            <View style={styles.OCRContainer}>
              <View style={styles.OCRName}>
                <Text
                  style={{
                    color: "blue",
                    fontWeight: "700",
                    fontSize: 16,
                    marginBottom: 5,
                    fontFamily: "NotoSansKR-Regular",
                  }}
                >
                  이름
                </Text>
                <View
                  style={{
                    backgroundColor: "white",
                    elevation: 3,
                    marginTop: 5,
                    height: screenHeight * 0.045,
                    borderRadius: 5,
                    justifyContent: "center",
                  }}
                >
                  <TextInput>
                    <Text style={styles.OCR}>{username}</Text>
                  </TextInput>
                </View>
              </View>
              <View style={styles.OCRBirthday}>
                <Text
                  style={{
                    color: "blue",
                    fontWeight: "700",
                    fontSize: 16,
                    marginBottom: 5,
                    fontFamily: "NotoSansKR-Regular",
                  }}
                >
                  생년월일
                </Text>
                <View
                  style={{
                    backgroundColor: "white",
                    elevation: 3,
                    marginTop: 5,
                    height: screenHeight * 0.045,
                    borderRadius: 5,
                    justifyContent: "center",
                  }}
                >
                  <TextInput>
                    <Text style={styles.OCR}>{userBirthday}</Text>
                  </TextInput>
                </View>
              </View>
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
                    ID: true,
                    redo: true,
                    secondTry: secondTry,
                    mode: mode,
                  })
                }
              >
                <View style={styles.buttonRedo}>
                  <Text style={styles.buttonTextRedo}>재촬영</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
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
    paddingTop: screenHeight * 0.12,
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
    fontSize: 22,
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
  },
  buttonTextRedo: {
    color: "black",
    fontWeight: "500",
    fontSize: 22,
    fontFamily: "NotoSansKR-Regular",
  },
  masking: {
    position: "absolute",
    backgroundColor: "#3B45FF",
  },
  imageContainer: {
    alignSelf: "center",
    marginTop: screenHeight * 0.06,
    width: screenWidth * 0.423,
    height: screenWidth * 0.423 * (5.4 / 8.6),
    overflow: "hidden",
  },
  image: {
    backgroundColor: "#d8d8d8",
    width: screenWidth,
    marginLeft: -(screenWidth * 0.05),
  },
  OCRContainer: {
    marginTop: screenHeight * 0.04,
    height: 50,
    width: screenWidth * 0.51,
    // alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    flexDirection: "row",
  },
  OCR: {
    color: "gray",
    paddingLeft: 8,
    fontSize: 18,
    // fontFamily: "NotoSansKR-Regular",
    fontWeight: "500",
  },
  OCRName: {
    width: screenWidth * 0.2465,
    height: screenHeight * 0.04414,
    marginRight: 40,
  },
  OCRBirthday: {
    width: screenWidth * 0.2465,
  },
});

export default IDPhotoScreen;
