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

    // Table to store user cart items
    cartItems: defineTable({
        // The user ID this cart item belongs to
        userId: v.id("users"),
        // Product details
        productId: v.string(),
        name: v.string(),
        price: v.number(),
        originalPrice: v.optional(v.number()),
        image: v.string(),
        category: v.string(),
        // Quantity of this item in the cart
        quantity: v.number(),
        // Product variations
        size: v.optional(v.string()),
        color: v.optional(v.string()),
        // Timestamps
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_user", ["userId"])
        .index("by_user_and_product", ["userId", "productId"]),

    // You can add more tables as needed here
}); 