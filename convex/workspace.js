import { mutation, query } from "./_generated/server"; // Add the import statement for query
import { v } from "convex/values"; // Import validation

export const createWorkspace = mutation({
  args: {
    user: v.id("users"),
    messages: v.array(v.object({
      role: v.string(),
      content: v.string(),
    })),
  },
  handler: async (ctx, args) => {
    try {
      console.log("Creating workspace with args:", args);
      const workspaceId = await ctx.db.insert("workspaces", {
        user: args.user,
        messages: args.messages,
      });
      console.log("Workspace created with ID:", workspaceId);
      return workspaceId; // Return the workspace ID string directly
    } catch (error) {
      console.error("Error creating workspace:", error);
      throw new Error("Failed to create workspace");
    }
  },
});

export const GetWorkspace = query({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.get(args.workspaceId);
    return result;
  },
})

export const UpdateMessages = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    messages: v.array(
      v.object({
        role: v.string(),
        content: v.optional(v.string()), // Make the content field optional
      })
    ),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.patch(args.workspaceId, {
      messages: args.messages,
    });
    return result;
  },
});

export const GetAllWorkspaces = query({
  
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.query("workspaces")
   .filter(q=>q.eq(q.field("user"), args.userId))
   .collect();

    return result;
  }
});