import Link from "next/link";
import Image from "next/image";
import FeaturedProducts from "./components/FeaturedProducts";
import { ShoppingBag, Star, TrendingUp, CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <>
      {/* Hero section */}
      <section className="relative overflow-hidden min-h-[85vh] sm:min-h-[600px] md:min-h-[700px]">
        <div className="absolute inset-0 z-0">
          <Image
            src="/shirt.jpg"
            alt="T-shirt collection background"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center brightness-[0.75] dark:brightness-[0.5]"
          />
        </div>

        {/* Black gradient overlay */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>

        <div className="absolute inset-0 z-10 flex items-center">
          <div className="w-full px-8 sm:px-12 md:px-20 lg:px-32">
            <div className="w-full max-w-sm sm:max-w-xl md:max-w-2xl">
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-3 sm:mb-6 tracking-tight leading-tight drop-shadow-md">
                Luxera
              </h1>
              <p className="text-sm sm:text-lg md:text-xl text-white/90 mb-5 sm:mb-8 drop-shadow max-w-xs sm:max-w-none">
                Discover our collection of high-quality t-shirts designed for comfort and style. Made with premium materials that feel as good as they look.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link
                  href="/shop"
                  className="px-5 sm:px-6 py-3 rounded-md bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center sm:justify-start gap-2 text-center sm:text-left"
                >
                  <ShoppingBag size={18} />
                  Shop Now
                </Link>
                <Link
                  href="/contact"
                  className="px-5 sm:px-6 py-3 rounded-md border border-white text-white font-semibold hover:bg-white/10 transition-colors text-center sm:text-left"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-10 sm:py-12 md:py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-8 md:mb-12">
            Why Choose Our T-Shirts
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
            <div className="bg-card p-4 sm:p-5 md:p-6 rounded-lg shadow-sm border border-border flex flex-col items-center text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <Star className="text-primary" size={20} />
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-sm sm:text-base text-muted-foreground">Our t-shirts are made from 100% premium cotton for maximum comfort and durability.</p>
            </div>

            <div className="bg-card p-4 sm:p-5 md:p-6 rounded-lg shadow-sm border border-border flex flex-col items-center text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <TrendingUp className="text-primary" size={20} />
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2">Trendy Designs</h3>
              <p className="text-sm sm:text-base text-muted-foreground">Stay ahead with our constantly updated collection of modern and stylish designs.</p>
            </div>

            <div className="bg-card p-4 sm:p-5 md:p-6 rounded-lg shadow-sm border border-border flex flex-col items-center text-center sm:col-span-2 md:col-span-1 sm:max-w-md sm:mx-auto md:max-w-none">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <CheckCircle2 className="text-primary" size={20} />
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2">Perfect Fit</h3>
              <p className="text-sm sm:text-base text-muted-foreground">Carefully tailored to provide the perfect fit for all body types and preferences.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <FeaturedProducts />

      {/* Promotional Banner */}
      <section className="py-10 sm:py-12 md:py-16 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 md:gap-8 items-center">
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-black dark:text-white mb-2 sm:mb-3 md:mb-4">
                New Arrivals Just Dropped
              </h2>
              <p className="text-sm sm:text-base text-black/90 dark:text-white/90 mb-4 sm:mb-6">
                Get 20% off your first purchase when you sign up for our newsletter. Stay updated with our latest t-shirt designs and exclusive offers.
              </p>
              <Link
                href="/shop"
                className="inline-block w-full sm:w-auto text-center px-5 sm:px-6 py-3 rounded-md bg-white text-black dark:text-primary font-semibold hover:bg-white/90 transition-colors"
              >
                Shop New Arrivals
              </Link>
            </div>
            <div className="relative h-56 sm:h-64 md:h-80 overflow-hidden rounded-lg mt-5 md:mt-0">
              <Image
                src="https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800&auto=format&fit=crop&q=80"
                alt="New t-shirt collection"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-10 sm:py-12 md:py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-6 sm:mb-8 md:mb-12">
            What Our Customers Say
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
            <div className="bg-card p-4 sm:p-5 md:p-6 rounded-lg shadow-sm border border-border">
              <div className="flex items-center mb-3 sm:mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="text-primary" size={14} fill="currentColor" />
                ))}
              </div>
              <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                &quot;These are the most comfortable t-shirts I&apos;ve ever worn. The quality is outstanding and they fit perfectly. Will definitely buy more!&quot;
              </p>
              <p className="font-semibold text-sm sm:text-base">- Emily J.</p>
            </div>

            <div className="bg-card p-4 sm:p-5 md:p-6 rounded-lg shadow-sm border border-border">
              <div className="flex items-center mb-3 sm:mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="text-primary" size={14} fill="currentColor" />
                ))}
              </div>
              <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                &quot;I love the designs and the fabric is so soft. These t-shirts are now my go-to for both casual wear and layering. Great value for money.&quot;
              </p>
              <p className="font-semibold text-sm sm:text-base">- Marcus T.</p>
            </div>

            <div className="bg-card p-4 sm:p-5 md:p-6 rounded-lg shadow-sm border border-border sm:col-span-2 md:col-span-1 sm:max-w-md sm:mx-auto md:max-w-none">
              <div className="flex items-center mb-3 sm:mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="text-primary" size={14} fill="currentColor" />
                ))}
              </div>
              <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                &quot;The quality of these shirts is exceptional. They wash well and keep their shape. The delivery was also super fast. Highly recommend!&quot;
              </p>
              <p className="font-semibold text-sm sm:text-base">- Sarah K.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
