"use client";

import { ReactNode } from "react";
import { CartProvider } from "../context/CartContext";
import { AuthProvider } from "../context/AuthContext";
import { ThemeProvider } from "next-themes";
import { ConvexAuthProvider } from "./ConvexAuthProvider";

export function ClientProviders({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <AuthProvider>
                <CartProvider>
                    <ConvexAuthProvider>
                        {children}
                    </ConvexAuthProvider>
                </CartProvider>
            </AuthProvider>
        </ThemeProvider>
    );
} 