"use client";

import Link from "next/link";
import ProductCard from "./ProductCard";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function FeaturedProducts() {
    // Fetch featured products - get 4 active products
    const productsResult = useQuery(api.products.listProducts, {
        skipInactive: true,
        limit: 4
    });

    // Safely handle the products result
    const products = productsResult || [];

    return (
        <section className="py-20 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="mb-3">
                        Featured Collection
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Discover our handpicked selection of premium t-shirts designed for comfort and style
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-8">
                    {products.length > 0 ? (
                        products.map((product) => (
                            <ProductCard
                                key={product._id.toString()}
                                product={{
                                    id: product._id.toString(),
                                    name: product.name,
                                    price: product.price,
                                    originalPrice: product.originalPrice,
                                    image: product.image,
                                    category: product.category
                                }}
                            />
                        ))
                    ) : (
                        // Placeholder cards when no products are available
                        Array(4).fill(0).map((_, index) => (
                            <div
                                key={index}
                                className="bg-secondary h-72 sm:h-96 rounded-lg animate-pulse"
                            />
                        ))
                    )}
                </div>

                <div className="mt-12 text-center">
                    <Link
                        href="/shop"
                        className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md transition-colors font-semibold"
                    >
                        View All Products
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
} 