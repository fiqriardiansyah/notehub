"use client";

import { House, PanelsTopLeft, Plus, Shell, Trophy } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import themeColor from 'tailwindcss/colors';
import { motion } from "framer-motion";

export default function BottomBar() {
    const pathname = usePathname();

    return (
        <motion.div animate={{ y: 0, transition: { delay: 0.8 } }} initial={{ y: '100%' }} className="fixed bottom-0 left-0 right-0 w-screen container-custom z-50 bg-white">
            <div className="w-full flex items-center justify-around py-3">
                <Link style={{ color: pathname === "/" ? themeColor.gray[700] : themeColor.gray[400] }} href="/"><House /></Link>
                <Link style={{ color: themeColor.gray[400] }} href="#"><Shell /></Link>
                <Link style={{ color: pathname.includes("/write") ? themeColor.gray[700] : themeColor.gray[400] }} href="/write"><Plus /></Link>
                <Link style={{ color: pathname.includes("/habits") ? themeColor.gray[700] : themeColor.gray[400] }} href="/habits"><Trophy /></Link>
                <Link style={{ color: themeColor.gray[400] }} href="#"><PanelsTopLeft /></Link>
            </div>
        </motion.div>
    )
}