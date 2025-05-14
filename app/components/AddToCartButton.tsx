"use client";

import { useState } from "react";
import { ShoppingCart, Check, Loader2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { cn } from "../lib/utils";

interface AddToCartButtonProps {
    product: {
        id: string;
        name: string;
        price: number;
        originalPrice?: number;
        image: string;
        category: string;
        size?: string;
        color?: string;
    };
    className?: string;
    showIcon?: boolean;
    variant?: "default" | "outline" | "subtle";
    size?: "sm" | "md" | "lg";
}

export default function AddToCartButton({
    product,
    className,
    showIcon = true,
    variant = "default",
    size = "md",
}: AddToCartButtonProps) {
    const { addToCart } = useCart();
    const { requireAuth, isSignedIn } = useAuth();
    const [isAdding, setIsAdding] = useState(false);
    const [isAdded, setIsAdded] = useState(false);

    const handleAddToCart = async () => {
        setIsAdding(true);

        try {
            // If the user is not signed in and requires authentication
            if (!isSignedIn) {
                const isAuthorized = await requireAuth("You need to sign in to add items to your cart");

                // If auth is required but user canceled, abort
                if (!isAuthorized) {
                    setIsAdding(false);
                    return;
                }
            }

            // Add item to cart (through CartContext)
            await addToCart(product);

            // Show success state
            setIsAdded(true);
            setTimeout(() => {
                setIsAdded(false);
            }, 2000);
        } catch (error) {
            console.error("Failed to add item to cart:", error);
        } finally {
            setIsAdding(false);
        }
    };

    // Button size classes
    const sizeClasses = {
        sm: "text-xs px-3 py-1.5",
        md: "text-sm px-4 py-2",
        lg: "text-base px-6 py-3",
    };

    // Button variant classes
    const variantClasses = {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105",
        outline: "border border-primary text-primary hover:bg-primary/10 hover:scale-105",
        subtle: "bg-primary/10 text-primary hover:bg-primary/20 hover:scale-105",
    };

    // Combined classes based on props
    const buttonClasses = cn(
        "rounded-md font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer hover:shadow-sm",
        sizeClasses[size],
        variantClasses[variant],
        className
    );

    return (
        <button
            onClick={handleAddToCart}
            disabled={isAdding || isAdded}
            className={buttonClasses}
        >
            {isAdding && (
                <>
                    <Loader2 size={size === "sm" ? 14 : size === "md" ? 16 : 18} className="animate-spin" />
                    Adding...
                </>
            )}
            {isAdded && (
                <>
                    <Check size={size === "sm" ? 14 : size === "md" ? 16 : 18} />
                    Added!
                </>
            )}
            {!isAdding && !isAdded && (
                <>
                    {showIcon && (
                        <ShoppingCart
                            size={size === "sm" ? 14 : size === "md" ? 16 : 18}
                            className="transition-transform group-hover:scale-110"
                        />
                    )}
                    Add to Cart
                </>
            )}
        </button>
    );
} 