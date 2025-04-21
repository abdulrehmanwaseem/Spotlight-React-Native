// components/StoryView.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  Pressable,
} from "react-native";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AntDesign } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { useUser } from "@clerk/clerk-expo";
import { Image } from "expo-image";
import { Id } from "@/convex/_generated/dataModel";

const { width, height } = Dimensions.get("window");

type Story = {
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
};

export default function StoryView({
  story,
  onClose,
}: {
  story: Story;
  onClose: () => void;
}) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const deleteStory = useMutation(api.stories.deleteStory);
  const { user } = useUser();

  // Get the proper image URL from Convex
  const imageUrl =
    useQuery(api.stories.getStoryImageUrl, {
      storageId: story.storageId,
    }) || story.imageUrl;

  // Prerender the image
  useEffect(() => {
    if (imageUrl) {
      Image.prefetch(imageUrl).catch((err) => {
        console.error("Failed to prefetch image:", err);
        setImageError(true);
      });
    }
  }, [imageUrl]);

  const startProgress = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }

    progressInterval.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 1) {
          if (progressInterval.current) {
            clearInterval(progressInterval.current);
          }
          setIsComplete(true);
          return 1;
        }
        return prev + 0.01;
      });
    }, 50);
  };

  const pauseProgress = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
  };

  useEffect(() => {
    startProgress();
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isComplete) {
      const timeout = setTimeout(() => {
        onClose();
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [isComplete, onClose]);

  const handleDelete = async () => {
    try {
      await deleteStory({ id: story._id });
      onClose();
    } catch (error) {
      console.error("Error deleting story:", error);
    }
  };

  const handlePressIn = () => {
    setIsPaused(true);
    pauseProgress();
  };

  const handlePressOut = () => {
    setIsPaused(false);
    startProgress();
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
      </View>

      <Pressable
        style={styles.imageContainer}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {!imageError ? (
          <Image
            source={imageUrl}
            style={styles.image}
            contentFit="cover"
            onError={() => setImageError(true)}
            transition={200}
            priority="high"
          />
        ) : (
          <View style={[styles.image, styles.errorContainer]}>
            <Text style={styles.errorText}>Failed to load image</Text>
          </View>
        )}
      </Pressable>

      <View style={styles.userInfoContainer}>
        {story?.user?.image ? (
          <Image
            source={story.user.image}
            style={styles.userAvatar}
            contentFit="cover"
          />
        ) : (
          <View style={[styles.userAvatar, styles.defaultAvatar]}>
            <Text style={styles.defaultAvatarText}>
              {story?.user?.username?.charAt(0).toUpperCase() || "U"}
            </Text>
          </View>
        )}
        <View style={styles.userTextContainer}>
          <Text style={styles.username}>{story?.user?.username}</Text>
          <Text style={styles.fullName}>{story?.user?.fullName}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <AntDesign name="close" size={24} color="white" />
      </TouchableOpacity>

      {story.userId === user?.id && (
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <AntDesign name="delete" size={24} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  progressContainer: {
    height: 2,
    backgroundColor: "rgba(255,255,255,0.3)",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  progressBar: {
    height: "100%",
    backgroundColor: COLORS.primary,
  },
  imageContainer: {
    flex: 1,
  },
  image: {
    width,
    height,
    backgroundColor: "black",
  },
  errorContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "white",
    fontSize: 16,
  },
  userInfoContainer: {
    position: "absolute",
    top: 10,
    left: 20,
    zIndex: 2,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 8,
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
  },
  defaultAvatar: {
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  defaultAvatarText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  userTextContainer: {
    flexDirection: "column",
  },
  username: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  fullName: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 2,
  },
  deleteButton: {
    position: "absolute",
    bottom: 40,
    right: 20,
    zIndex: 2,
  },
});
