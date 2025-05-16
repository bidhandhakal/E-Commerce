"use client";

import { useState, useEffect } from "react";
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

    // Limit to 4 related products
    const limitedRelatedProducts = filteredRelatedProducts.slice(0, 4);

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

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
            {/* Product Detail Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden rounded-lg bg-secondary">
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
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
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {limitedRelatedProducts.map((relatedProduct) => (
                            <ProductCard
                                key={relatedProduct._id.toString()}
                                product={{
                                    id: relatedProduct._id.toString(),
                                    name: relatedProduct.name,
                                    price: relatedProduct.price,
                                    originalPrice: relatedProduct.originalPrice,
                                    image: relatedProduct.image,
                                    category: relatedProduct.category,
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
} 