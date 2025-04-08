import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedUser } from "./users";

export const addComment = mutation({
  args: { content: v.string(), postId: v.id("posts") },
  async handler(ctx, args) {
    const currentUser = await getAuthenticatedUser(ctx);

    const post = await ctx.db.get(args.postId);
    if (!post) throw new ConvexError("Post not found");

    const commentId = await ctx.db.insert("comments", {
      content: args.content,
      postId: args.postId,
      userId: currentUser?._id,
    });

    await ctx.db.patch(args.postId, { comments: post.comments + 1 });

    if (post.userId !== currentUser?._id) {
      await ctx.db.insert("notifications", {
        receiverId: post.userId,
        senderId: currentUser._id,
        type: "comment",
        postId: post._id,
        commentId,
      });
    }

    return commentId;
  },
});

export const getComments = query({
  args: { postId: v.id("posts") },
  async handler(ctx, args) {
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect();

    const commentsWithDetails = comments.map((comment) => {
      const author = ctx.db.get(comment.userId);
      return {
        ...comment,
        author,
      };
    });

    return null;
  },
});
