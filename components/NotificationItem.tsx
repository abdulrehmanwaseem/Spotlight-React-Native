import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { styles } from "@/styles/notifications.styles";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { formatDistanceToNow } from "date-fns";
import { Link } from "expo-router";
import { Image } from "expo-image";

export default function NotificationItem({ item }: any) {
  const renderNotificationIcon = (type: "like" | "comment" | "follow") => {
    const iconMap = {
      like: "heart" as const,
      comment: "chatbubble" as const,
      follow: "person-add" as const,
    };

    const iconColorMap = {
      like: COLORS.primary,
      comment: "#3B82F6",
      follow: "#8B5CF6",
    };

    return (
      <View style={styles.iconBadge}>
        <Ionicons name={iconMap[type]} size={14} color={iconColorMap[type]} />
      </View>
    );
  };

  const renderNotificationText = (
    type: "like" | "comment" | "follow",
    comment?: string
  ) => {
    const actionMap = {
      like: "liked your post",
      comment: `commented: "${comment}"`,
      follow: "started following you",
    };

    return actionMap[type];
  };

  return (
    <View style={styles.notificationItem}>
      <View style={styles.notificationContent}>
        <Link href={`/user/${item.sender._id}`} asChild>
          <TouchableOpacity style={styles.avatarContainer}>
            <Image
              transition={200}
              contentFit="cover"
              source={item?.sender?.image}
              style={styles.avatar}
            />
            {renderNotificationIcon(item.type)}
          </TouchableOpacity>
        </Link>
        <View style={styles.notificationInfo}>
          <Link href={`/user/${item.sender._id}`} asChild>
            <TouchableOpacity>
              <Text style={styles.username}>{item.sender.username}</Text>
            </TouchableOpacity>
          </Link>
          <Text style={styles.action}>
            {renderNotificationText(item.type, item.comment)}
          </Text>
          <Text style={styles.timeAgo}>
            {formatDistanceToNow(item._creationTime)} ago
          </Text>
        </View>
      </View>

      {item.post && (
        <Image
          source={item.post.imageUrl}
          contentFit="cover"
          transition={200}
          style={styles.postImage}
        />
      )}
    </View>
  );
}
