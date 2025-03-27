import { mutation, query } from "./_generated/server"; // Correct the import statement
import { v } from "convex/values"; // Import validation

export const createUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    picture: v.string(),
    uid: v.string(),
  },
  handler: async (ctx, args) => {
    // If user already exists, return user
    const user = await ctx.db.query("users").filter((q) => q.eq(q.field("email"), args.email)).collect();
    console.log(user);
    if (user?.length == 0) {
      const result = await ctx.db.insert("users", { name: args.name, email: args.email, picture: args.picture, uid: args.uid });
      console.log(result);
    }
  },
});

export const saveUserDetails = mutation(async ({ db }, userDetails) => {
  await db.insert("users", userDetails);
});

export const GetUser = query({
  args: {
    email: v.optional(v.string()), // Make the email field optional
  },
  handler: async (ctx, args) => {
    if (!args.email) {
      throw new Error("Email is required to fetch user details.");
    }
    const user = await ctx.db.query("users").filter((q) => q.eq(q.field("email"), args.email)).first();
    return user || null;
  },
});