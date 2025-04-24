import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { useRouter } from "expo-router";
import { Id } from "@/convex/_generated/dataModel";

type User = {
  _id: Id<"users">;
  username: string;
  fullName: string;
  image?: string;
};

type FollowersListModalProps = {
  visible: boolean;
  onClose: () => void;
  users: User[];
  title: string;
};

export default function FollowersListModal({
  visible,
  onClose,
  users,
  title,
}: FollowersListModalProps) {
  const router = useRouter();

  const handleUserPress = (userId: Id<"users">) => {
    router.push(`/user/${userId}`);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={users}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.userItem}
                onPress={() => handleUserPress(item._id)}
              >
                <Image
                  source={item.image}
                  style={styles.userAvatar}
                  contentFit="cover"
                />
                <View style={styles.userInfo}>
                  <Text style={styles.username}>{item.username}</Text>
                  <Text style={styles.fullName}>{item.fullName}</Text>
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  No {title.toLowerCase()} yet
                </Text>
              </View>
            )}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.white,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userInfo: {
    marginLeft: 12,
  },
  username: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.white,
  },
  fullName: {
    fontSize: 14,
    color: COLORS.grey,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.grey,
  },
});
