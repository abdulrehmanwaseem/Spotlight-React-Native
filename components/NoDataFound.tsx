import { View, Text } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { styles } from "@/styles/notifications.styles";

interface NoDataFoundProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  forUserProfile?: boolean;
}

export default function NoDataFound({
  icon,
  title,
  forUserProfile = false,
}: NoDataFoundProps) {
  return (
    <View
      style={[
        styles.container,
        styles.centered,
        forUserProfile && { flex: 0, height: "100%" },
      ]}
    >
      <Ionicons name={icon} size={44} color={COLORS.primary} />
      <Text style={{ color: COLORS.primary, marginTop: 4, fontSize: 18 }}>
        {title}
      </Text>
    </View>
  );
}
