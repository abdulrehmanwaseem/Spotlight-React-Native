import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { styles } from "@/styles/feed.styles";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Loader from "./Loader";
import Comment from "./Comment";

type CommentsModalType = {
  postId: Id<"posts">;
  visible: boolean;
  onClose: () => void;
};

export default function CommentsModal({
  postId,
  visible,
  onClose,
}: CommentsModalType) {
  const [newComment, setNewComment] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const comments = useQuery(api.comments.getComments, { postId });
  const addComment = useMutation(api.comments.addComment);

  console.log(comments);

  const handleAddComment = async () => {
    if (!newComment.trim() || isPosting) return;

    try {
      setIsPosting(true);
      await addComment({
        content: newComment,
        postId,
      });

      setNewComment("");
    } catch (error) {
      console.log("Error adding comment:", error);
    } finally {
      setIsPosting(false);
    }
  };

  console.log(!newComment.trim());
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={COLORS.white} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Comments</Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.commentsContainer}>
            {comments === undefined ? (
              <Loader />
            ) : (
              <FlatList
                data={comments}
                keyExtractor={({ _id }) => _id}
                renderItem={({ item }) => <Comment comment={item} />}
                contentContainerStyle={styles.commentsList}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>

          <View style={styles.commentInput}>
            <TextInput
              style={styles.input}
              placeholder="Add a comment..."
              placeholderTextColor={COLORS.grey}
              value={newComment}
              onChangeText={setNewComment}
              multiline
              editable={!isPosting}
            />

            <TouchableOpacity
              onPress={handleAddComment}
              disabled={!newComment.trim() || isPosting}
              style={styles.postButtonContainer}
            >
              {isPosting ? (
                <ActivityIndicator color={COLORS.primary} size="small" />
              ) : (
                <Text
                  style={[
                    styles.postButton,
                    (!newComment.trim() || isPosting) &&
                      styles.postButtonDisabled,
                  ]}
                >
                  Post
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
