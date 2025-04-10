import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import Popover, { PopoverPlacement } from "react-native-popover-view";
import { styles } from "@/styles/feed.styles";

export default function PostActions({ isPostOwner, onEdit, onDelete }: any) {
  const [showPopover, setShowPopover] = useState(false);

  return (
    <Popover
      isVisible={showPopover}
      placement={PopoverPlacement.LEFT}
      statusBarTranslucent={true}
      popoverStyle={{
        backgroundColor: COLORS.surfaceLight,
      }}
      from={
        <TouchableOpacity onPress={() => setShowPopover(true)}>
          <Ionicons name="ellipsis-horizontal" size={20} color={COLORS.white} />
        </TouchableOpacity>
      }
      onRequestClose={() => setShowPopover(false)}
    >
      <View style={{ display: "flex", flexDirection: "row" }}>
        {isPostOwner ? (
          <>
            <TouchableOpacity
              onPress={() => {
                setShowPopover(false);
              }}
              style={styles.button}
            >
              <Ionicons name="pencil" size={20} color={COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setShowPopover(false);
                onDelete();
              }}
              style={styles.button}
            >
              <Ionicons name="trash-outline" size={20} color={COLORS.primary} />
            </TouchableOpacity>
          </>
        ) : (
          <Text style={[styles.buttonText, { padding: 10, marginLeft: 0 }]}>
            No Actions
          </Text>
        )}
      </View>
    </Popover>
  );
}
