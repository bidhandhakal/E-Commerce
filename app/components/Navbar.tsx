"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ShoppingCart, ShoppingBag, LogIn, ShieldCheck } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useAuth as useClerkAuth, useClerk, UserButton } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Contact", href: "/contact" },
];


const LOGO_URL = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/phalcon/phalcon-plain.svg";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [visible, setVisible] = useState(true);
    const [imageError, setImageError] = useState(false);
    const { getCartCount } = useCart();
    const { requireAuth } = useAuth();
    const { isSignedIn, userId } = useClerkAuth();
    const router = useRouter();
    const cartItemsCount = getCartCount();
    const clerk = useClerk();

    const isAdmin = useQuery(api.users.isUserAdmin, userId ? { clerkId: userId } : "skip");

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.scrollY;
            const scrollingDown = prevScrollPos < currentScrollPos;
            const scrollDelta = Math.abs(prevScrollPos - currentScrollPos);

            if (scrollDelta > 10) {
                if (currentScrollPos <= 20) {
                    setVisible(true);
                } else {
                    setVisible(!scrollingDown);
                }
                setPrevScrollPos(currentScrollPos);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [prevScrollPos]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const navbarClasses = `sticky z-50 w-full bg-background/80 backdrop-blur-md border-b border-border transition-transform duration-300 ${visible ? "top-0 translate-y-0" : "-translate-y-full"
        }`;

    const handleCartClick = async (e: React.MouseEvent) => {
        if (!isSignedIn) {
            e.preventDefault();
            await requireAuth("You need to sign in to view your cart.");
        } else {
            router.push("/cart");
        }
    };

    const handleSignInClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        try {
            const signInUrl = clerk.buildSignInUrl({
                redirectUrl: window.location.href
            });

            window.location.href = signInUrl;
        } catch (error) {
            console.error("Error redirecting to sign in:", error);
        }
    };

    const handleSignUpClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        try {
            const signUpUrl = clerk.buildSignUpUrl({
                redirectUrl: window.location.href
            });

            window.location.href = signUpUrl;
        } catch (error) {
            console.error("Error redirecting to sign up:", error);
        }
    };

    return (
        <nav className={navbarClasses}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo and brand */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="flex items-center gap-2">
                            {!imageError ? (
                                <Image
                                    src={LOGO_URL}
                                    alt="Pyuto Logo"
                                    width={40}
                                    height={40}
                                    className="mr-1"
                                    onError={() => setImageError(true)}
                                />
                            ) : (
                                <div className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded-full text-primary mr-1">
                                    <ShoppingBag size={20} />
                                </div>
                            )}
                            <span className="brand-title text-foreground">
                                Luxera
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Nav Links - centered */}
                    <div className="hidden md:block flex-1 mx-8">
                        <div className="flex items-center justify-center space-x-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="nav-link px-3 py-1 rounded-md text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}

                            {/* Admin link - only visible to admin users */}
                            {isAdmin && (
                                <Link
                                    href="/admin"
                                    className="nav-link px-3 py-1 rounded-md text-primary flex items-center gap-1 hover:bg-primary/10 transition-colors"
                                >
                                    <ShieldCheck size={16} />
                                    Admin
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Right side items */}
                    <div className="flex items-center gap-3">
                        {/* ThemeToggle - only visible on desktop */}
                        <div className="hidden md:block">
                            <ThemeToggle />
                        </div>

                        {/* Cart Button */}
                        <button
                            onClick={handleCartClick}
                            className="relative p-2 transition-colors hover:text-primary"
                            aria-label="View shopping cart"
                        >
                            <ShoppingCart size={24} className="text-foreground" />
                            {cartItemsCount > 0 && isSignedIn && (
                                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                                    {cartItemsCount}
                                </span>
                            )}
                        </button>

                        {/* Sign in/up buttons for non-signed in users on desktop */}
                        {!isSignedIn && (
                            <div className="hidden md:flex md:items-center gap-2">
                                <button
                                    onClick={handleSignInClick}
                                    className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary"
                                >
                                    <LogIn size={16} className="mr-1" />
                                    Sign In
                                </button>
                                <button
                                    onClick={handleSignUpClick}
                                    className="flex items-center gap-1 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                                >
                                    Sign Up
                                </button>
                            </div>
                        )}

                        {/* User Button for signed in users - visible on both mobile and desktop */}
                        {isSignedIn && (
                            <UserButton
                                afterSignOutUrl="/"
                                appearance={{
                                    elements: {
                                        avatarBox: "h-9 w-9",
                                        userButtonBox: "focus:shadow-none",
                                        userButtonTrigger: "focus:shadow-none focus-visible:ring-2 focus-visible:ring-primary rounded-full",
                                        userButtonPopoverCard: "shadow-lg border border-border bg-card rounded-lg",
                                        userButtonPopoverFooter: "border-t border-border",
                                        userButtonPopoverActionButton: "text-foreground hover:bg-secondary/50 rounded-md",
                                        userButtonPopoverActionButtonText: "text-foreground font-medium",
                                    }
                                }}
                            />
                        )}

                        {/* Mobile menu button */}
                        <button
                            type="button"
                            className="md:hidden bg-secondary p-2 rounded-md text-secondary-foreground hover:bg-secondary/80"
                            onClick={toggleMenu}
                            aria-controls="mobile-menu"
                            aria-expanded={isMenuOpen}
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}
                id="mobile-menu"
            >
                <div className="px-4 pt-3 pb-4 space-y-2 sm:px-4 bg-background border-b border-border">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="block px-4 py-3 rounded-md text-base font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}

                    {/* Admin link in mobile menu - only visible to admin users */}
                    {isAdmin && (
                        <Link
                            href="/admin"
                            className="flex items-center gap-2 px-4 py-3 rounded-md text-base font-medium text-primary hover:bg-primary/10 transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <ShieldCheck size={18} />
                            Admin Dashboard
                        </Link>
                    )}
                </div>

                <div className="mt-4 border-t border-border pt-4 px-4 space-y-2">
                    {/* ThemeToggle added to mobile menu */}
                    <div className="flex justify-center my-4">
                        <ThemeToggle />
                    </div>

                    {/* Keep the sign-in/sign-up buttons in mobile menu but remove UserButton */}
                    {!isSignedIn && (
                        <>
                            <button
                                onClick={(e) => {
                                    setIsMenuOpen(false);
                                    handleSignInClick(e);
                                }}
                                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-secondary transition-colors w-full"
                            >
                                <LogIn size={18} />
                                Sign In
                            </button>
                            <button
                                onClick={(e) => {
                                    setIsMenuOpen(false);
                                    handleSignUpClick(e);
                                }}
                                className="flex items-center justify-center px-3 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors w-full"
                            >
                                Sign Up
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
} 