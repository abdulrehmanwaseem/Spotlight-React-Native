import Loader from "@/components/Loader";
import NoDataFound from "@/components/NoDataFound";
import SelectedPostModal from "@/components/SelectedPostModal";
import { api } from "@/convex/_generated/api";
import { styles } from "@/styles/feed.styles";
import { useQuery } from "convex/react";
import { Image } from "expo-image";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function Bookmarks() {
  const bookmarkedPosts = useQuery(api.bookmarks.getBookmarkedPosts);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);

  if (bookmarkedPosts === undefined) return <Loader />;
  if (!bookmarkedPosts.length)
    return <NoDataFound icon="bookmark-outline" title="No bookmarks yet" />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bookmarks</Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: 8,
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        {bookmarkedPosts.map((post) => {
          if (!post) return null;

          return (
            <View key={post?._id} style={{ width: "33.33%", padding: 1 }}>
              <TouchableOpacity onPress={() => setSelectedPost(post?.imageUrl)}>
                <Image
                  source={post?.imageUrl}
                  style={{ width: "100%", aspectRatio: 1 }}
                  contentFit="cover"
                  transition={200}
                  cachePolicy="memory-disk"
                />
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
      <SelectedPostModal
        setSelectedPost={setSelectedPost}
        selectedPost={selectedPost}
      />
    </View>
  );
}
