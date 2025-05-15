"use client";

import { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export function ClerkClientProvider({ children }: { children: ReactNode }) {
    return (
        <ClerkProvider
            appearance={{
                baseTheme: dark,
                elements: {
                    formButtonPrimary:
                        "bg-primary text-primary-foreground hover:bg-primary/90",
                    card: "bg-card",
                    headerTitle: "text-foreground",
                    headerSubtitle: "text-muted-foreground",
                    socialButtonsBlockButton: "bg-muted text-foreground border-border",
                    formFieldLabel: "text-foreground",
                    formFieldInput: "bg-input text-foreground",
                    footerActionLink: "text-primary hover:text-primary/90",
                    socialButtonsIconButton: "bg-muted hover:bg-muted/80"
                }
            }}
            publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
        >
            {children}
        </ClerkProvider>
    );
} 