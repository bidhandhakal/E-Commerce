"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useAuth as useClerkAuth } from "@clerk/nextjs";
import { useConvexAuthContext } from "../providers/ConvexAuthProvider";


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
    productId?: string;
}

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

    const addToCartMutation = useMutation(api.cart.addToCart);
    const updateQuantityMutation = useMutation(api.cart.updateCartItemQuantity);
    const removeCartItemMutation = useMutation(api.cart.removeCartItem);
    const clearCartMutation = useMutation(api.cart.clearCart);


    const convexCartItems = useQuery(
        api.cart.getCartItems,
        isSignedIn && typedClerkUser?.id ? { clerkId: typedClerkUser.id } : "skip"
    );

    useEffect(() => {
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

    useEffect(() => {
        if (!isSignedIn && localCartItems.length >= 0) {
            localStorage.setItem("cart", JSON.stringify(localCartItems));
        }
    }, [localCartItems, isSignedIn]);

    useEffect(() => {
        if (isSignedIn) {
            setIsLoading(convexCartItems === undefined);
        }
    }, [convexCartItems, isSignedIn]);

    useEffect(() => {
        const syncLocalCartToDatabase = async () => {
            if (isSignedIn && typedClerkUser?.id && convexCartItems !== undefined && !hasSyncedCart && localCartItems.length > 0) {
                try {
                    setIsLoading(true);

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

                    localStorage.removeItem("cart");
                    setLocalCartItems([]);
                    setHasSyncedCart(true);
                } catch (error) {
                    console.error("Error syncing local cart to database:", error);
                } finally {
                    setIsLoading(false);
                }
            } else if (isSignedIn && typedClerkUser?.id && convexCartItems !== undefined && !hasSyncedCart) {
                setHasSyncedCart(true);
                setIsLoading(false);
            }
        };

        if (isAuthLoaded) {
            syncLocalCartToDatabase();
        }
    }, [isSignedIn, typedClerkUser, convexCartItems, hasSyncedCart, localCartItems, addToCartMutation, isAuthLoaded]);

    const cartItems = isSignedIn && convexCartItems
        ? convertConvexItemsToLocal(convexCartItems)
        : localCartItems;


    const addToCart = async (item: Omit<CartItem, "quantity">, quantity = 1) => {
        if (isSignedIn && typedClerkUser?.id) {
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

    const removeFromCart = async (id: string) => {
        if (isSignedIn && typedClerkUser?.id) {
            try {
                await removeCartItemMutation({
                    clerkId: typedClerkUser.id,
                    cartItemId: id as Id<"cartItems">,
                });
            } catch (error) {
                console.error("Failed to remove item from cart:", error);
            }
        } else {
            setLocalCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
        }
    };

    const updateQuantity = async (id: string, quantity: number) => {
        if (quantity < 1) return;

        if (isSignedIn && typedClerkUser?.id) {
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
            setLocalCartItems((prevItems) =>
                prevItems.map((item) =>
                    item.id === id ? { ...item, quantity } : item
                )
            );
        }
    };

    const clearCart = async () => {
        if (isSignedIn && typedClerkUser?.id) {
            try {
                await clearCartMutation({
                    clerkId: typedClerkUser.id,
                });
            } catch (error) {
                console.error("Failed to clear cart:", error);
            }
        } else {
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