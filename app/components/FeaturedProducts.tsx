import Link from "next/link";
import ProductCard from "./ProductCard";

// Sample t-shirt product data
const featuredProducts = [
    {
        id: "t1",
        name: "Classic White T-Shirt",
        price: 1299,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop&q=80",
        category: "Men's T-Shirts",
        isNew: true,
    },
    {
        id: "t5",
        name: "Graphic Print T-Shirt",
        price: 1499,
        image: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&auto=format&fit=crop&q=80",
        category: "Women's T-Shirts",
    },
    {
        id: "t4",
        name: "Striped Cotton Tee",
        price: 1799,
        originalPrice: 2499,
        image: "https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=800&auto=format&fit=crop&q=80",
        category: "Men's T-Shirts",
        isSale: true,
    },
    {
        id: "t6",
        name: "Oversized Crew Neck",
        price: 1699,
        originalPrice: 2199,
        image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&auto=format&fit=crop&q=80",
        category: "Women's T-Shirts",
        isSale: true,
    },
];

export default function FeaturedProducts() {
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

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    {featuredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
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