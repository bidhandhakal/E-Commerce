"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
    const [isDark, setIsDark] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        // Check for saved theme preference or system preference
        const savedTheme = localStorage.getItem("theme");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

        if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
            setIsDark(true);
            document.documentElement.classList.add("dark");
        } else {
            setIsDark(false);
            document.documentElement.classList.remove("dark");
        }
    }, []);

    const toggleTheme = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);

        // Create and add the overlay
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)';
        overlay.style.backdropFilter = 'blur(4px)';
        overlay.style.zIndex = '9999';
        overlay.style.transition = 'opacity 0.3s ease';
        overlay.style.opacity = '0';
        document.body.appendChild(overlay);

        // Animate the overlay in
        setTimeout(() => {
            overlay.style.opacity = '1';
        }, 10);

        // Animate the content
        const mainContent = document.querySelector('main');
        if (mainContent) {
            mainContent.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
            mainContent.style.opacity = '0';
            mainContent.style.transform = 'translateY(20px)';
        }

        // Change the theme after a delay
        setTimeout(() => {
            if (isDark) {
                document.documentElement.classList.remove("dark");
                localStorage.setItem("theme", "light");
                setIsDark(false);
            } else {
                document.documentElement.classList.add("dark");
                localStorage.setItem("theme", "dark");
                setIsDark(true);
            }

            // Animate content back in with push-up effect
            if (mainContent) {
                mainContent.style.transform = 'translateY(0)';
                mainContent.style.opacity = '1';
            }

            // Fade out and remove the overlay
            overlay.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(overlay);
                setIsTransitioning(false);
            }, 300);
        }, 400);
    };

    return (
        <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary hover:bg-secondary/80 transition-colors relative overflow-hidden"
            aria-label="Toggle theme"
            disabled={isTransitioning}
        >
            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isDark ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
                <Sun size={20} className="text-secondary-foreground" />
            </div>
            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isDark ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`}>
                <Moon size={20} className="text-secondary-foreground" />
            </div>
        </button>
    );
} 