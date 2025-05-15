"use client";

import { useState } from "react";
import { Filter } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const categories = [
    "All",
    "Men's T-Shirts",
    "Women's T-Shirts",
    "Sale",
    "New Arrivals",
];

export default function ShopPage() {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [sortOption, setSortOption] = useState("newest");

    // Fetch products
    const productsResult = useQuery(api.products.listProducts, {
        skipInactive: true
    });

    // Safely handle products result
    const products = productsResult || [];

    // Filter products based on selected category
    const filteredProducts = products.filter(product => {
        if (selectedCategory === "All") return true;
        if (selectedCategory === "Sale") return product.isSale === true;
        if (selectedCategory === "New Arrivals") return product.isNew === true;
        return product.category === selectedCategory;
    });

    // Sort products based on selected option
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortOption) {
            case "newest":
                return b.createdAt - a.createdAt;
            case "price-low":
                return a.price - b.price;
            case "price-high":
                return b.price - a.price;
            default:
                return 0;
        }
    });

    const handleCategorySelect = (category: string) => {
        setSelectedCategory(category);
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortOption(e.target.value);
    };

    return (
        <>
            <div className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-b from-black/60 to-primary/80 text-primary-foreground">
                {/* Background image - no filters */}
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center"
                    style={{
                        backgroundImage: "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1920&auto=format&fit=crop')",
                    }}
                ></div>

                {/* Simple dark overlay to maintain text readability */}
                <div className="absolute inset-0 z-0 bg-black/60 dark:bg-black/70"></div>

                {/* Content overlay */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl sm:text-5xl font-bold mb-4 sm:mb-6 text-white">Our Collection</h1>
                    <p className="text-base sm:text-lg max-w-2xl mx-auto text-white/90">
                        Discover our premium, sustainably made t-shirts designed for comfort and style
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Filters and sorting */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    {/* Categories */}
                    <div className="w-full md:w-auto overflow-x-auto pb-2">
                        <div className="flex space-x-2 min-w-max">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    className={`px-4 py-2 text-sm font-medium rounded-full border transition-colors ${selectedCategory === category
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "border-border hover:bg-secondary"
                                        }`}
                                    onClick={() => handleCategorySelect(category)}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Filter and Sort */}
                    <div className="flex gap-2 w-full md:w-auto">
                        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-border rounded-md hover:bg-secondary transition-colors">
                            <Filter size={16} />
                            <span>Filter</span>
                        </button>
                        <select
                            className="px-4 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                            value={sortOption}
                            onChange={handleSortChange}
                        >
                            <option value="newest">Newest First</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                        </select>
                    </div>
                </div>

                {/* Products grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                    {sortedProducts.length > 0 ? (
                        sortedProducts.map((product) => (
                            <ProductCard
                                key={product._id.toString()}
                                product={{
                                    id: product._id.toString(),
                                    name: product.name,
                                    price: product.price,
                                    originalPrice: product.originalPrice,
                                    image: product.image,
                                    category: product.category,
                                }}
                            />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <p className="text-muted-foreground">No products found.</p>
                        </div>
                    )}
                </div>

                {/* Show more button - could implement pagination here */}
                {sortedProducts.length > 0 && (
                    <div className="mt-12 text-center">
                        <button className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors">
                            Load More Products
                        </button>
                    </div>
                )}
            </div>
        </>
    );
} 