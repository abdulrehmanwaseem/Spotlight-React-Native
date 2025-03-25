import { COLORS } from "@/constants/theme";
import { styles } from "@/styles/auth.styles";
import { useSSO } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { logger } from "react-native-logs";
import Toast from "react-native-toast-message";

const log = logger.createLogger();

export default function Login() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
    } catch (error) {
      log.error("Email login error:", error);
    }
  };

  const handleGihubLogin = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_github",
      });

      if (!setActive || !createdSessionId) {
        throw new Error("Failed to get session information");
      }

      await setActive({ session: createdSessionId });

      log.info("Github login completed successfully");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: "Please check your internet connection and try again.",
        position: "top",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
      });

      if (!setActive || !createdSessionId) {
        throw new Error("Failed to get session information");
      }

      await setActive({ session: createdSessionId });

      log.info("Google login completed successfully");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: "Please check your internet connection and try again.",
        position: "top",
      });
    } finally {
      setIsLoading(false);
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
          style={[styles.googleButton, isLoading && { opacity: 0.7 }]}
          onPress={handleGoogleLogin}
          activeOpacity={0.9}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={COLORS.surface} />
          ) : (
            <>
              <View style={styles.googleIconContainer}>
                <Ionicons name="logo-google" size={24} color={COLORS.surface} />
              </View>
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            </>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.googleButton,
            isLoading && { opacity: 0.7 },
            { marginBottom: 16 },
          ]}
          onPress={handleGihubLogin}
          activeOpacity={0.9}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={COLORS.surface} />
          ) : (
            <>
              <View style={styles.googleIconContainer}>
                <Ionicons name="logo-github" size={24} color={COLORS.surface} />
              </View>
              <Text style={styles.googleButtonText}>Continue with Github</Text>
            </>
          )}
        </TouchableOpacity>
        <Text className="text-sm text-gray-400 text-md">OR</Text>
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
              placeholder="Continue with Email"
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
