import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
    return (
        <section className="relative overflow-hidden">
            {/* Background image container */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop"
                    alt="Fashion background"
                    fill
                    priority
                    className="object-cover brightness-[0.85] dark:brightness-[0.6]"
                />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 lg:py-40">
                <div className="max-w-xl">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                        Summer Collection 2024
                    </h1>
                    <p className="text-lg md:text-xl text-white/90 mb-8">
                        Discover our latest collection featuring sustainable fabrics and timeless designs
                        for the modern wardrobe.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Link
                            href="/new-arrivals"
                            className="px-6 py-3 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                        >
                            Shop New Arrivals
                        </Link>
                        <Link
                            href="/collections"
                            className="px-6 py-3 rounded-md bg-white/20 text-white backdrop-blur-sm border border-white/30 font-medium hover:bg-white/30 transition-colors"
                        >
                            Explore Collections
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
} 