"use client";

import Image from "next/image";
import Link from "next/link";
import { Tag } from "lucide-react";
import AddToCartButton from "./AddToCartButton";
import { formatPrice } from "../lib/formatters";

interface ProductCardProps {
    product: {
        id: string;
        name: string;
        price: number;
        originalPrice?: number;
        image: string;
        category: string;
        slug?: string;
    };
}

export default function ProductCard({ product }: ProductCardProps) {
    const isOnSale = product.originalPrice && product.originalPrice > product.price;
    const slug = product.slug || product.id;
    const productUrl = `/products/${slug}`;

    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    return (
        <div className="group relative overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-md">
            {/* Product image */}
            <Link href={productUrl} className="relative block h-64 overflow-hidden bg-secondary">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                />

                {/* Sale badge */}
                {isOnSale && (
                    <div className="absolute left-0 top-4 bg-destructive text-destructive-foreground text-xs font-medium px-3 py-1 rounded-r-md shadow-sm flex items-center gap-1">
                        <Tag size={14} />
                        Sale
                    </div>
                )}
            </Link>

            {/* Product info */}
            <div className="p-4">
                <Link href={productUrl} className="block">
                    <h3 className="mb-1 font-medium line-clamp-1 group-hover:text-primary transition-colors">
                        {product.name}
                    </h3>
                </Link>

                <p className="text-sm text-muted-foreground mb-3">
                    {product.category}
                </p>

                <div className="flex justify-between items-center">
                    <div>
                        {isOnSale ? (
                            <div className="flex items-center gap-2">
                                <span className="font-medium">
                                    {formatPrice(product.price)}
                                </span>
                                <span className="text-sm text-muted-foreground line-through">
                                    {formatPrice(product.originalPrice as number)}
                                </span>
                            </div>
                        ) : (
                            <span className="font-medium">
                                {formatPrice(product.price)}
                            </span>
                        )}
                    </div>

                    <AddToCartButton
                        product={product}
                        variant="subtle"
                        size="sm"
                    />
                </div>
            </div>
        </div>
    );
} 