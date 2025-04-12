import { View, Text, Modal, TouchableOpacity } from "react-native";
import React from "react";
import { styles } from "@/styles/profile.styles";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { Image } from "expo-image";

const SelectedImageModal = ({ selectedPost, setSelectedPost }: any) => {
  return (
    <Modal
      visible={!!selectedPost}
      animationType="fade"
      transparent={true}
      onRequestClose={() => setSelectedPost(null)}
    >
      <View style={styles.modalBackdrop}>
        {selectedPost && (
          <View style={styles.postDetailContainer}>
            <View style={styles.postDetailHeader}>
              <TouchableOpacity onPress={() => setSelectedPost(null)}>
                <Ionicons name="close" size={26} color={COLORS.white} />
              </TouchableOpacity>
            </View>

            <Image
              source={selectedPost.imageUrl}
              cachePolicy={"memory-disk"}
              style={styles.postDetailImage}
            />
          </View>
        )}
      </View>
    </Modal>
  );
};

export default SelectedImageModal;
