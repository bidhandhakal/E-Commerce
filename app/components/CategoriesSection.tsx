import Link from "next/link";
import Image from "next/image";

const categories = [
    {
        name: "Men's Collection",
        image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=1974&auto=format&fit=crop",
        href: "/men",
        description: "Timeless styles for the modern man",
    },
    {
        name: "Women's Collection",
        image: "https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?q=80&w=1974&auto=format&fit=crop",
        href: "/women",
        description: "Elevate your everyday look",
    },
    {
        name: "Kids Collection",
        image: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=1972&auto=format&fit=crop",
        href: "/kids",
        description: "Playful designs for little ones",
    },
];

export default function CategoriesSection() {
    return (
        <section className="py-16 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                        Shop by Category
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Explore our diverse collections tailored for everyone in the family
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {categories.map((category) => (
                        <Link
                            key={category.name}
                            href={category.href}
                            className="group block relative overflow-hidden rounded-lg aspect-[3/4] bg-muted"
                        >
                            <div className="absolute inset-0 z-0 transition-transform duration-500 group-hover:scale-110">
                                <Image
                                    src={category.image}
                                    alt={category.name}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-foreground/20 group-hover:bg-foreground/30 transition-colors" />
                            </div>

                            <div className="absolute inset-x-0 bottom-0 z-10 p-6 text-center">
                                <div className="bg-background/80 backdrop-blur-sm p-4 rounded-lg">
                                    <h3 className="text-xl font-semibold text-foreground mb-1">
                                        {category.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        {category.description}
                                    </p>
                                    <span className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-primary border border-primary rounded-md transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                                        Shop Now
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
} 