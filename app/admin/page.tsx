"use client";

import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { api } from "../../convex/_generated/api";
import { useQuery } from "convex/react";
import { redirect } from "next/navigation";
import { Button } from "../components/ui/button";
import Link from "next/link";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { formatPrice } from "../lib/formatters";

export default function AdminDashboard() {
    const { user } = useUser();
    const { isLoaded, isSignedIn } = useAuth();
    const [loading, setLoading] = useState(true);

    // Check if user is admin
    const clerkId = user?.id;
    const isAdmin = useQuery(api.users.isUserAdmin, clerkId ? { clerkId } : "skip");

    // Fetch products
    const productsResult = useQuery(api.products.listProducts, {});
    const products = productsResult || [];

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

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

            <div className="flex justify-between mb-6">
                <h2 className="text-xl font-bold">Product Management</h2>
                <Link href="/admin/products/new">
                    <Button className="flex gap-2 items-center">
                        <Plus size={18} />
                        Add New Product
                    </Button>
                </Link>
            </div>

            <div className="bg-card rounded-lg overflow-hidden shadow">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-secondary">
                            <tr>
                                <th className="px-4 py-3 text-left">Image</th>
                                <th className="px-4 py-3 text-left">Name</th>
                                <th className="px-4 py-3 text-left">Category</th>
                                <th className="px-4 py-3 text-left">Price</th>
                                <th className="px-4 py-3 text-left">Status</th>
                                <th className="px-4 py-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {products.length > 0 ? (
                                products.map((product) => (
                                    <tr key={product._id.toString()} className="hover:bg-muted/50">
                                        <td className="px-4 py-3">
                                            <div className="h-12 w-12 rounded-md bg-secondary relative overflow-hidden">
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="object-cover h-full w-full"
                                                />
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 font-medium">{product.name}</td>
                                        <td className="px-4 py-3">{product.category}</td>
                                        <td className="px-4 py-3">{formatPrice(product.price)}</td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${product.isActive
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                                }`}>
                                                {product.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2">
                                                <Link href={`/admin/products/edit/${product._id}`}>
                                                    <Button variant="ghost" size="icon">
                                                        <Pencil size={16} />
                                                    </Button>
                                                </Link>
                                                <Link href={`/admin/products/delete/${product._id}`}>
                                                    <Button variant="ghost" size="icon" className="text-destructive">
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                                        No products found. Click "Add New Product" to create your first product.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
} 