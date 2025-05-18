"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import ProductCard from "../../components/ProductCard";
import { Minus, Plus } from "lucide-react";
import { formatPrice } from "../../lib/formatters";
import AddToCartButton from "../../components/AddToCartButton";

export default function ProductDetailPage() {
    const { slug } = useParams();
    const productId = slug as string;

    // State for selected options
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);

    // State for image zoom effect
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
    const [isDesktop, setIsDesktop] = useState(false);
    const imageContainerRef = useRef<HTMLDivElement>(null);

    // Fetch the current product
    const product = useQuery(api.products.getProduct, {
        id: productId as Id<"products">
    });

    // Fetch related products (same category)
    const relatedProducts = useQuery(api.products.listProducts, {
        skipInactive: true
    });

    // Set default selected options when product loads
    useEffect(() => {
        if (product?.sizes?.length) {
            setSelectedSize(product.sizes[0]);
        }
        if (product?.colors?.length) {
            setSelectedColor(product.colors[0]);
        }
    }, [product]);

    // Filter related products - same category but not the current product
    const filteredRelatedProducts = relatedProducts?.filter(p =>
        p.category === product?.category &&
        p._id.toString() !== productId
    ) || [];

    // Show up to 8 related products instead of 4
    const limitedRelatedProducts = filteredRelatedProducts.slice(0, 8);

    // Detect if device is desktop (has hover capability)
    useEffect(() => {
        // Check if we're in a browser environment
        if (typeof window !== 'undefined') {
            // Initial check
            setIsDesktop(window.matchMedia('(min-width: 768px)').matches);

            // Listen for changes
            const mediaQuery = window.matchMedia('(min-width: 768px)');
            const handleResize = (e: MediaQueryListEvent) => {
                setIsDesktop(e.matches);
            };

            // Modern browsers
            if (mediaQuery.addEventListener) {
                mediaQuery.addEventListener('change', handleResize);
                return () => mediaQuery.removeEventListener('change', handleResize);
            }
        }
    }, []);

    if (!product) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
            </div>
        );
    }

    const isOnSale = product.originalPrice && product.originalPrice > product.price;

    const incrementQuantity = () => {
        setQuantity(prev => Math.min(prev + 1, 10)); // Limit to 10 items
    };

    const decrementQuantity = () => {
        setQuantity(prev => Math.max(prev - 1, 1)); // Minimum 1 item
    };

    // Handle mouse movement for zoom effect - only on desktop
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!imageContainerRef.current || !isDesktop) return;

        const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;

        setZoomPosition({ x, y });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
            {/* Product Detail Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                {/* Product Image with Zoom Effect - PC Only */}
                <div
                    ref={imageContainerRef}
                    className={`relative aspect-square overflow-hidden rounded-lg bg-secondary ${isDesktop ? 'cursor-zoom-in' : ''}`}
                    onMouseEnter={() => isDesktop && setIsZoomed(true)}
                    onMouseLeave={() => isDesktop && setIsZoomed(false)}
                    onMouseMove={handleMouseMove}
                >
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className={`object-cover ${isDesktop ? 'transition-transform duration-200' : ''} ${isZoomed && isDesktop ? 'scale-150' : 'scale-100'}`}
                        style={isZoomed && isDesktop ? {
                            transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
                        } : undefined}
                    />

                    {/* Sale badge */}
                    {isOnSale && (
                        <div className="absolute left-0 top-4 bg-destructive text-destructive-foreground text-xs font-medium px-3 py-1 rounded-r-md shadow-sm">
                            Sale
                        </div>
                    )}
                </div>

                {/* Product Details */}
                <div className="flex flex-col">
                    <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                    <p className="text-muted-foreground mb-4">{product.category}</p>

                    {/* Price */}
                    <div className="mb-6">
                        {isOnSale ? (
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-semibold">
                                    {formatPrice(product.price)}
                                </span>
                                <span className="text-lg text-muted-foreground line-through">
                                    {formatPrice(product.originalPrice as number)}
                                </span>
                            </div>
                        ) : (
                            <span className="text-2xl font-semibold">
                                {formatPrice(product.price)}
                            </span>
                        )}
                    </div>

                    {/* Stock Status */}
                    <div className="mb-6">
                        {product.stock !== undefined && (
                            <>
                                {product.stock <= 0 ? (
                                    <div className="flex items-center gap-2 text-destructive">
                                        <span className="font-medium">Out of Stock</span>
                                    </div>
                                ) : product.stock <= 5 ? (
                                    <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500">
                                        <span className="font-medium">Low Stock</span>
                                        <span>Only {product.stock} left</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-500">
                                        <span className="font-medium">In Stock</span>
                                        <span>{product.stock} available</span>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <h3 className="font-medium mb-2">Description</h3>
                        <p className="text-muted-foreground">
                            {product.description || "No description available."}
                        </p>
                    </div>

                    {/* Sizes */}
                    {product.sizes && product.sizes.length > 0 && (
                        <div className="mb-6">
                            <h3 className="font-medium mb-2">Size</h3>
                            <div className="flex flex-wrap gap-2">
                                {product.sizes.map((size) => (
                                    <button
                                        key={size}
                                        className={`px-4 py-2 border rounded-md text-sm font-medium 
                                            ${selectedSize === size
                                                ? "border-primary bg-primary/10"
                                                : "border-border"
                                            }`}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Colors */}
                    {product.colors && product.colors.length > 0 && (
                        <div className="mb-6">
                            <h3 className="font-medium mb-2">Color</h3>
                            <div className="flex flex-wrap gap-2">
                                {product.colors.map((color) => (
                                    <button
                                        key={color}
                                        className={`px-4 py-2 border rounded-md text-sm font-medium 
                                            ${selectedColor === color
                                                ? "border-primary bg-primary/10"
                                                : "border-border"
                                            }`}
                                        onClick={() => setSelectedColor(color)}
                                    >
                                        {color}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quantity */}
                    <div className="mb-6">
                        <h3 className="font-medium mb-2">Quantity</h3>
                        <div className="flex items-center">
                            <button
                                onClick={decrementQuantity}
                                className="px-3 py-1 border border-border rounded-l-md"
                                disabled={quantity <= 1}
                            >
                                <Minus size={16} />
                            </button>
                            <span className="px-4 py-1 border-y border-border text-center w-12">
                                {quantity}
                            </span>
                            <button
                                onClick={incrementQuantity}
                                className="px-3 py-1 border border-border rounded-r-md"
                                disabled={quantity >= 10}
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Add to Cart */}
                    {product._id && (
                        <AddToCartButton
                            product={{
                                id: product._id.toString(),
                                name: product.name,
                                price: product.price,
                                originalPrice: product.originalPrice,
                                image: product.image,
                                category: product.category,
                                stockQuantity: product.stock,
                            }}
                            size="lg"
                            customQuantity={quantity}
                            customSize={selectedSize}
                            customColor={selectedColor}
                            className="mt-2"
                        />
                    )}
                </div>
            </div>

            {/* Related Products Section */}
            {limitedRelatedProducts.length > 0 && (
                <div>
                    <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                        {limitedRelatedProducts.map((product, index) => (
                            <div
                                key={product._id.toString()}
                                className={`${index % 2 === 0 ? "" : "transform translate-y-4"}`}
                            >
                                <ProductCard
                                    product={{
                                        id: product._id.toString(),
                                        name: product.name,
                                        price: product.price,
                                        originalPrice: product.originalPrice,
                                        image: product.image,
                                        category: product.category,
                                        stockQuantity: product.stock,
                                    }}
                                    hideAddToCart={true}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
} 