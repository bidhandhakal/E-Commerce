import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    // Table to store user profiles from Clerk
    users: defineTable({
        // Clerk user ID - this is the link between Clerk and our Convex data
        clerkId: v.string(),
        // User's email from Clerk
        email: v.string(),
        // User's display name
        name: v.optional(v.string()),
        // Profile image URL 
        imageUrl: v.optional(v.string()),
        // User preferences or any additional user data
        preferences: v.optional(v.object({
            theme: v.optional(v.string()),
            receiveEmails: v.optional(v.boolean()),
        })),
        // When the user was first created in our system
        createdAt: v.number(),
        // Last time the user profile was updated
        updatedAt: v.number(),
    })
        .index("by_clerk_id", ["clerkId"])
        .index("by_email", ["email"]),

    // You can add more tables as needed here
}); 