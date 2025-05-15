import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { ConvexError } from "convex/values";

// Type definition for product creation
export const productInput = {
    name: v.string(),
    description: v.optional(v.string()),
    price: v.number(),
    originalPrice: v.optional(v.number()),
    image: v.string(),
    category: v.string(),
    sizes: v.optional(v.array(v.string())),
    colors: v.optional(v.array(v.string())),
    isNew: v.optional(v.boolean()),
    isSale: v.optional(v.boolean()),
    isActive: v.optional(v.boolean()),
    stock: v.optional(v.number()),
};

// Function to create a new product
export const addProduct = mutation({
    args: {
        ...productInput,
        clerkId: v.string(),
    },
    handler: async (ctx, args) => {
        // First check if the user is an admin
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .first();

        if (!user || user.isAdmin !== true) {
            throw new ConvexError("Unauthorized: Admin access required");
        }

        const now = Date.now();

        const productId = await ctx.db.insert("products", {
            name: args.name,
            description: args.description,
            price: args.price,
            originalPrice: args.originalPrice,
            image: args.image,
            category: args.category,
            sizes: args.sizes,
            colors: args.colors,
            isNew: args.isNew,
            isSale: args.isSale,
            isActive: args.isActive ?? true,
            stock: args.stock,
            createdAt: now,
            updatedAt: now,
            createdBy: user._id,
        });

        return productId;
    },
});

// Function to update an existing product
export const updateProduct = mutation({
    args: {
        id: v.id("products"),
        ...productInput,
        clerkId: v.string(),
    },
    handler: async (ctx, args) => {
        // First check if the user is an admin
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .first();

        if (!user || user.isAdmin !== true) {
            throw new ConvexError("Unauthorized: Admin access required");
        }

        // Check if product exists
        const product = await ctx.db.get(args.id);
        if (!product) {
            throw new ConvexError("Product not found");
        }

        // Update the product
        await ctx.db.patch(args.id, {
            name: args.name,
            description: args.description,
            price: args.price,
            originalPrice: args.originalPrice,
            image: args.image,
            category: args.category,
            sizes: args.sizes,
            colors: args.colors,
            isNew: args.isNew,
            isSale: args.isSale,
            isActive: args.isActive,
            stock: args.stock,
            updatedAt: Date.now(),
        });

        return args.id;
    },
});

// Function to get all products
export const listProducts = query({
    args: {
        category: v.optional(v.string()),
        limit: v.optional(v.number()),
        skipInactive: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        // Get all products first
        let products = await ctx.db.query("products").collect();

        // Filter by category if specified
        if (args.category !== undefined) {
            products = products.filter(product => product.category === args.category);
        }

        // Filter out inactive products if requested
        if (args.skipInactive === true) {
            products = products.filter(product => product.isActive === true);
        }

        // Sort by creation date (newest first)
        products.sort((a, b) => b.createdAt - a.createdAt);

        // Apply limit if specified
        if (typeof args.limit === "number" && args.limit > 0) {
            products = products.slice(0, args.limit);
        }

        return products;
    },
});

// Function to get a product by ID
export const getProduct = query({
    args: { id: v.id("products") },
    handler: async (ctx, args) => {
        const product = await ctx.db.get(args.id);
        return product;
    },
});

// Function to delete a product
export const deleteProduct = mutation({
    args: {
        id: v.id("products"),
        clerkId: v.string(),
    },
    handler: async (ctx, args) => {
        // First check if the user is an admin
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .first();

        if (!user || user.isAdmin !== true) {
            throw new ConvexError("Unauthorized: Admin access required");
        }

        // Check if product exists
        const product = await ctx.db.get(args.id);
        if (!product) {
            throw new ConvexError("Product not found");
        }

        // Delete the product
        await ctx.db.delete(args.id);
        return true;
    },
}); 