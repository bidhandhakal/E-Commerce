import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { ConvexError } from "convex/values";

// Get all cart items for a user
export const getCartItems = query({
    args: { clerkId: v.string() },
    handler: async (ctx, args) => {
        // Find the user by Clerk ID
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .first();

        if (!user) {
            return [];
        }

        // Get all cart items for this user
        const cartItems = await ctx.db
            .query("cartItems")
            .withIndex("by_user", (q) => q.eq("userId", user._id))
            .collect();

        return cartItems;
    },
});

// Add an item to the cart
export const addToCart = mutation({
    args: {
        clerkId: v.string(),
        productId: v.string(),
        name: v.string(),
        price: v.number(),
        originalPrice: v.optional(v.number()),
        image: v.string(),
        category: v.string(),
        quantity: v.number(),
        size: v.optional(v.string()),
        color: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { clerkId, productId, quantity, ...productData } = args;

        // Find the user by Clerk ID
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
            .first();

        if (!user) {
            throw new ConvexError("User not found");
        }

        // Check if this product is already in the cart
        const existingItem = await ctx.db
            .query("cartItems")
            .withIndex("by_user_and_product", (q) =>
                q.eq("userId", user._id).eq("productId", productId)
            )
            .first();

        const now = Date.now();

        if (existingItem) {
            // Update quantity of existing item
            const updatedItem = await ctx.db.patch(existingItem._id, {
                quantity: existingItem.quantity + quantity,
                updatedAt: now,
            });
            return updatedItem;
        } else {
            // Add new item to cart
            const newItem = await ctx.db.insert("cartItems", {
                userId: user._id,
                productId,
                ...productData,
                quantity,
                createdAt: now,
                updatedAt: now,
            });
            return newItem;
        }
    },
});

// Update the quantity of a cart item
export const updateCartItemQuantity = mutation({
    args: {
        clerkId: v.string(),
        cartItemId: v.id("cartItems"),
        quantity: v.number(),
    },
    handler: async (ctx, args) => {
        const { clerkId, cartItemId, quantity } = args;

        // Find the user by Clerk ID
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
            .first();

        if (!user) {
            throw new ConvexError("User not found");
        }

        // Get the cart item
        const cartItem = await ctx.db.get(cartItemId);

        // Verify the item belongs to this user
        if (!cartItem || cartItem.userId !== user._id) {
            throw new ConvexError("Cart item not found or does not belong to this user");
        }

        // Update the quantity
        if (quantity <= 0) {
            // Remove the item if quantity is 0 or negative
            await ctx.db.delete(cartItemId);
            return null;
        } else {
            // Update the quantity
            const updatedItem = await ctx.db.patch(cartItemId, {
                quantity,
                updatedAt: Date.now(),
            });
            return updatedItem;
        }
    },
});

// Remove an item from the cart
export const removeCartItem = mutation({
    args: {
        clerkId: v.string(),
        cartItemId: v.id("cartItems"),
    },
    handler: async (ctx, args) => {
        const { clerkId, cartItemId } = args;

        // Find the user by Clerk ID
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
            .first();

        if (!user) {
            throw new ConvexError("User not found");
        }

        // Get the cart item
        const cartItem = await ctx.db.get(cartItemId);

        // Verify the item belongs to this user
        if (!cartItem || cartItem.userId !== user._id) {
            throw new ConvexError("Cart item not found or does not belong to this user");
        }

        // Delete the item
        await ctx.db.delete(cartItemId);
        return true;
    },
});

// Clear the entire cart
export const clearCart = mutation({
    args: {
        clerkId: v.string(),
    },
    handler: async (ctx, args) => {
        // Find the user by Clerk ID
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .first();

        if (!user) {
            throw new ConvexError("User not found");
        }

        // Get all cart items for this user
        const cartItems = await ctx.db
            .query("cartItems")
            .withIndex("by_user", (q) => q.eq("userId", user._id))
            .collect();

        // Delete all items
        for (const item of cartItems) {
            await ctx.db.delete(item._id);
        }

        return true;
    },
}); 