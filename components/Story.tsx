import { styles } from "@/styles/feed.styles";
import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";

type Story = {
  id: string;
  username: string;
  avatar: string;
  hasStory: boolean;
};

export default function Story({ story }: { story: Story }) {
  return (
    <TouchableOpacity style={styles.storyWrapper}>
      <View style={[styles.storyRing, !story.hasStory && styles.noStory]}>
        <Image
          source={story.avatar}
          style={styles.storyAvatar}
          priority="high"
          contentFit="cover"
        />
      </View>
      <Text style={styles.storyUsername}>{story.username}</Text>
    </TouchableOpacity>
  );
}
