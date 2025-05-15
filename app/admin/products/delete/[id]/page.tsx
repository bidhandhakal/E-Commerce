"use client";

import { useState, useEffect } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import { api } from "../../../../../convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { redirect } from "next/navigation";
import { Button } from "../../../../components/ui/button";
import Link from "next/link";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { Id } from "../../../../../convex/_generated/dataModel";
import Image from "next/image";

type DeleteProductPageProps = {
    params: {
        id: string;
    };
}

export default function DeleteProductPage({ params }: DeleteProductPageProps) {
    const { user } = useUser();
    const { isLoaded, isSignedIn } = useAuth();
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);

    // Check if user is admin
    const clerkId = user?.id;
    const isAdmin = useQuery(api.users.isUserAdmin, clerkId ? { clerkId } : "skip");

    // Get the product data
    const product = useQuery(api.products.getProduct, {
        id: params.id as Id<"products">
    });

    // Function to delete product
    const deleteProduct = useMutation(api.products.deleteProduct);

    useEffect(() => {
        if (isLoaded) {
            if (!isSignedIn) {
                redirect("/");
            } else if (isAdmin === false) {
                // If we've confirmed user is not admin
                redirect("/");
            } else if (isAdmin !== undefined) {
                // Once we know the admin status
                setLoading(false);
            }
        }
    }, [isLoaded, isSignedIn, isAdmin]);

    if (loading || !product) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
            </div>
        );
    }

    const handleDeleteProduct = async () => {
        if (!clerkId) return;

        setDeleting(true);

        try {
            await deleteProduct({
                id: params.id as Id<"products">,
                clerkId: clerkId
            });

            // Use window.location instead of redirect for client components
            window.location.href = "/admin";
        } catch (error) {
            console.error("Error deleting product:", error);
            alert("Failed to delete product. Please try again.");
            setDeleting(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <Link href="/admin" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft size={16} />
                    <span>Back to Dashboard</span>
                </Link>
            </div>

            <div className="max-w-2xl mx-auto bg-card rounded-lg shadow p-8">
                <div className="flex flex-col items-center text-center mb-8">
                    <div className="h-16 w-16 rounded-full bg-destructive/20 flex items-center justify-center mb-4">
                        <AlertTriangle size={32} className="text-destructive" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Delete Product</h1>
                    <p className="text-muted-foreground">
                        Are you sure you want to delete this product? This action cannot be undone.
                    </p>
                </div>

                <div className="border border-border rounded-lg p-6 mb-8">
                    <div className="flex gap-4 items-center">
                        <div className="h-16 w-16 rounded-md bg-secondary relative overflow-hidden flex-shrink-0">
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover h-full w-full"
                            />
                        </div>
                        <div>
                            <h2 className="font-medium text-lg">{product.name}</h2>
                            <p className="text-muted-foreground text-sm">{product.category}</p>
                            <p className="mt-1 font-medium">
                                RS {(product.price / 100).toFixed(2)}
                                {product.originalPrice && (
                                    <span className="ml-2 text-sm line-through text-muted-foreground">
                                        RS {(product.originalPrice / 100).toFixed(2)}
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center gap-4">
                    <Link href="/admin">
                        <Button variant="outline" type="button" disabled={deleting}>
                            Cancel
                        </Button>
                    </Link>
                    <Button
                        variant="destructive"
                        onClick={handleDeleteProduct}
                        disabled={deleting}
                    >
                        {deleting ? "Deleting..." : "Delete Product"}
                    </Button>
                </div>
            </div>
        </div>
    );
} 