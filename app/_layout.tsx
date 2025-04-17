import "../global.css";

import { toastConfig } from "@/config/toastConfig";
import { COLORS } from "@/constants/theme";
import ClerkAndConvexProvider from "@/providers/ClerkAndConvexProvider";
import { SplashScreen } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import InitialLayout from "../components/initialLayout";
import { useFonts } from "expo-font";
import { useCallback, useEffect } from "react";
import * as NavigationBar from "expo-navigation-bar";
import { Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { StoryProvider } from "@/components/StoryProvider";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "JetBrainsMono-Medium": require("../assets/fonts/JetBrainsMono-Medium.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setBackgroundColorAsync(COLORS.background);
      NavigationBar.setButtonStyleAsync("light");
    }
  }, []);

  return (
    <ClerkAndConvexProvider>
      <StoryProvider>
        <SafeAreaProvider>
          <SafeAreaView
            style={{ flex: 1, backgroundColor: COLORS.background }}
            onLayout={onLayoutRootView}
          >
            <InitialLayout />
            <Toast config={toastConfig} />
          </SafeAreaView>
        </SafeAreaProvider>
        <StatusBar style="light" />
      </StoryProvider>
    </ClerkAndConvexProvider>
  );
}
