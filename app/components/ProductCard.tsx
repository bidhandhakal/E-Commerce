"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Check } from "lucide-react";
import { useCart } from "../context/CartContext";

interface ProductCardProps {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    category: string;
    isNew?: boolean;
    isSale?: boolean;
}

export default function ProductCard({
    id,
    name,
    price,
    originalPrice,
    image,
    category,
    isNew = false,
    isSale = false,
}: ProductCardProps) {
    const [addedToCart, setAddedToCart] = useState(false);
    const { addToCart } = useCart();

    const discount = originalPrice
        ? Math.round(((originalPrice - price) / originalPrice) * 100)
        : 0;

    const handleAddToCart = () => {
        // Add item to cart
        addToCart({
            id,
            name,
            price,
            originalPrice,
            image,
            category,
            size: "M", // Default size
            color: "Default", // Default color
        });

        // Show added confirmation
        setAddedToCart(true);

        // Reset the added state after 2 seconds
        setTimeout(() => {
            setAddedToCart(false);
        }, 2000);
    };

    return (
        <div className="product-card group relative bg-background border border-border rounded-lg overflow-hidden transition-all hover:shadow-md">
            {/* Product badges */}
            <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                {isNew && (
                    <span className="px-2 py-1 text-xs font-semibold bg-accent text-accent-foreground rounded">
                        New
                    </span>
                )}
                {isSale && (
                    <span className="px-2 py-1 text-xs font-semibold bg-destructive text-white rounded">
                        -{discount}%
                    </span>
                )}
            </div>

            {/* Wishlist button */}
            <button
                className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-background/80 border border-border hover:bg-secondary transition-colors"
                aria-label="Add to wishlist"
            >
                <Heart size={18} className="text-foreground" />
            </button>

            {/* Product image */}
            <Link href={`/product/${id}`} className="block aspect-square relative overflow-hidden">
                <Image
                    src={image}
                    alt={name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                />
            </Link>

            {/* Product details */}
            <div className="p-4">
                <div className="flex flex-col mb-1">
                    <p className="product-category text-xs text-muted-foreground mb-1">{category}</p>
                    <Link href={`/product/${id}`}>
                        <h3 className="product-title line-clamp-1 hover:text-primary transition-colors">
                            {name}
                        </h3>
                    </Link>
                </div>

                {/* Price display */}
                <div className="flex justify-between items-center mt-3">
                    <div className="flex items-center gap-1.5">
                        <span className="product-price">
                            ${price.toFixed(2)}
                        </span>
                        {originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                                ${originalPrice.toFixed(2)}
                            </span>
                        )}
                    </div>

                    {/* Quick add to cart */}
                    <button
                        onClick={handleAddToCart}
                        className={`p-2 rounded-full ${addedToCart
                            ? "bg-green-600 text-white"
                            : "bg-primary text-primary-foreground hover:bg-primary/90"
                            } transition-colors`}
                        aria-label={addedToCart ? "Added to cart" : "Add to cart"}
                    >
                        {addedToCart ? <Check size={18} /> : <ShoppingCart size={18} />}
                    </button>
                </div>
            </div>
        </div>
    );
} 