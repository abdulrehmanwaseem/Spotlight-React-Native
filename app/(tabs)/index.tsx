import Loader from "@/components/Loader";
import Post from "@/components/Post";
import Story from "@/components/Story";
import { STORIES } from "@/constants/mock-data";
import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { styles } from "@/styles/feed.styles";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  RefreshControl,
} from "react-native";
import NoDataFound from "@/components/NoDataFound";
import { useState, useEffect } from "react";
import { Image } from "expo-image";
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
  return (
    <FlatList
      data={STORIES}
      renderItem={({ item }) => <Story story={item} />}
      keyExtractor={(item) => item.id}
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
