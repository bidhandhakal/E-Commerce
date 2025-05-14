"use client";

import { useState, FormEvent } from "react";
import Image from "next/image";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function ContactPage() {
    const { requireAuth } = useAuth();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // Check if user is authenticated
        const isAuthorized = await requireAuth("You need to sign in to send us a message.");

        if (isAuthorized) {
            setIsSubmitting(true);

            try {
                // Here you would normally send the data to your backend
                // For now, we&apos;ll just simulate a successful submission
                await new Promise(resolve => setTimeout(resolve, 1000));

                setSubmitSuccess(true);
                setFormData({
                    name: "",
                    email: "",
                    subject: "",
                    message: ""
                });

                // Reset success message after 5 seconds
                setTimeout(() => {
                    setSubmitSuccess(false);
                }, 5000);
            } catch (error) {
                console.error("Error submitting form:", error);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <>
            {/* Hero section */}
            <div className="relative h-64 md:h-72 bg-muted">
                <Image
                    src="https://images.unsplash.com/photo-1534536281715-e28d76689b4d?q=80&w=2070&auto=format&fit=crop"
                    alt="Contact us"
                    fill
                    className="object-cover object-center brightness-75"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                            Contact Us
                        </h1>
                        <p className="text-white/90 max-w-xl mx-auto px-4">
                            We're here to help with any questions about our products
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Contact Info Cards */}
                    <div className="space-y-6">
                        <div className="bg-card rounded-lg p-6 border border-border shadow-sm hover:shadow-md transition-shadow flex items-start space-x-4">
                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                                <Mail size={20} />
                            </div>
                            <div>
                                <h3 className="font-medium text-foreground mb-1">Email Us</h3>
                                <p className="text-muted-foreground">bidhandhakal365@gmail.com</p>
                                <p className="text-muted-foreground">support@pyuto.com</p>
                            </div>
                        </div>

                        <div className="bg-card rounded-lg p-6 border border-border shadow-sm hover:shadow-md transition-shadow flex items-start space-x-4">
                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                                <Phone size={20} />
                            </div>
                            <div>
                                <h3 className="font-medium text-foreground mb-1">Call Us</h3>
                                <p className="text-muted-foreground">(+977)976831693</p>
                                <p className="text-muted-foreground">Mon-Fri: 11am - 6pm</p>
                            </div>
                        </div>

                        <div className="bg-card rounded-lg p-6 border border-border shadow-sm hover:shadow-md transition-shadow flex items-start space-x-4">
                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                                <MapPin size={20} />
                            </div>
                            <div>
                                <h3 className="font-medium text-foreground mb-1">Visit Us</h3>
                                <p className="text-muted-foreground">Tulsipur-7, Dang</p>
                                <p className="text-muted-foreground">Nepal</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-card rounded-lg p-8 border border-border shadow-sm">
                            <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>

                            {submitSuccess ? (
                                <div className="bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-md p-4 mb-6">
                                    <p className="text-green-800 dark:text-green-300 font-medium">Thank you for your message! We'll get back to you soon.</p>
                                </div>
                            ) : null}

                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium mb-2">
                                            Your Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium mb-2">
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        rows={5}
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                                        required
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                                        }`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={16} />
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