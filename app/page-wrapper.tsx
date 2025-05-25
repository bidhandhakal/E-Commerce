"use client";

import { ReactNode } from "react";
import { AnimatePresence } from "framer-motion";
import PageTransition from "./components/PageTransition";

interface PageWrapperProps {
    children: ReactNode;
}

export default function PageWrapper({ children }: PageWrapperProps) {
    return (
        <AnimatePresence mode="wait">
            <PageTransition>{children}</PageTransition>
        </AnimatePresence>
    );
} 