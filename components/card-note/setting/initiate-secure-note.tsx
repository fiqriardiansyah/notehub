"use client";

import SecurePassword from "@/app/secure-password/secure-password";
import { motion } from 'framer-motion';

export const INITIATE_SECURE_NOTE = "initiateSecureNote";

export default function InitiateSecureNote() {

    const onFinish = () => {
        window.dispatchEvent(new CustomEvent(INITIATE_SECURE_NOTE));
    };

    return (
        <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1, transition: { delay: .3 } }} className="w-full h-full flex items-center justify-center">
            <div className="px-5 md:px-0 md:w-[300px]">
                <SecurePassword onFinish={onFinish} />
            </div>
        </motion.div>
    );
}
