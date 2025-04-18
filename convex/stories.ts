// convex/stories.ts
import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { internal } from "./_generated/api";
import { api } from "./_generated/api";
import { Doc } from "./_generated/dataModel";

// Get all stories
export const getStories = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const stories = await ctx.db.query("stories").order("desc").collect();

    // Fetch user data for each story
    const storiesWithUsers = await Promise.all(
      stories.map(async (story) => {
        const user = await ctx.db.get(story.userId);
        return {
          ...story,
          user: user
            ? {
                _id: user._id,
                username: user.username,
                image: user.image,
                fullName: user.fullName,
                email: user.email,
                followers: user.followers,
                following: user.following,
                posts: user.posts,
                clerkId: user.clerkId,
              }
            : null,
        };
      })
    );

    return storiesWithUsers;
  },
});

// Create a new story
export const createStory = mutation({
  args: {
    imageUrl: v.string(),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args): Promise<Id<"stories">> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get the user document
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Check if user already has an active story
    const existingStory = await ctx.db
      .query("stories")
      .filter((q) => q.eq(q.field("userId"), user._id))
      .first();

    if (existingStory) {
      throw new ConvexError(
        "You already have an active story. Please delete it first."
      );
    }
    // Create the story
    const storyId = await ctx.db.insert("stories", {
      userId: user._id,
      imageUrl: args.imageUrl,
      storageId: args.storageId,
      createdAt: Date.now(),
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours from now
    });

    return storyId;
  },
});

// Delete a story
export const deleteStory = mutation({
  args: { id: v.id("stories") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const story = await ctx.db.get(args.id);
    if (!story) {
      throw new Error("Story not found");
    }

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), identity.subject))
      .first();

    if (!user || story.userId !== user._id) {
      throw new Error("Not authorized to delete this story");
    }

    await ctx.db.delete(args.id);
  },
});

// Get story image URL
export const getStoryImageUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const url = await ctx.storage.getUrl(args.storageId);
    if (!url) {
      throw new Error("Failed to generate URL for story image");
    }

    return url;
  },
});
