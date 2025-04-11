import { View, Text } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { styles } from "@/styles/notifications.styles";

interface NoDataFoundProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
}

export default function NoDataFound({ icon, title }: NoDataFoundProps) {
  return (
    <View style={[styles.container, styles.centered]}>
      <Ionicons name={icon} size={44} color={COLORS.primary} />
      <Text style={{ color: COLORS.primary, marginTop: 4, fontSize: 18 }}>
        {title}
      </Text>
    </View>
  );
}
