"use client";

import { useEffect } from "react";

export default function ClerkPreload() {
    useEffect(() => {
        const preloadClerkResources = async () => {
            try {
                const jsPreloadLinks = [
                    'https://cdn.jsdelivr.net/npm/@clerk/clerk-js@latest/dist/clerk.browser.js'
                ];

                jsPreloadLinks.forEach(url => {
                    const linkPreload = document.createElement('link');
                    linkPreload.rel = 'preload';
                    linkPreload.as = 'script';
                    linkPreload.href = url;
                    linkPreload.fetchPriority = 'high';
                    document.head.appendChild(linkPreload);
                });

                const dnsPrefetchDomains = [
                    'https://clerk.luxera.com',
                    'https://accounts.google.com',
                    'https://connect.facebook.net',
                    'https://appleid.apple.com'
                ];

                dnsPrefetchDomains.forEach(domain => {
                    const dnsPrefetch = document.createElement('link');
                    dnsPrefetch.rel = 'dns-prefetch';
                    dnsPrefetch.href = domain;
                    document.head.appendChild(dnsPrefetch);
                });
            } catch (error) {
                console.error("Error preloading Clerk resources:", error);
            }
        };

        preloadClerkResources();
    }, []);

    return null;
} 