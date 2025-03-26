import { COLORS } from "@/constants/theme";
import { styles } from "@/styles/auth.styles";
import { OAuthButtonProps } from "@/types/auth";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

export const OAuthButton: React.FC<OAuthButtonProps> = ({
  provider,
  isLoading,
  onPress,
}) => (
  <TouchableOpacity
    style={[styles.googleButton, isLoading && { opacity: 0.7 }]}
    onPress={onPress}
    activeOpacity={0.9}
    disabled={isLoading}
  >
    {isLoading ? (
      <ActivityIndicator size="small" color={COLORS.surface} />
    ) : (
      <>
        <View style={styles.googleIconContainer}>
          <Ionicons
            name={provider.icon as any}
            size={24}
            color={COLORS.surface}
          />
        </View>
        <Text style={styles.googleButtonText}>{provider.text}</Text>
      </>
    )}
  </TouchableOpacity>
);
