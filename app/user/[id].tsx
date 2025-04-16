import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Id } from "@/convex/_generated/dataModel";
import Loader from "@/components/Loader";
import { styles } from "@/styles/profile.styles";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { Image } from "expo-image";
import { Pressable } from "react-native";
import NoDataFound from "@/components/NoDataFound";
import SelectedPostModal from "@/components/SelectedPostModal";

const UserProfileScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [selectedPost, setSelectedPost] = useState<string | null>(null);

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

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  const handleToggleFollow = () => {
    toggleFollow({
      followingId: id as Id<"users">,
    });
  };

  if (
    !id ||
    profile === undefined ||
    posts === undefined ||
    isFollowing === undefined
  )
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

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileInfo}>
          <View style={styles.avatarAndStats}>
            {/* AVATAR */}
            <Image
              source={profile.image}
              style={styles.avatar}
              contentFit="cover"
              cachePolicy="memory-disk"
            />

            {/* STATS */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{profile.posts}</Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{profile.followers}</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{profile.following}</Text>
                <Text style={styles.statLabel}>Following</Text>
              </View>
            </View>
          </View>

          <Text style={styles.name}>{profile.fullName}</Text>
          {profile.bio && <Text style={styles.bio}>{profile.bio}</Text>}

          <Pressable
            style={[styles.followButton, isFollowing && styles.followingButton]}
            onPress={() => handleToggleFollow()}
          >
            <Text
              style={[
                styles.followButtonText,
                isFollowing && styles.followingButtonText,
              ]}
            >
              {isFollowing ? "Following" : "Follow"}
            </Text>
          </Pressable>
        </View>
        <View style={styles.postsGrid}>
          {!posts.length ? (
            <NoDataFound icon="images-outline" title="No posts yet" />
          ) : (
            <FlatList
              data={posts}
              keyExtractor={({ _id }) => _id}
              numColumns={3}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.gridItem}
                  onPress={() => setSelectedPost(item.imageUrl)}
                >
                  <Image
                    source={item.imageUrl}
                    style={styles.gridImage}
                    contentFit="cover"
                    transition={200}
                    cachePolicy="memory-disk"
                  />
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </ScrollView>
      <SelectedPostModal
        setSelectedPost={setSelectedPost}
        selectedPost={selectedPost}
      />
    </View>
  );
};

export default UserProfileScreen;
