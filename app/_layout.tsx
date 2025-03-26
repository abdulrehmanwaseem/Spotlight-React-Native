import "../global.css";

import { toastConfig } from "@/config/toastConfig";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import InitialLayout from "../components/initialLayout";
import ClerkAndConvexProvider from "@/providers/ClerkAndConvexProvider";

export default function RootLayout() {
  return (
    <ClerkAndConvexProvider>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <InitialLayout />
          <Toast config={toastConfig} />
        </SafeAreaView>
      </SafeAreaProvider>
    </ClerkAndConvexProvider>
  );
}
