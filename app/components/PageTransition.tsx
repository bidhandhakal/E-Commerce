"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect } from "react";

interface PageTransitionProps {
    children: ReactNode;
}

const variants = {
    hidden: {
        opacity: 0,
        y: 10,
        transition: {
            duration: 0.2,
            ease: "easeInOut"
        }
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.3,
            ease: "easeOut"
        }
    }
};

export default function PageTransition({ children }: PageTransitionProps) {
    const pathname = usePathname();

    // Scroll to top on page change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [pathname]);

    return (
        <motion.div
            key={pathname}
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="w-full"
        >
            {children}
        </motion.div>
    );
} 