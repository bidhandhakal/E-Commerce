"use client";

import { useState } from "react";
import { ShoppingCart, Check, Loader2, AlertCircle } from "lucide-react";
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
        stockQuantity?: number;
    };
    className?: string;
    showIcon?: boolean;
    variant?: "default" | "outline" | "subtle";
    size?: "sm" | "md" | "lg";
    customQuantity?: number;
    customSize?: string | null;
    customColor?: string | null;
}

export default function AddToCartButton({
    product,
    className,
    showIcon = true,
    variant = "default",
    size = "md",
    customQuantity = 1,
    customSize = null,
    customColor = null,
}: AddToCartButtonProps) {
    const { addToCart } = useCart();
    const { requireAuth, isSignedIn } = useAuth();
    const [isAdding, setIsAdding] = useState(false);
    const [isAdded, setIsAdded] = useState(false);

    const isOutOfStock = product.stockQuantity !== undefined && product.stockQuantity <= 0;

    const handleAddToCart = async () => {
        if (isOutOfStock) return;

        setIsAdding(true);

        try {
            if (!isSignedIn) {
                const isAuthorized = await requireAuth("You need to sign in to add items to your cart");

                if (!isAuthorized) {
                    setIsAdding(false);
                    return;
                }
            }

            const productToAdd = {
                ...product,
                size: customSize || product.size,
                color: customColor || product.color,
            };

            await addToCart(productToAdd, customQuantity);

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

    const sizeClasses = {
        sm: "text-xs px-3 py-1.5",
        md: "text-sm px-4 py-2",
        lg: "text-base px-6 py-3",
    };

    const variantClasses = {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105",
        outline: "border border-primary text-primary hover:bg-primary/10 hover:scale-105",
        subtle: "bg-primary/10 text-primary hover:bg-primary/20 hover:scale-105",
    };

    const buttonClasses = cn(
        "rounded-md font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer hover:shadow-sm",
        sizeClasses[size],
        variantClasses[variant],
        className
    );

    return (
        <button
            onClick={handleAddToCart}
            disabled={isAdding || isAdded || isOutOfStock}
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
            {!isAdding && !isAdded && isOutOfStock && (
                <>
                    <AlertCircle size={size === "sm" ? 14 : size === "md" ? 16 : 18} />
                    Out of Stock
                </>
            )}
            {!isAdding && !isAdded && !isOutOfStock && (
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