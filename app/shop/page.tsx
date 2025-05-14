import Image from "next/image";
import { Filter } from "lucide-react";
import ProductCard from "../components/ProductCard";

// Sample product data with focus on t-shirts
const products = [
    // Men's T-shirts
    {
        id: "t1",
        name: "Classic White T-Shirt",
        price: 1299,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop&q=80",
        category: "Men's T-Shirts",
        color: "White",
        isNew: true,
    },
    {
        id: "t2",
        name: "Vintage Black Tee",
        price: 1599,
        image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&auto=format&fit=crop&q=80",
        category: "Men's T-Shirts",
        color: "Black",
    },
    {
        id: "t3",
        name: "Navy Blue Essential",
        price: 1199,
        image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&auto=format&fit=crop&q=80",
        category: "Men's T-Shirts",
        color: "Navy Blue",
    },
    {
        id: "t4",
        name: "Striped Cotton Tee",
        price: 1799,
        originalPrice: 2499,
        image: "https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=800&auto=format&fit=crop&q=80",
        category: "Men's T-Shirts",
        color: "Striped",
        isSale: true,
    },
    // Women's T-shirts
    {
        id: "t5",
        name: "Graphic Print T-Shirt",
        price: 1499,
        image: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&auto=format&fit=crop&q=80",
        category: "Women's T-Shirts",
        color: "White/Print",
    },
    {
        id: "t6",
        name: "Oversized Crew Neck",
        price: 1699,
        originalPrice: 2199,
        image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&auto=format&fit=crop&q=80",
        category: "Women's T-Shirts",
        color: "Light Grey",
        isSale: true,
    },
    {
        id: "t7",
        name: "V-Neck Basic Tee",
        price: 999,
        image: "https://images.unsplash.com/photo-1554568218-0f1715e72254?w=800&auto=format&fit=crop&q=80",
        category: "Women's T-Shirts",
        color: "Beige",
        isNew: true,
    },
    {
        id: "t8",
        name: "Premium Cotton Tee",
        price: 1599,
        image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80",
        category: "Men's T-Shirts",
        color: "White",
    },
    // Casual T-shirts
    {
        id: "t9",
        name: "Long Sleeve Tee",
        price: 1999,
        originalPrice: 2599,
        image: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&auto=format&fit=crop&q=80",
        category: "Men's T-Shirts",
        color: "Grey",
        isSale: true,
    },
    {
        id: "t10",
        name: "Relaxed Fit T-Shirt",
        price: 1299,
        image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800&auto=format&fit=crop&q=80",
        category: "Women's T-Shirts",
        color: "Pastel Blue",
    },
    {
        id: "t11",
        name: "Round Neck Basic",
        price: 1199,
        image: "https://images.unsplash.com/photo-1613852348255-d416de68ae33?w=800&auto=format&fit=crop&q=80",
        category: "Men's T-Shirts",
        color: "Burgundy",
    },
    {
        id: "t12",
        name: "Sport Performance Tee",
        price: 1899,
        image: "https://images.unsplash.com/photo-1593358577103-9586b08ad8b2?w=800&auto=format&fit=crop&q=80",
        category: "Men's T-Shirts",
        color: "Athletic Grey",
        isNew: true,
    },
];

const categories = [
    "All",
    "Men's T-Shirts",
    "Women's T-Shirts",
    "Sale",
    "New Arrivals",
];

export default function ShopPage() {
    return (
        <>
            {/* Hero banner */}
            <div className="relative h-64 md:h-80 bg-muted">
                <Image
                    src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop"
                    alt="Shop collection"
                    fill
                    className="object-cover object-center brightness-75"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                            T-Shirt Collection
                        </h1>
                        <p className="text-white/90 max-w-xl mx-auto px-4">
                            Discover premium quality t-shirts for every style
                        </p>
                    </div>
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
                                    className="px-4 py-2 text-sm font-medium rounded-full border border-border hover:bg-secondary transition-colors"
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
                        <select className="px-4 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50">
                            <option>Most Popular</option>
                            <option>Price: Low to High</option>
                            <option>Price: High to Low</option>
                            <option>Newest First</option>
                        </select>
                    </div>
                </div>

                {/* Products grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {/* Show more button */}
                <div className="mt-12 text-center">
                    <button className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors">
                        Load More Products
                    </button>
                </div>
            </div>
        </>
    );
} 