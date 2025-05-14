"use client";

import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { useAuth as useClerkAuth, useUser } from "@clerk/nextjs";
import AuthRequiredModal from "../components/AuthRequiredModal";

interface AuthContextType {
    isSignedIn: boolean;
    requireAuth: (message?: string) => Promise<boolean>;
    showAuthModal: (message?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const { isSignedIn, isLoaded } = useClerkAuth();
    const { user } = useUser();

    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authModalMessage, setAuthModalMessage] = useState<string>();
    const [authLoaded, setAuthLoaded] = useState(false);

    useEffect(() => {
        if (isLoaded) {
            setAuthLoaded(true);
        }
    }, [isLoaded]);

    const showAuthModal = (message?: string) => {
        setAuthModalMessage(message);
        setIsAuthModalOpen(true);
    };

    const closeAuthModal = () => {
        setIsAuthModalOpen(false);
    };

    const requireAuth = async (message?: string): Promise<boolean> => {
        if (isSignedIn) {
            return true;
        } else {
            showAuthModal(message);
            return false;
        }
    };

    if (!authLoaded) {
        return null;
    }

    return (
        <AuthContext.Provider
            value={{
                isSignedIn: !!isSignedIn,
                requireAuth,
                showAuthModal,
            }}
        >
            {children}
            <AuthRequiredModal
                isOpen={isAuthModalOpen}
                onClose={closeAuthModal}
                message={authModalMessage}
            />
        </AuthContext.Provider>
    );
} 