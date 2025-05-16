"use client";

import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { api } from "../../convex/_generated/api";
import { useQuery } from "convex/react";
import { redirect } from "next/navigation";
import { Button } from "../components/ui/button";
import Link from "next/link";
import { Pencil, Plus, Trash2, ChevronRight } from "lucide-react";
import { formatPrice } from "../lib/formatters";
import Image from "next/image";

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

            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                <h2 className="text-xl font-bold">Product Management</h2>
                <Link href="/admin/products/new">
                    <Button className="flex gap-2 items-center w-full sm:w-auto justify-center">
                        <Plus size={18} />
                        Add New Product
                    </Button>
                </Link>
            </div>

            {/* Desktop view - Table */}
            <div className="hidden md:block bg-card rounded-lg overflow-hidden shadow">
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
                                                <Image
                                                    src={product.image}
                                                    alt={product.name}
                                                    fill
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
                                        No products found. Click &quot;Add New Product&quot; to create your first product.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile view - Card list */}
            <div className="md:hidden space-y-4">
                {products.length > 0 ? (
                    products.map((product) => (
                        <div key={product._id.toString()} className="bg-card rounded-lg overflow-hidden shadow border border-border">
                            <div className="flex items-center p-4">
                                <div className="h-16 w-16 rounded-md bg-secondary relative overflow-hidden flex-shrink-0">
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-cover h-full w-full"
                                    />
                                </div>
                                <div className="ml-4 flex-grow">
                                    <h3 className="font-medium">{product.name}</h3>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        <p className="text-sm text-muted-foreground">{product.category}</p>
                                        <span className="text-sm font-medium">{formatPrice(product.price)}</span>
                                    </div>
                                    <div className="mt-2">
                                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${product.isActive
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                            }`}>
                                            {product.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Link href={`/admin/products/edit/${product._id}`}>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <Pencil size={16} />
                                        </Button>
                                    </Link>
                                    <Link href={`/admin/products/delete/${product._id}`}>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                                            <Trash2 size={16} />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-card rounded-lg p-8 text-center text-muted-foreground border border-border">
                        No products found. Click &quot;Add New Product&quot; to create your first product.
                    </div>
                )}
            </div>
        </div>
    );
} 