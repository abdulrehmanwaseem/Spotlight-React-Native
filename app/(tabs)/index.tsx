import Loader from "@/components/Loader";
import NoDataFound from "@/components/NoDataFound";
import Post from "@/components/Post";
import Story from "@/components/Story";
import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { styles } from "@/styles/feed.styles";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { AntDesign } from "@expo/vector-icons";
import { uploadImage } from "@/lib/uploadImage";
import { Id } from "@/convex/_generated/dataModel";
import Toast from "react-native-toast-message";

// Update the type definition to match the actual structure
type StoryItem =
  | {
      _id: Id<"stories">;
      userId: string;
      imageUrl: string;
      storageId: Id<"_storage">;
      user: {
        _id: string;
        username: string;
        image?: string;
        fullName: string;
        email: string;
        followers: number;
        following: number;
        posts: number;
        clerkId: string;
      } | null;
      createdAt: number;
      expiresAt: number;
    }
  | {
      isAddStory: true;
    };

const storyStyles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default function Index() {
  const { signOut } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const posts = useQuery(api.posts.getFeedPosts);

  // Prefetch post images when feed loads
  useEffect(() => {
    if (posts && posts.length > 0) {
      // Prefetch first 5 post images
      const imagesToPrefetch = posts.slice(0, 5).map((post) => post.imageUrl);
      imagesToPrefetch.forEach((imageUrl) => {
        Image.prefetch(imageUrl);
      });
    }
  }, [posts]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };
  if (posts === undefined) return <Loader />;
  if (!posts.length)
    return <NoDataFound icon="home-outline" title="No posts yet" />;

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>SpotLight</Text>
        <TouchableOpacity onPress={() => signOut()}>
          <Ionicons color={COLORS.white} size={24} name="log-out-outline" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        renderItem={({ item }) => <Post post={item} />}
        keyExtractor={({ _id }) => _id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
        ListHeaderComponent={<StoriesSection />}
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        windowSize={5}
        removeClippedSubviews={true}
        updateCellsBatchingPeriod={50}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
        onEndReachedThreshold={0.5}
      />
    </View>
  );
}

const StoriesSection = () => {
  const stories = useQuery(api.stories.getStories);
  const createStory = useMutation(api.stories.createStory);
  const generateUploadUrl = useMutation(api.posts.generateUploadUrl);
  const { user } = useUser();
  const [isUploading, setIsUploading] = useState(false);

  const handleAddStory = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [9, 16],
        quality: 1,
      });

      if (!result.canceled) {
        setIsUploading(true);
        try {
          const { storageId, url } = await uploadImage(
            result.assets[0].uri,
            generateUploadUrl
          );

          try {
            await createStory({ imageUrl: url, storageId });
          } catch (storyError) {
            // Handle the specific error from createStory
            console.error("Story creation error:", storyError);

            let errorMessage = "Failed to create story";
            if (storyError instanceof Error) {
              if (
                storyError.message.includes("You already have an active story")
              ) {
                errorMessage =
                  "You already have an active story. Please delete it first.";
              } else {
                errorMessage = storyError.message;
              }
            }

            Toast.show({
              type: "error",
              text1: "Story Error",
              text2: errorMessage,
              position: "bottom",
              visibilityTime: 3000,
            });
          }
        } catch (uploadError) {
          console.error("Upload error:", uploadError);
          Toast.show({
            type: "error",
            text1: "Upload Error",
            text2: "Failed to upload image. Please try again.",
            position: "bottom",
            visibilityTime: 3000,
          });
        } finally {
          setIsUploading(false);
        }
      }
    } catch (error) {
      console.error("Image picker error:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to select image. Please try again.",
        position: "bottom",
        visibilityTime: 3000,
      });
    }
  };

  if (!stories) return null;

  const storyItems: StoryItem[] = [{ isAddStory: true }, ...stories];

  return (
    <FlatList
      data={storyItems}
      renderItem={({ item }) => {
        if ("isAddStory" in item) {
          return (
            <TouchableOpacity
              style={styles.storyWrapper}
              onPress={handleAddStory}
              disabled={isUploading}
            >
              <View style={[styles.storyRing, styles.noStory]}>
                {isUploading ? (
                  <View style={storyStyles.loaderContainer}>
                    <ActivityIndicator color={COLORS.primary} size="small" />
                  </View>
                ) : (
                  <View style={styles.addStoryIconContainer}>
                    <AntDesign name="plus" size={24} color={COLORS.primary} />
                  </View>
                )}
              </View>
              <Text style={styles.storyUsername}>
                {isUploading ? "Uploading..." : "Add Story"}
              </Text>
            </TouchableOpacity>
          );
        }
        return <Story story={item} />;
      }}
      keyExtractor={(item) => ("isAddStory" in item ? "add-story" : item._id)}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.storiesContainer}
      contentContainerStyle={{ paddingHorizontal: 10 }}
      initialNumToRender={5}
      maxToRenderPerBatch={5}
      windowSize={3}
    />
  );
};
