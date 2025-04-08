import { View, Text } from "react-native";
import React, { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQueries, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

type CommentsModal = {
  postId: Id<"posts">;
  visible: boolean;
  onClose: () => void;
  onCommentAdded: () => void;
};

export default function CommentsModal({
  postId,
  visible,
  onClose,
  onCommentAdded,
}: CommentsModal) {
  const [newComment, setNewComment] = useState("");
  const comments = useQuery(api.comments.getComments, {
    postId,
  });
  const addComment = useMutation(api.comments.addComment);

  const handleAddComment = async () => {};

  return (
    <View>
      <Text>CommentsModal</Text>
    </View>
  );
}
