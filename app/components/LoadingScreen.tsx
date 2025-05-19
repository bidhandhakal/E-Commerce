"use client";

import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const FIXED_LOADING_TIME = 4000;

export default function LoadingScreen() {
    const [progress, setProgress] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const [isDark, setIsDark] = useState(false);
    const loadingRef = useRef<NodeJS.Timeout | null>(null);
    const [animationComplete, setAnimationComplete] = useState(false);

    useLayoutEffect(() => {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = localStorage.getItem("theme");
        const isDarkMode = savedTheme === "dark" || (!savedTheme && prefersDark);

        document.documentElement.style.backgroundColor =
            isDarkMode ? 'oklch(1 0 0)' : 'oklch(0.141 0.005 285.823)';
        document.body.style.backgroundColor =
            isDarkMode ? 'oklch(1 0 0)' : 'oklch(0.141 0.005 285.823)';

        setIsDark(isDarkMode);
    }, []);

    useEffect(() => {


        const startTime = Date.now();

        const progressInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progressPercent = Math.min((elapsed / FIXED_LOADING_TIME) * 100, 100);

            setProgress(progressPercent);

            if (elapsed >= FIXED_LOADING_TIME) {
                clearInterval(progressInterval);
                setProgress(100);

                setTimeout(() => {
                    setTimeout(() => {
                        setAnimationComplete(true);
                        setTimeout(() => setIsVisible(false), 800);
                    }, 200);
                }, 300);
            }
        }, 50);

        loadingRef.current = progressInterval;

        return () => {
            if (loadingRef.current) clearInterval(loadingRef.current);
        };
    }, []);

    if (!isVisible) return null;

    return (
        <AnimatePresence mode="wait">
            {isVisible && (
                <>
                    {/* Main content that will slide up */}
                    <motion.div
                        key="loading-content"
                        initial={{ opacity: 1 }}
                        animate={{
                            opacity: animationComplete ? 0 : 1,
                            y: animationComplete ? -60 : 0
                        }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
                        style={{
                            backgroundColor: 'transparent'
                        }}
                    >
                        <div className="relative z-10 flex flex-col items-center max-w-lg px-6 text-center">
                            {/* Logo */}
                            <motion.div
                                className="mb-6"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Image
                                    src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/phalcon/phalcon-plain.svg"
                                    alt="Loading icon"
                                    width={192}
                                    height={192}
                                    priority
                                />
                            </motion.div>

                            {/* Brand name instead of loading text */}
                            <motion.h1
                                className="text-5xl font-bold mb-10 font-montserrat tracking-wider"
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                style={{ color: isDark ? '#141015' : 'white' }}
                            >
                                Luxera
                            </motion.h1>

                            {/* Progress bar */}
                            <div className="w-64 h-1 bg-opacity-20 rounded-full overflow-hidden relative"
                                style={{ backgroundColor: isDark ? 'rgba(20, 16, 21, 0.2)' : 'rgba(255, 255, 255, 0.2)' }}>
                                <motion.div
                                    className="h-full rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.3 }}
                                    style={{ backgroundColor: isDark ? '#141015' : 'white' }}
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Background that slides up to reveal the main site */}
                    <motion.div
                        key="loading-bg"
                        className="fixed inset-0 z-[9998] pointer-events-none"
                        initial={{ y: 0 }}
                        animate={{ y: animationComplete ? "-100%" : 0 }}
                        transition={{
                            duration: 0.8,
                            ease: [0.22, 1, 0.36, 1],
                            delay: 0.1
                        }}
                        style={{
                            backgroundColor: isDark ? 'oklch(1 0 0)' : 'oklch(0.141 0.005 285.823)',
                        }}
                    />
                </>
            )}
        </AnimatePresence>
    );
} 