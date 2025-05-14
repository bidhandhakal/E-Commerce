"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

export default function CartPage() {
    const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();
    const { isSignedIn, requireAuth } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            setIsLoading(true);
            const isAuthorized = await requireAuth("You need to sign in to view your cart.");
            if (!isAuthorized) {
                router.push("/");
            }
            setIsLoading(false);
        };

        checkAuth();
    }, [requireAuth, router]);

    if (isLoading) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
        );
    }

    if (!isSignedIn) {
        return null; // Will be redirected by the useEffect
    }

    // Calculate subtotal
    const subtotal = getCartTotal();

    // Calculate shipping
    const shipping = subtotal > 100 ? 0 : 9.99;

    // Calculate total
    const total = subtotal + shipping;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-2xl md:text-3xl font-bold mb-8">Shopping Cart</h1>

            {cartItems.length === 0 ? (
                <div className="text-center py-16">
                    <h2 className="text-xl font-medium mb-4">Your cart is empty</h2>
                    <p className="text-muted-foreground mb-8">
                        Looks like you haven't added anything to your cart yet.
                    </p>
                    <Link
                        href="/shop"
                        className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                    >
                        Continue Shopping
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart items */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Cart header (desktop only) */}
                        <div className="hidden md:grid grid-cols-[3fr,1fr,1fr,auto] gap-4 border-b border-border pb-4 text-sm font-medium text-muted-foreground">
                            <div>Product</div>
                            <div className="text-center">Price</div>
                            <div className="text-center">Quantity</div>
                            <div className="text-right">Total</div>
                        </div>

                        {/* Cart items */}
                        {cartItems.map((item) => (
                            <div
                                key={item.id}
                                className="grid grid-cols-1 md:grid-cols-[3fr,1fr,1fr,auto] gap-4 border-b border-border pb-4"
                            >
                                {/* Product info */}
                                <div className="flex gap-4">
                                    <div className="relative w-20 h-20 flex-shrink-0 bg-muted rounded-md overflow-hidden">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-medium">{item.name}</h3>
                                        <p className="text-sm text-muted-foreground mb-1">
                                            {item.category}
                                        </p>
                                        <div className="flex gap-2 text-xs text-muted-foreground">
                                            <span>Size: {item.size}</span>
                                            <span>•</span>
                                            <span>Color: {item.color}</span>
                                        </div>
                                        {/* Mobile only price */}
                                        <div className="md:hidden mt-2">
                                            <span className="font-medium">
                                                ${item.price.toFixed(2)}
                                            </span>
                                            {item.originalPrice && (
                                                <span className="text-sm text-muted-foreground line-through ml-2">
                                                    ${item.originalPrice.toFixed(2)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Price (desktop only) */}
                                <div className="hidden md:flex items-center justify-center">
                                    <span className="font-medium">${item.price.toFixed(2)}</span>
                                    {item.originalPrice && (
                                        <span className="text-sm text-muted-foreground line-through ml-2">
                                            ${item.originalPrice.toFixed(2)}
                                        </span>
                                    )}
                                </div>

                                {/* Quantity */}
                                <div className="flex items-center md:justify-center">
                                    <div className="flex items-center border border-border rounded-md">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                                            aria-label="Decrease quantity"
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className="w-10 text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                                            aria-label="Increase quantity"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="ml-2 p-2 text-muted-foreground hover:text-foreground transition-colors"
                                        aria-label="Remove item"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                {/* Total */}
                                <div className="flex items-center justify-end font-medium">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-card border border-border rounded-lg p-6">
                            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span>
                                        {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                                    </span>
                                </div>
                                <div className="pt-3 border-t border-border flex justify-between font-medium">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>
                            <button className="w-full py-3 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors">
                                Proceed to Checkout
                            </button>
                            <Link
                                href="/shop"
                                className="flex items-center justify-center mt-4 text-sm text-primary hover:underline"
                            >
                                <ArrowRight size={16} className="mr-1" />
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 