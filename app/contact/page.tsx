"use client";

import { useState, FormEvent } from "react";
import Image from "next/image";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth as useClerkAuth } from "@clerk/nextjs";

export default function ContactPage() {
    const { requireAuth } = useAuth();
    const { userId } = useClerkAuth();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);


    const submitContactMessage = useMutation(api.contact.submitContactMessage);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSubmitError(null);

        const isAuthorized = await requireAuth("You need to sign in to send us a message.");

        if (isAuthorized) {
            setIsSubmitting(true);

            try {
                await submitContactMessage({
                    name: formData.name,
                    email: formData.email,
                    subject: formData.subject,
                    message: formData.message,
                    clerkId: userId || undefined
                });

                setSubmitSuccess(true);
                setFormData({
                    name: "",
                    email: "",
                    subject: "",
                    message: ""
                });

                setTimeout(() => {
                    setSubmitSuccess(false);
                }, 5000);
            } catch (error) {
                console.error("Error submitting form:", error);
                setSubmitError("There was an error submitting your message. Please try again.");
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <>
            {/* Hero section */}
            <div className="relative h-60 sm:h-64 md:h-80 lg:h-96 bg-muted overflow-hidden">
                <Image
                    src="https://images.unsplash.com/photo-1534536281715-e28d76689b4d?q=80&w=2070&auto=format&fit=crop"
                    alt="Contact us"
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover object-center brightness-75"
                />
                <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-6">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 sm:mb-4 drop-shadow-md">
                            Contact Us
                        </h1>
                        <p className="text-white/90 text-sm sm:text-base md:text-lg max-w-xl mx-auto drop-shadow">
                            We&apos;re here to help with any questions about our products
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
                    {/* Contact Info Cards */}
                    <div className="space-y-4 sm:space-y-6 order-2 md:order-1">
                        <div className="bg-card rounded-lg p-4 sm:p-6 border border-border shadow-sm hover:shadow-md transition-shadow flex items-start space-x-4">
                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                                <Mail size={20} />
                            </div>
                            <div>
                                <h3 className="font-medium text-foreground mb-1">Email Us</h3>
                                <p className="text-muted-foreground text-sm sm:text-base">bidhandhakal365@gmail.com</p>
                                <p className="text-muted-foreground text-sm sm:text-base">support@pyuto.com</p>
                            </div>
                        </div>

                        <div className="bg-card rounded-lg p-4 sm:p-6 border border-border shadow-sm hover:shadow-md transition-shadow flex items-start space-x-4">
                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                                <Phone size={20} />
                            </div>
                            <div>
                                <h3 className="font-medium text-foreground mb-1">Call Us</h3>
                                <p className="text-muted-foreground text-sm sm:text-base">(+977)9768316936</p>
                                <p className="text-muted-foreground text-sm sm:text-base">Mon-Fri: 11am - 6pm</p>
                            </div>
                        </div>

                        <div className="bg-card rounded-lg p-4 sm:p-6 border border-border shadow-sm hover:shadow-md transition-shadow flex items-start space-x-4">
                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                                <MapPin size={20} />
                            </div>
                            <div>
                                <h3 className="font-medium text-foreground mb-1">Visit Us</h3>
                                <p className="text-muted-foreground text-sm sm:text-base">Tulsipur-7, Dang</p>
                                <p className="text-muted-foreground text-sm sm:text-base">Nepal</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="md:col-span-2 lg:col-span-2 order-1 md:order-2">
                        <div className="bg-card rounded-lg p-5 sm:p-6 md:p-8 border border-border shadow-sm">
                            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Get in Touch</h2>

                            {submitSuccess ? (
                                <div className="bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-md p-4 mb-6">
                                    <p className="text-green-800 dark:text-green-300 font-medium">Thank you for your message! We&apos;ll get back to you soon.</p>
                                </div>
                            ) : null}

                            {submitError ? (
                                <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md p-4 mb-6">
                                    <p className="text-red-800 dark:text-red-300 font-medium">{submitError}</p>
                                </div>
                            ) : null}

                            <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium mb-1 sm:mb-2">
                                            Your Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm sm:text-base"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium mb-1 sm:mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm sm:text-base"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium mb-1 sm:mb-2">
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm sm:text-base"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium mb-1 sm:mb-2">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        rows={4}
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none text-sm sm:text-base"
                                        required
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`flex items-center justify-center gap-2 w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors text-sm sm:text-base ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                                        }`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={16} className="hidden sm:block" />
                                            <Send size={14} className="sm:hidden" />
                                            Send Message
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
} 