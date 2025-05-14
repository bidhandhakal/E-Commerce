import Link from "next/link";
import Image from "next/image";
import FeaturedProducts from "./components/FeaturedProducts";
import { ShoppingBag, Star, TrendingUp, CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <>
      {/* Hero section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=2000&auto=format&fit=crop&q=80"
            alt="T-shirt collection background"
            fill
            priority
            className="object-cover brightness-[0.85] dark:brightness-[0.6]"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36 lg:py-48">
          <div className="max-w-xl">
            <h1 className="font-bold text-white mb-6">
              Premium T-Shirts For Your Style
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8">
              Discover our collection of high-quality t-shirts designed for comfort and style. Made with premium materials that feel as good as they look.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/shop"
                className="px-6 py-3 rounded-md bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2"
              >
                <ShoppingBag size={18} />
                Shop Now
              </Link>
              <Link
                href="/contact"
                className="px-6 py-3 rounded-md border border-white text-white font-semibold hover:bg-white/10 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center mb-12">
            Why Choose Our T-Shirts
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg shadow-sm border border-border flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Star className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-muted-foreground">Our t-shirts are made from 100% premium cotton for maximum comfort and durability.</p>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-sm border border-border flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Trendy Designs</h3>
              <p className="text-muted-foreground">Stay ahead with our constantly updated collection of modern and stylish designs.</p>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-sm border border-border flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Perfect Fit</h3>
              <p className="text-muted-foreground">Carefully tailored to provide the perfect fit for all body types and preferences.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <FeaturedProducts />

      {/* Promotional Banner */}
      <section className="py-16 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-black dark:text-white mb-4">
                New Arrivals Just Dropped
              </h2>
              <p className="text-black/90 dark:text-white/90 mb-6">
                Get 20% off your first purchase when you sign up for our newsletter. Stay updated with our latest t-shirt designs and exclusive offers.
              </p>
              <Link
                href="/shop"
                className="inline-block px-6 py-3 rounded-md bg-white text-black dark:text-primary font-semibold hover:bg-white/90 transition-colors"
              >
                Shop New Arrivals
              </Link>
            </div>
            <div className="relative h-80 overflow-hidden rounded-lg">
              <Image
                src="https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800&auto=format&fit=crop&q=80"
                alt="New t-shirt collection"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center mb-12">
            What Our Customers Say
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="text-primary" size={16} fill="currentColor" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4">
                "These are the most comfortable t-shirts I've ever worn. The quality is outstanding and they fit perfectly. Will definitely buy more!"
              </p>
              <p className="font-semibold">- Emily J.</p>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="text-primary" size={16} fill="currentColor" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4">
                "I love the designs and the fabric is so soft. These t-shirts are now my go-to for both casual wear and layering. Great value for money."
              </p>
              <p className="font-semibold">- Marcus T.</p>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="text-primary" size={16} fill="currentColor" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4">
                "The quality of these shirts is exceptional. They wash well and keep their shape. The delivery was also super fast. Highly recommend!"
              </p>
              <p className="font-semibold">- Sarah K.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
