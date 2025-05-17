import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { ConvexError } from "convex/values";

// Submit a new contact message to the database
export const submitContactMessage = mutation({
    args: {
        name: v.string(),
        email: v.string(),
        subject: v.string(),
        message: v.string(),
        clerkId: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        // Try to get the user ID if the user is authenticated
        let userId = undefined;

        if (args.clerkId) {
            // Type check - clerkId is now definitely a string
            const clerkId = args.clerkId;
            const user = await ctx.db
                .query("users")
                .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
                .first();

            if (user) {
                userId = user._id;
            }
        }

        // Create the contact message
        const messageId = await ctx.db.insert("contactMessages", {
            userId,
            name: args.name,
            email: args.email,
            subject: args.subject,
            message: args.message,
            status: "new",
            createdAt: Date.now(),
        });

        return messageId;
    },
});

// Get all contact messages (admin only)
export const getAllContactMessages = query({
    args: {
        clerkId: v.string(),
    },
    handler: async (ctx, args) => {
        // Check if user is admin
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .first();

        if (!user || user.isAdmin !== true) {
            throw new ConvexError("Unauthorized: Admin access required");
        }

        // Get all messages sorted by creation time (newest first)
        const messages = await ctx.db
            .query("contactMessages")
            .order("desc")
            .collect();

        return messages;
    },
});

// Update the status of a contact message (admin only)
export const updateMessageStatus = mutation({
    args: {
        clerkId: v.string(),
        messageId: v.id("contactMessages"),
        status: v.string(),
    },
    handler: async (ctx, args) => {
        // Check if user is admin
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .first();

        if (!user || user.isAdmin !== true) {
            throw new ConvexError("Unauthorized: Admin access required");
        }

        // Update the message status
        await ctx.db.patch(args.messageId, {
            status: args.status,
            updatedAt: Date.now(),
        });

        return true;
    },
}); 