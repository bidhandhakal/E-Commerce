"use client";

import { createContext, useContext, ReactNode } from "react";
import { useConvexAuth } from "../hooks/useConvexAuth";

// Define type for Clerk user to ensure it has an id property
type ClerkUserType = {
    id: string;
    [key: string]: unknown;
};

// Define the type for our context
interface ConvexAuthContextType {
    isLoaded: boolean;
    isAuthenticated: boolean;
    user: unknown; // Convex user data
    clerkUser: ClerkUserType | null; // Clerk user object with at least an id property
}

// Create the context with a default value
const ConvexAuthContext = createContext<ConvexAuthContextType>({
    isLoaded: false,
    isAuthenticated: false,
    user: null,
    clerkUser: null,
});

// Create a hook to use the context
export const useConvexAuthContext = () => {
    const context = useContext(ConvexAuthContext);
    if (!context) {
        throw new Error("useConvexAuthContext must be used within a ConvexAuthProvider");
    }
    return context;
};

// Create the provider component
export function ConvexAuthProvider({ children }: { children: ReactNode }) {
    // Use our custom hook that connects Clerk and Convex
    const auth = useConvexAuth();

    // Ensure isAuthenticated is always a boolean
    const contextValue: ConvexAuthContextType = {
        isLoaded: auth.isLoaded,
        isAuthenticated: !!auth.isAuthenticated, // Convert to boolean with !!
        user: auth.user,
        clerkUser: auth.clerkUser ? (auth.clerkUser as unknown as ClerkUserType) : null
    };

    return (
        <ConvexAuthContext.Provider value={contextValue}>
            {children}
        </ConvexAuthContext.Provider>
    );
} 