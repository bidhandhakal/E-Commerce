"use client";

import { ReactNode } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";


const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL as string;

const convex = new ConvexReactClient(convexUrl);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
    return (
        <ConvexProvider client={convex}>
            {children}
        </ConvexProvider>
    );
} 