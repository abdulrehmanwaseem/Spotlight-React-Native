import { OAUTH_PROVIDERS } from "@/constants/oauth";
import { COLORS } from "@/constants/theme";
import { styles } from "@/styles/auth.styles";
import { OAuthProviderConfig, OAuthProviderType } from "@/types/auth";
import { useSSO } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, Text, TextInput, View } from "react-native";
import { logger } from "react-native-logs";
import Toast from "react-native-toast-message";
import { OAuthButton } from "../../components/auth/OAuthButton";

const log = logger.createLogger();

export default function Login() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState<OAuthProviderType | null>(null);
  const { startSSOFlow } = useSSO();

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

  const handleOAuthLogin = async (provider: OAuthProviderConfig) => {
    if (isLoading) return;

    try {
      setIsLoading(provider.strategy);
      log.info(`Starting ${provider.strategy} SSO flow`);

      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: provider.strategy,
      });

      log.info(`${provider.strategy} SSO response:`, {
        hasSessionId: !!createdSessionId,
        hasSetActive: !!setActive,
        timestamp: new Date().toISOString(),
      });

      if (!setActive || !createdSessionId) {
        throw new Error("Failed to get session information");
      }

      await setActive({ session: createdSessionId });
      log.info(`${provider.strategy} login completed successfully`);
    } catch (error) {
      log.error(`${provider.strategy} login error:`, error);
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: "Please check your internet connection and try again.",
        position: "top",
      });
    } finally {
      setIsLoading(null);
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
        <OAuthButton
          provider={OAUTH_PROVIDERS.google}
          isLoading={isLoading === "oauth_google"}
          onPress={() => handleOAuthLogin(OAUTH_PROVIDERS.google)}
        />
        <OAuthButton
          provider={OAUTH_PROVIDERS.github}
          isLoading={isLoading === "oauth_github"}
          onPress={() => handleOAuthLogin(OAUTH_PROVIDERS.github)}
        />
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
