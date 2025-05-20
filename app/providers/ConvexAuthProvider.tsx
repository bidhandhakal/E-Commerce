"use client";

import { createContext, useContext, ReactNode } from "react";
import { useConvexAuth } from "../hooks/useConvexAuth";


type ClerkUserType = {
    id: string;
    [key: string]: unknown;
};


interface ConvexAuthContextType {
    isLoaded: boolean;
    isAuthenticated: boolean;
    user: unknown;
    clerkUser: ClerkUserType | null;
}


const ConvexAuthContext = createContext<ConvexAuthContextType>({
    isLoaded: false,
    isAuthenticated: false,
    user: null,
    clerkUser: null,
});


export const useConvexAuthContext = () => {
    const context = useContext(ConvexAuthContext);
    if (!context) {
        throw new Error("useConvexAuthContext must be used within a ConvexAuthProvider");
    }
    return context;
};


export function ConvexAuthProvider({ children }: { children: ReactNode }) {

    const auth = useConvexAuth();

    const contextValue: ConvexAuthContextType = {
        isLoaded: auth.isLoaded,
        isAuthenticated: !!auth.isAuthenticated,
        user: auth.user,
        clerkUser: auth.clerkUser ? (auth.clerkUser as unknown as ClerkUserType) : null
    };

    return (
        <ConvexAuthContext.Provider value={contextValue}>
            {children}
        </ConvexAuthContext.Provider>
    );
} 