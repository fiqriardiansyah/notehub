"use client";

import SecurePassword from "@/app/secure-password/secure-password";
import { CommonContext, CommonContextType } from "@/context/common";
import { fireBridgeEvent } from "@/hooks/use-bridge-event";
import { motion } from 'framer-motion';
import React from "react";

export const INITIATE_SECURE_NOTE = "initiateSecureNote";
export const INITIATE_SECURE_NOTE_FINISH = "initiateSecureNoteFinish";

export default function InitiateSecureNote() {
    const { common } = React.useContext(CommonContext) as CommonContextType;

    const onFinish = () => {
        fireBridgeEvent(INITIATE_SECURE_NOTE_FINISH, null);
    };

    if (common?.groundOpen !== INITIATE_SECURE_NOTE) return null;
    return (
        <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1, transition: { delay: .3 } }} className="w-full h-full flex flex-col">
            <h1 className="font-semibold text-xl capitalize mb-5">Create your password for secure note</h1>
            <div className="rounded-lg p-2 border border-red-400 mb-10 mt-5">
                <div className="m-0 text-xs text-red-400">
                    IMPORTANT
                    <ul className="mt-1">
                        <li>Collaboration: anyone in this project will be removed</li>
                        <li>Share Link: the link will not valid until set to unsecure</li>
                    </ul>
                </div>
            </div>
            <SecurePassword onFinish={onFinish} />
        </motion.div>
    );
}
