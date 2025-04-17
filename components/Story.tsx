// components/Story.tsx
import { styles } from "@/styles/feed.styles";
import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { memo } from "react";
import { useStory } from "./StoryProvider";
import { Id } from "@/convex/_generated/dataModel";

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
  hasStory?: boolean;
};

function Story({ story }: { story: Story }) {
  const { showStory } = useStory();

  return (
    <TouchableOpacity
      style={styles.storyWrapper}
      onPress={() => showStory(story)}
    >
      <View style={[styles.storyRing, !story.hasStory && styles.noStory]}>
        <Image
          source={story.user?.image || ""}
          style={styles.storyAvatar}
          priority="high"
          contentFit="cover"
        />
      </View>
      <Text style={styles.storyUsername}>{story.user?.username || "User"}</Text>
    </TouchableOpacity>
  );
}

export default memo(Story);
