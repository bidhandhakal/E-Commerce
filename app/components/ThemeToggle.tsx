"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
    const [isDark, setIsDark] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
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

        const flash = document.createElement('div');
        flash.style.position = 'fixed';
        flash.style.top = '0';
        flash.style.left = '0';
        flash.style.width = '100%';
        flash.style.height = '100%';
        flash.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        flash.style.zIndex = '10000';
        flash.style.opacity = '0';
        flash.style.transition = 'opacity 0.15s ease';
        document.body.appendChild(flash);

        const slidingBg = document.createElement('div');
        slidingBg.style.position = 'fixed';
        slidingBg.style.top = '0';
        slidingBg.style.left = '0';
        slidingBg.style.width = '100%';
        slidingBg.style.height = '100%';
        slidingBg.style.backgroundColor = isDark ? 'white' : '#000000';
        slidingBg.style.zIndex = '9998';
        slidingBg.style.transform = 'translateY(100%)';
        slidingBg.style.transition = 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)';
        document.body.appendChild(slidingBg);

        // Create subtle gradient overlay for more depth
        const gradient = document.createElement('div');
        gradient.style.position = 'fixed';
        gradient.style.top = '0';
        gradient.style.left = '0';
        gradient.style.width = '100%';
        gradient.style.height = '100%';
        gradient.style.background = isDark
            ? 'linear-gradient(to bottom, rgba(255, 255, 255, 0.05), transparent 50%)'
            : 'linear-gradient(to bottom, rgba(0, 0, 0, 0.05), transparent 50%)';
        gradient.style.zIndex = '9999';
        gradient.style.opacity = '0';
        gradient.style.transition = 'opacity 0.5s ease';
        gradient.style.pointerEvents = 'none';
        document.body.appendChild(gradient);

        const contentElement = document.querySelector('#content-wrapper') || document.querySelector('main');
        const content = contentElement as HTMLElement;

        setTimeout(() => {
            flash.style.opacity = '1';
            setTimeout(() => {
                flash.style.opacity = '0';
            }, 100);

            if (content) {
                content.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease';
                content.style.opacity = '0';
                content.style.transform = 'translateY(-35px)';
            }

            setTimeout(() => {
                slidingBg.style.transform = 'translateY(0)';
                gradient.style.opacity = '1';

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

                    slidingBg.style.transform = 'translateY(-100%)';
                    gradient.style.opacity = '0';

                    if (content) {
                        content.style.transition = 'none';
                        content.style.opacity = '0';
                        content.style.transform = 'translateY(30px)';

                        setTimeout(() => {
                            content.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.45s ease';
                            content.style.opacity = '1';
                            content.style.transform = 'translateY(0)';
                        }, 50);
                    }

                    setTimeout(() => {
                        [flash, slidingBg, gradient].forEach(el => {
                            if (el.parentNode) {
                                document.body.removeChild(el);
                            }
                        });
                        setIsTransitioning(false);
                    }, 650);
                }, 350);
            }, 80);
        }, 0);
    };

    return (
        <button
            onClick={toggleTheme}
            className={`flex items-center justify-center w-10 h-10 rounded-full bg-secondary hover:bg-secondary/80 transition-colors relative overflow-hidden cursor-pointer ${isTransitioning ? 'pointer-events-none' : ''}`}
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