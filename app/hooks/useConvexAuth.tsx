"use client";

import { useEffect, useState } from "react";
import { useAuth as useClerkAuth, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function useConvexAuth() {
    const { isSignedIn, isLoaded } = useClerkAuth();
    const { user } = useUser();
    const [isLoading, setIsLoading] = useState(true);


    const createOrUpdateUser = useMutation(api.users.createOrUpdateUser);


    const convexUser = useQuery(
        api.users.getUserByClerkId,
        isSignedIn && user?.id ? { clerkId: user.id } : "skip"
    );


    useEffect(() => {
        const syncUser = async () => {
            if (isLoaded && isSignedIn && user) {
                try {

                    await createOrUpdateUser({
                        clerkId: user.id,
                        email: user.primaryEmailAddress?.emailAddress || "",
                        name: user.fullName || `${user.firstName || ""} ${user.lastName || ""}`.trim(),
                        imageUrl: user.imageUrl || "",
                    });
                } catch (error) {
                    console.error("Error syncing user to Convex:", error);
                } finally {
                    setIsLoading(false);
                }
            } else if (isLoaded && !isSignedIn) {
                setIsLoading(false);
            }
        };

        syncUser();
    }, [isSignedIn, isLoaded, user, createOrUpdateUser]);

    return {
        isLoaded: isLoaded && !isLoading,
        isAuthenticated: !!isSignedIn,
        user: convexUser,
        clerkUser: user,
    };
} 