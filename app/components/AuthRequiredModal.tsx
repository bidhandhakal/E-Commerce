"use client";

import { X } from "lucide-react";
import { useClerk } from "@clerk/nextjs";

interface AuthRequiredModalProps {
    isOpen: boolean;
    onClose: () => void;
    message?: string;
}

export default function AuthRequiredModal({
    isOpen,
    onClose,
    message = "You need to sign in to access this feature.",
}: AuthRequiredModalProps) {
    const clerk = useClerk();

    if (!isOpen) return null;

    const handleSignIn = async () => {
        try {
            await clerk.openSignIn();
        } catch (error) {
            console.error("Error redirecting to sign in:", error);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="relative w-full max-w-md rounded-lg bg-card p-6 shadow-lg">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
                    aria-label="Close"
                >
                    <X size={20} />
                </button>
                <div className="mb-4 text-center text-3xl font-bold">Sign in required</div>
                <p className="mb-6 text-center text-muted-foreground">{message}</p>
                <div className="flex flex-col gap-2">
                    <button
                        onClick={handleSignIn}
                        className="w-full rounded-md bg-primary py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                        Sign In
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full rounded-md border border-border py-3 font-medium text-foreground transition-colors hover:bg-muted"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
} 