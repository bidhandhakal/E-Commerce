import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { ConvexError } from "convex/values";

// Function to create or update a user profile
// This will be called when a user logs in
export const createOrUpdateUser = mutation({
    args: {
        clerkId: v.string(),
        email: v.string(),
        name: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        // Check if user already exists
        const existingUser = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .first();

        const now = Date.now();

        // Check if this email should be admin
        const adminEmails = [
            "bidhandhakal365@gmail.com",
            "saugatoli808@gmail.com",
            "abhisanpardhe4@gmail.com"
        ];

        const isAdmin = adminEmails.includes(args.email);

        if (existingUser) {
            // Update existing user
            const userId = await ctx.db.patch(existingUser._id, {
                email: args.email,
                name: args.name,
                imageUrl: args.imageUrl,
                isAdmin: isAdmin,
                updatedAt: now,
            });
            return userId;
        } else {
            // Create new user
            const userId = await ctx.db.insert("users", {
                clerkId: args.clerkId,
                email: args.email,
                name: args.name || "",
                imageUrl: args.imageUrl || "",
                isAdmin: isAdmin,
                preferences: {
                    theme: "system",
                    receiveEmails: true,
                },
                createdAt: now,
                updatedAt: now,
            });
            return userId;
        }
    },
});

// Function to get user data by Clerk ID
export const getUserByClerkId = query({
    args: { clerkId: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .first();

        if (!user) {
            return null;
        }

        return user;
    },
});

// Function to check if user is admin
export const isUserAdmin = query({
    args: { clerkId: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .first();

        if (!user) {
            return false;
        }

        return user.isAdmin === true;
    },
});

// Function to update user preferences
export const updateUserPreferences = mutation({
    args: {
        clerkId: v.string(),
        preferences: v.object({
            theme: v.optional(v.string()),
            receiveEmails: v.optional(v.boolean()),
        }),
    },
    handler: async (ctx, args) => {
        // Find the user
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .first();

        if (!user) {
            throw new ConvexError("User not found");
        }

        // Update preferences
        const updatedPreferences = {
            ...user.preferences,
            ...args.preferences,
        };

        // Update the user record
        await ctx.db.patch(user._id, {
            preferences: updatedPreferences,
            updatedAt: Date.now(),
        });

        return true;
    },
});

// Function to delete a user
export const deleteUser = mutation({
    args: { clerkId: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .first();

        if (!user) {
            throw new ConvexError("User not found");
        }

        await ctx.db.delete(user._id);
        return true;
    },
}); 