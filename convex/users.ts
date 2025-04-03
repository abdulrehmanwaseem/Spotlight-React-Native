import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Create a new task with the given text
export const createUser = mutation({
  args: {
    username: v.string(),
    fullName: v.string(),
    email: v.string(),
    bio: v.optional(v.string()),
    image: v.optional(v.string()),
    clerkId: v.string(),
  },
  handler: async ({ db }, args) => {
    const existingUser = await db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (existingUser) return;

    await db.insert("users", {
      ...args,
      followers: 0,
      following: 0,
      posts: 0,
    });
  },
});
