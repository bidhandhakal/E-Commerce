"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, AlertCircle, Loader2, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { cn } from "../lib/utils";
import { formatPrice } from "../lib/formatters";
import { CartItem } from "../context/CartContext"; // Import the CartItem type

export default function CartPage() {
    const {
        cartItems,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        isLoading
    } = useCart();
    const { isSignedIn, requireAuth } = useAuth();
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    // Check if cart is empty
    const isEmpty = cartItems.length === 0;

    // Require authentication before page loads
    useEffect(() => {
        const checkAuth = async () => {
            await requireAuth("You need to sign in to view your cart");
        };

        checkAuth();
    }, [requireAuth]);

    // Handle checkout button click
    const handleCheckout = async () => {
        if (!isSignedIn) {
            await requireAuth("You need to sign in to checkout");
            return;
        }

        setIsCheckingOut(true);

        // Simulate processing (in a real app, you&apos;d redirect to checkout)
        setTimeout(() => {
            alert("Checkout functionality would go here in a real app!");
            setIsCheckingOut(false);
        }, 1500);
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Loading your cart...</p>
            </div>
        );
    }

    // Empty cart state
    if (isEmpty) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Your Cart</h1>

                <div className="flex flex-col items-center justify-center py-8 sm:py-12 bg-secondary/30 rounded-lg">
                    <div className="w-16 sm:w-20 h-16 sm:h-20 flex items-center justify-center bg-secondary rounded-full mb-4">
                        <AlertCircle className="h-8 sm:h-10 w-8 sm:w-10 text-muted-foreground" />
                    </div>
                    <h2 className="text-lg sm:text-xl font-medium mb-2">Your cart is empty</h2>
                    <p className="text-muted-foreground mb-6 text-center px-4">Looks like you haven&apos;t added anything to your cart yet.</p>
                    <Link
                        href="/shop"
                        className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium transition-colors hover:bg-primary/90"
                    >
                        Start Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Your Cart</h1>

            <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
                {/* Cart Items */}
                <div className="flex-1">
                    {/* Mobile Cart View */}
                    <div className="block lg:hidden space-y-4">
                        {cartItems.map((item) => {
                            // Use productId property that we've added to the CartItem interface
                            // TypeScript will recognize this as optional, avoiding the need for 'any'
                            const productId = item.productId || item.id;

                            return (
                                <div key={item.id} className="bg-card rounded-lg shadow-sm border border-border p-4">
                                    <div className="flex gap-4">
                                        {/* Product image */}
                                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-border bg-secondary">
                                            <Link href={`/products/${productId}`}>
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    width={80}
                                                    height={80}
                                                    className="h-full w-full object-cover object-center cursor-pointer"
                                                />
                                            </Link>
                                        </div>

                                        {/* Product details */}
                                        <div className="flex-1">
                                            <h3 className="text-sm font-medium">
                                                <Link href={`/products/${productId}`} className="hover:text-primary transition-colors">
                                                    {item.name}
                                                </Link>
                                            </h3>
                                            {item.size && (
                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    Size: {item.size}
                                                </p>
                                            )}
                                            {item.color && (
                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    Color: {item.color}
                                                </p>
                                            )}

                                            {/* Price */}
                                            <div className="text-sm mt-1">
                                                {item.originalPrice && item.originalPrice > item.price ? (
                                                    <>
                                                        <span className="text-foreground font-medium">
                                                            {formatPrice(item.price)}
                                                        </span>
                                                        <span className="ml-2 line-through text-muted-foreground">
                                                            {formatPrice(item.originalPrice)}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="text-foreground font-medium">
                                                        {formatPrice(item.price)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Remove button */}
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-destructive hover:text-destructive/80 transition-colors self-start"
                                            aria-label="Remove item"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                    {/* Quantity and total - in a row at the bottom */}
                                    <div className="mt-4 flex items-center justify-between">
                                        <div className="flex items-center border border-border rounded-md">
                                            <button
                                                className="p-2 border-r border-border hover:bg-muted transition-colors"
                                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                aria-label="Decrease quantity"
                                            >
                                                <Minus size={16} className="text-muted-foreground" />
                                            </button>
                                            <div className="flex-1 px-4 py-1.5 text-center min-w-[36px]">
                                                {item.quantity}
                                            </div>
                                            <button
                                                className="p-2 border-l border-border hover:bg-muted transition-colors"
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                aria-label="Increase quantity"
                                            >
                                                <Plus size={16} className="text-muted-foreground" />
                                            </button>
                                        </div>

                                        <div className="text-sm font-medium">
                                            Total: {formatPrice(item.price * item.quantity)}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}

                        {/* Mobile cart actions */}
                        <div className="bg-card rounded-lg shadow-sm border border-border p-4 flex justify-between">
                            <button
                                onClick={clearCart}
                                className="text-sm font-medium text-destructive hover:text-destructive/80 transition-colors"
                            >
                                Clear Cart
                            </button>
                            <Link
                                href="/shop"
                                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>

                    {/* Desktop Cart View */}
                    <div className="hidden lg:block bg-card rounded-lg shadow-sm border border-border">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-border">
                                <thead className="bg-muted">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                            Product
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                            Price
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                            Quantity
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                            Total
                                        </th>
                                        <th scope="col" className="relative px-6 py-3">
                                            <span className="sr-only">Remove</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-card divide-y divide-border">
                                    {cartItems.map((item) => {
                                        // Use productId property that we've added to the CartItem interface
                                        const productId = item.productId || item.id;

                                        return (
                                            <tr key={item.id}>
                                                {/* Product info */}
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-border bg-secondary">
                                                            <Link href={`/products/${productId}`}>
                                                                <Image
                                                                    src={item.image}
                                                                    alt={item.name}
                                                                    width={80}
                                                                    height={80}
                                                                    className="h-full w-full object-cover object-center cursor-pointer"
                                                                />
                                                            </Link>
                                                        </div>
                                                        <div className="ml-4">
                                                            <h3 className="text-sm font-medium">
                                                                <Link href={`/products/${productId}`} className="hover:text-primary transition-colors">
                                                                    {item.name}
                                                                </Link>
                                                            </h3>
                                                            {item.size && (
                                                                <p className="mt-1 text-xs text-muted-foreground">
                                                                    Size: {item.size}
                                                                </p>
                                                            )}
                                                            {item.color && (
                                                                <p className="mt-1 text-xs text-muted-foreground">
                                                                    Color: {item.color}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Price */}
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm">
                                                        {item.originalPrice && item.originalPrice > item.price ? (
                                                            <>
                                                                <span className="text-foreground font-medium">
                                                                    {formatPrice(item.price)}
                                                                </span>
                                                                <span className="ml-2 line-through text-muted-foreground">
                                                                    {formatPrice(item.originalPrice)}
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <span className="text-foreground font-medium">
                                                                {formatPrice(item.price)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Quantity */}
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center border border-border rounded-md w-28">
                                                        <button
                                                            className="p-2 border-r border-border hover:bg-muted transition-colors"
                                                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                            aria-label="Decrease quantity"
                                                        >
                                                            <Minus size={16} />
                                                        </button>
                                                        <div className="flex-1 text-center py-2">
                                                            {item.quantity}
                                                        </div>
                                                        <button
                                                            className="p-2 border-l border-border hover:bg-muted transition-colors"
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            aria-label="Increase quantity"
                                                        >
                                                            <Plus size={16} />
                                                        </button>
                                                    </div>
                                                </td>

                                                {/* Total */}
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium">
                                                        {formatPrice(item.price * item.quantity)}
                                                    </div>
                                                </td>

                                                {/* Remove button */}
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="text-destructive hover:text-destructive/80 transition-colors"
                                                        aria-label="Remove item"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Cart actions */}
                        <div className="px-6 py-4 border-t border-border">
                            <div className="flex justify-between">
                                <button
                                    onClick={clearCart}
                                    className="text-sm font-medium text-destructive hover:text-destructive/80 transition-colors"
                                >
                                    Clear Cart
                                </button>
                                <Link
                                    href="/shop"
                                    className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                                >
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="w-full lg:w-80">
                    <div className="bg-card rounded-lg shadow-sm border border-border p-4 sm:p-6 sticky top-24">
                        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span className="text-right">{formatPrice(getCartTotal())}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Shipping</span>
                                <span className="text-right text-xs sm:text-sm">Calculated at checkout</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Tax</span>
                                <span className="text-right text-xs sm:text-sm">Calculated at checkout</span>
                            </div>
                            <div className="pt-3 border-t border-border flex justify-between font-medium">
                                <span>Total</span>
                                <span>{formatPrice(getCartTotal())}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={isCheckingOut}
                            className={cn(
                                "w-full flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium transition-colors hover:bg-primary/90",
                                isCheckingOut && "opacity-70 cursor-not-allowed"
                            )}
                        >
                            {isCheckingOut ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    Checkout
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 