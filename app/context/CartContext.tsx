"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useAuth as useClerkAuth } from "@clerk/nextjs";
import { useConvexAuthContext } from "../providers/ConvexAuthProvider";

// Define a type for Clerk user to ensure it has an id property
type ClerkUserType = {
    id: string;
    [key: string]: unknown;
};

export interface CartItem {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    category: string;
    quantity: number;
    size?: string;
    color?: string;
}

// Extended interface to handle Convex items
interface ConvexCartItem {
    _id: Id<"cartItems">;
    _creationTime: number;
    userId: Id<"users">;
    productId: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    category: string;
    quantity: number;
    size?: string;
    color?: string;
    createdAt: number;
    updatedAt: number;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    getCartTotal: () => number;
    getCartCount: () => number;
    isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}

interface CartProviderProps {
    children: ReactNode;
}

// Helper function to convert Convex cart items to local format
function convertConvexItemsToLocal(items: ConvexCartItem[] | undefined): CartItem[] {
    if (!items) return [];

    return items.map(item => ({
        id: item._id.toString(),
        name: item.name,
        price: item.price,
        originalPrice: item.originalPrice,
        image: item.image,
        category: item.category,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        productId: item.productId
    }));
}

export function CartProvider({ children }: CartProviderProps) {
    const { isSignedIn } = useClerkAuth();
    const { clerkUser, isLoaded: isAuthLoaded } = useConvexAuthContext();
    const typedClerkUser = clerkUser as unknown as ClerkUserType | null;
    const [localCartItems, setLocalCartItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasSyncedCart, setHasSyncedCart] = useState(false);

    // Convex mutations for cart operations
    const addToCartMutation = useMutation(api.cart.addToCart);
    const updateQuantityMutation = useMutation(api.cart.updateCartItemQuantity);
    const removeCartItemMutation = useMutation(api.cart.removeCartItem);
    const clearCartMutation = useMutation(api.cart.clearCart);

    // Fetch cart items from Convex if user is signed in
    const convexCartItems = useQuery(
        api.cart.getCartItems,
        isSignedIn && typedClerkUser?.id ? { clerkId: typedClerkUser.id } : "skip"
    );

    // Load cart from localStorage when the component mounts
    useEffect(() => {
        // Only load from localStorage if auth is loaded and user is not signed in
        if (isAuthLoaded) {
            if (!isSignedIn) {
                const savedCart = localStorage.getItem("cart");
                if (savedCart) {
                    try {
                        setLocalCartItems(JSON.parse(savedCart));
                    } catch (error) {
                        console.error("Failed to parse cart from localStorage:", error);
                    }
                }
                setIsLoading(false);
            }
        }
    }, [isAuthLoaded, isSignedIn]);

    // Save local cart to localStorage when it changes
    useEffect(() => {
        if (!isSignedIn && localCartItems.length >= 0) {
            localStorage.setItem("cart", JSON.stringify(localCartItems));
        }
    }, [localCartItems, isSignedIn]);

    // Set loading state based on Convex query status
    useEffect(() => {
        if (isSignedIn) {
            setIsLoading(convexCartItems === undefined);
        }
    }, [convexCartItems, isSignedIn]);

    // Sync local cart with database when user signs in
    useEffect(() => {
        const syncLocalCartToDatabase = async () => {
            // Only run this if:
            // 1. User is signed in
            // 2. We have a Clerk user ID
            // 3. We have access to the database
            // 4. We haven't already synced the cart in this session
            // 5. We have items in the local cart
            if (isSignedIn && typedClerkUser?.id && convexCartItems !== undefined && !hasSyncedCart && localCartItems.length > 0) {
                try {
                    setIsLoading(true);

                    // Add each local cart item to the database
                    for (const item of localCartItems) {
                        await addToCartMutation({
                            clerkId: typedClerkUser.id,
                            productId: item.id,
                            name: item.name,
                            price: item.price,
                            originalPrice: item.originalPrice,
                            image: item.image,
                            category: item.category,
                            quantity: item.quantity,
                            size: item.size,
                            color: item.color,
                        });
                    }

                    // Clear local cart after syncing
                    localStorage.removeItem("cart");
                    setLocalCartItems([]);
                    setHasSyncedCart(true);
                } catch (error) {
                    console.error("Error syncing local cart to database:", error);
                } finally {
                    setIsLoading(false);
                }
            } else if (isSignedIn && typedClerkUser?.id && convexCartItems !== undefined && !hasSyncedCart) {
                // If there are no items to sync, just mark as synced
                setHasSyncedCart(true);
                setIsLoading(false);
            }
        };

        if (isAuthLoaded) {
            syncLocalCartToDatabase();
        }
    }, [isSignedIn, typedClerkUser, convexCartItems, hasSyncedCart, localCartItems, addToCartMutation, isAuthLoaded]);

    // Combine local and Convex cart items based on authentication state
    const cartItems = isSignedIn && convexCartItems
        ? convertConvexItemsToLocal(convexCartItems)
        : localCartItems;

    // Add item to cart (different implementation based on auth state)
    const addToCart = async (item: Omit<CartItem, "quantity">, quantity = 1) => {
        if (isSignedIn && typedClerkUser?.id) {
            // Add to Convex database
            try {
                await addToCartMutation({
                    clerkId: typedClerkUser.id,
                    productId: item.id,
                    name: item.name,
                    price: item.price,
                    originalPrice: item.originalPrice,
                    image: item.image,
                    category: item.category,
                    quantity,
                    size: item.size,
                    color: item.color,
                });
            } catch (error) {
                console.error("Failed to add item to cart:", error);
            }
        } else {
            // Add to local storage
            setLocalCartItems((prevItems) => {
                const existingItemIndex = prevItems.findIndex((cartItem) => cartItem.id === item.id);

                if (existingItemIndex > -1) {
                    const updatedItems = [...prevItems];
                    updatedItems[existingItemIndex].quantity += quantity;
                    return updatedItems;
                } else {
                    return [...prevItems, { ...item, quantity }];
                }
            });
        }
    };

    // Remove item from cart
    const removeFromCart = async (id: string) => {
        if (isSignedIn && typedClerkUser?.id) {
            // Remove from Convex
            try {
                await removeCartItemMutation({
                    clerkId: typedClerkUser.id,
                    cartItemId: id as Id<"cartItems">,
                });
            } catch (error) {
                console.error("Failed to remove item from cart:", error);
            }
        } else {
            // Remove from local storage
            setLocalCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
        }
    };

    // Update item quantity
    const updateQuantity = async (id: string, quantity: number) => {
        if (quantity < 1) return;

        if (isSignedIn && typedClerkUser?.id) {
            // Update in Convex
            try {
                await updateQuantityMutation({
                    clerkId: typedClerkUser.id,
                    cartItemId: id as Id<"cartItems">,
                    quantity,
                });
            } catch (error) {
                console.error("Failed to update cart item quantity:", error);
            }
        } else {
            // Update in local storage
            setLocalCartItems((prevItems) =>
                prevItems.map((item) =>
                    item.id === id ? { ...item, quantity } : item
                )
            );
        }
    };

    // Clear cart
    const clearCart = async () => {
        if (isSignedIn && typedClerkUser?.id) {
            // Clear in Convex
            try {
                await clearCartMutation({
                    clerkId: typedClerkUser.id,
                });
            } catch (error) {
                console.error("Failed to clear cart:", error);
            }
        } else {
            // Clear local storage
            setLocalCartItems([]);
            localStorage.removeItem("cart");
        }
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const getCartCount = () => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                getCartTotal,
                getCartCount,
                isLoading,
            }}
        >
            {children}
        </CartContext.Provider>
    );
} 