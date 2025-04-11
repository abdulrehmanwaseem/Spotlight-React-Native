import Loader from "@/components/Loader";
import NotificationItem from "@/components/NotificationItem";
import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { styles } from "@/styles/notifications.styles";
import { useQuery } from "convex/react";
import React from "react";
import { FlatList, Text, View } from "react-native";
import NoDataFound from "@/components/NoDataFound";

export default function Notifications() {
  const notifications = useQuery(api.notifications.getNotifications, {});

  if (notifications === undefined) return <Loader />;
  if (notifications.length === 0)
    return (
      <NoDataFound icon="notifications-outline" title="No notifications yet" />
    );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      <FlatList
        data={notifications}
        contentContainerStyle={styles.listContainer}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <NotificationItem item={item} />}
      />
    </View>
  );
}
