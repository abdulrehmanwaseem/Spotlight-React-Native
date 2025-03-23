import { COLORS } from "@/constants/theme";
import { styles } from "@/styles/auth.styles";
import { useSSO } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";

export default function Login() {
  const [email, setEmail] = useState("");

  const { startSSOFlow } = useSSO();
  const router = useRouter();

  const handleEmailLogin = async () => {
    try {
      Toast.show({
        type: "success",
        text1: "Feature",
        text2: "Coming pretty soon! 🎉",
        position: "top",
      });
      // router.replace("/(tabs)");
    } catch (error) {
      console.log("ERROR IN AUTH", error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
      });
      if (setActive && createdSessionId) {
        setActive({ session: createdSessionId });
        router.replace("/(tabs)");
      }
    } catch (error) {
      console.log("ERROR IN AUTH", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.brandSection}>
        <View style={styles.logoContainer}>
          <Ionicons name="leaf" size={32} color={COLORS.primary} />
        </View>
        <Text style={styles.appName}>SpotLight</Text>
        <Text style={styles.tagline}>don't miss anything</Text>
      </View>
      <View style={styles.illustrationContainer}>
        <Image
          source={require("../../assets/images/auth-bg-2.png")}
          style={styles.illustration}
          resizeMode="cover"
        />
      </View>

      <View style={styles.loginSection}>
        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleLogin}
          activeOpacity={0.9}
        >
          <View style={styles.googleIconContainer}>
            <Ionicons name="logo-google" size={24} color={COLORS.surface} />
          </View>
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </TouchableOpacity>
        <Text className="text-sm text-gray-400 text-md ">OR</Text>
        <View className="w-full max-w-[300px] my-5">
          <View className="flex-row items-center bg-white rounded-[14px] px-4 h-16 shadow-md">
            <Ionicons
              name="mail-outline"
              size={20}
              color="#6B7280"
              className="mr-3"
            />
            <TextInput
              className="flex-1 h-full text-base text-surface"
              placeholder="Email address"
              onPress={handleEmailLogin}
              placeholderTextColor="#6B7280"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
        </View>
        <Text style={styles.termsText}>
          By continuing, you agree to your Terms and Privacy Policy
        </Text>
      </View>
    </View>
  );
}
