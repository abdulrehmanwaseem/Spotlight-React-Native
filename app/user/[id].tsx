import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useLocalSearchParams } from "expo-router";
import { Id } from "@/convex/_generated/dataModel";
import Loader from "@/components/Loader";
import { styles } from "@/styles/profile.styles";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";

const UserProfileScreen = () => {
  const { id } = useLocalSearchParams();

  const profile = useQuery(api.users.getUserProfile, {
    id: id as Id<"users">,
  });
  const posts = useQuery(api.posts.getPostsByUserId, {
    userId: id as Id<"users">,
  });
  const isFollowing = useQuery(api.users.isFollowing, {
    followingId: id as Id<"users">,
  });
  const toggleFollow = useMutation(api.users.toggleFollow);

  const handleBack = () => {};

  if (profile === undefined || posts === undefined || isFollowing === undefined)
    return <Loader />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{profile.username}</Text>
        <View style={{ width: 24 }} />
      </View>
    </View>
  );
};

export default UserProfileScreen;
