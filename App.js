import React from "react";
import AuthStartScreen from "./screens/AuthStart";
import ChooseLicenseScreen from "./screens/ChooseLicense";
import CameraScreen from "./screens/CameraScreen";
import IDPhotoScreen from "./screens/IDPhotoScreen";
import DeveloperScreen from "./screens/DeveloperScreen";
import FaceRecognitionScreen from "./screens/FaceRecognition";
import FinishScreen from "./screens/Finish";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="AuthStartScreen"
          component={AuthStartScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CameraScreen"
          component={CameraScreen}
          options={{
            header: null,
            headerShown: false,
            animationEnabled: false,
          }}
        />
        <Stack.Screen
          name="ChooseLicenseScreen"
          component={ChooseLicenseScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="IDPhotoScreen"
          component={IDPhotoScreen}
          options={{ headerShown: false, animationTypeForReplace: "pop" }}
        />
        <Stack.Screen
          name="DeveloperScreen"
          component={DeveloperScreen}
          options={{ headerShown: false, animationTypeForReplace: "pop" }}
        />
        <Stack.Screen
          name="FaceRecognition"
          component={FaceRecognitionScreen}
          options={{ headerShown: false, animationTypeForReplace: "pop" }}
        />
        <Stack.Screen
          name="FinishScreen"
          component={FinishScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
