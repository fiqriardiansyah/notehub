"use client";

import ConfirmSecure from "@/app/secure-password/confirm-secure";
import { motion } from 'framer-motion';

export const SECURE_NOTE = "secureNote";

export default function SecureNote() {
    const onFinish = (isPasswordCorrect: boolean) => {
        window.dispatchEvent(new CustomEvent(SECURE_NOTE, { detail: { isPasswordCorrect } }))
    };

    return (
        <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1, transition: { delay: .3 } }} className="w-full h-full flex items-center justify-center">
            <div className="px-5 md:px-0 md:w-[300px]">
                <ConfirmSecure onFinish={onFinish} />
            </div>
        </motion.div>
    );
}
