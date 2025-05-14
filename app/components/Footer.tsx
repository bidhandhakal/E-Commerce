import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-background border-t border-border py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    {/* Brand */}
                    <div className="flex items-center gap-2">
                        <Image
                            src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/phalcon/phalcon-plain.svg"
                            alt="Pyuto Logo"
                            width={24}
                            height={24}
                            className="h-6 w-auto"
                        />
                        <span className="font-bold text-foreground">
                            Luxera
                        </span>
                    </div>

                    {/* Quick Links */}
                    <div className="flex gap-6">
                        <Link
                            href="/shop"
                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                            Shop
                        </Link>
                        <Link
                            href="/contact"
                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                            Contact
                        </Link>
                        <Link
                            href="/privacy"
                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                            Privacy
                        </Link>
                    </div>

                    {/* Copyright */}
                    <div className="text-sm text-muted-foreground">
                        <p>© {currentYear} Luxera</p>
                    </div>
                </div>
            </div>
        </footer>
    );
} 