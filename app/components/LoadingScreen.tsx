"use client";

import { useEffect, useState } from "react";

export default function LoadingScreen() {
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // Check if this is the first load of the session
        const hasLoadedBefore = sessionStorage.getItem("hasLoadedBefore");

        if (hasLoadedBefore) {
            // Skip loading screen if not first load
            setIsLoading(false);
            setIsFirstLoad(false);
            return;
        }

        // Check theme
        const savedTheme = localStorage.getItem("theme");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setIsDark(savedTheme === "dark" || (!savedTheme && prefersDark));

        // Set flag to indicate the site has been loaded in this session
        sessionStorage.setItem("hasLoadedBefore", "true");

        // Simulate loading progress
        const interval = setInterval(() => {
            setProgress((prevProgress) => {
                if (prevProgress >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setIsLoading(false), 500); // Add a small delay for smooth transition
                    return 100;
                }
                return prevProgress + 5;
            });
        }, 120);

        return () => clearInterval(interval);
    }, []);

    // Don't render anything if not loading or not first load
    if (!isLoading || !isFirstLoad) return null;

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background transition-colors">
            <div className="relative w-32 h-32">
                <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                    <svg
                        className="w-full h-full"
                        viewBox="0 0 256 256"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <rect
                            width="256"
                            height="256"
                            rx="60"
                            className="text-primary fill-current"
                        />
                        <path
                            d="M178 60h-36l-4 14h-20l-4-14H78c-3 0-5 3-4 6l12 32c1 2 3 3 5 3h10v84c0 3 3 6 6 6h48c3 0 6-3 6-6v-84h10c2 0 4-1 5-3l12-32c1-3-1-6-4-6z"
                            fill="white"
                        />
                        <path
                            d="M128 116c-8 0-14 1-19 4-5 3-7 7-7 12 0 4 1 7 4 9 3 2 7 4 12 5 4 1 7 2 9 3 2 1 3 2 3 4 0 1-1 3-2 4-1 1-3 1-6 1-4 0-6-1-8-2-2-1-3-3-3-6h-10c0 5 2 9 5 12 4 3 9 4 16 4 7 0 13-1 17-4 4-3 6-7 6-12 0-4-1-7-4-9-2-2-6-4-11-5-4-1-7-2-9-3-2-1-3-2-3-4 0-1 1-2 2-3 1-1 3-2 6-2 3 0 5 1 7 2 2 1 3 3 3 5h10c0-4-2-8-5-11-3-3-8-4-15-4z"
                            className={isDark ? "fill-white" : "fill-black"}
                        />
                        <path
                            d="M114 65h28M114 70h28"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    </svg>
                </div>
            </div>

            <h1 className="mt-6 text-2xl font-bold text-foreground animate-pulse">
                Pyuto
            </h1>

            <div className="w-64 h-3 mt-8 rounded-full bg-muted overflow-hidden">
                <div
                    className="h-full bg-primary transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
                {progress < 30 ? "Loading amazing styles..." :
                    progress < 60 ? "Preparing your experience..." :
                        progress < 90 ? "Almost there..." :
                            "Welcome to Pyuto!"}
            </p>
        </div>
    );
} 