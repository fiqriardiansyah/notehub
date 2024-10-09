"use client";

import ConfirmSecure from "@/app/secure-password/confirm-secure";
import { CommonContext, CommonContextType } from "@/context/common";
import { fireBridgeEvent } from "@/hooks/use-bridge-event";
import { motion } from 'framer-motion';
import React from "react";

export const SECURE_NOTE = "secureNote";
export const SECURE_NOTE_FINISH = "secureNoteFinish";

export default function SecureNote() {
    const { common } = React.useContext(CommonContext) as CommonContextType;

    const onFinish = (isPasswordCorrect: boolean) => {
        fireBridgeEvent(SECURE_NOTE_FINISH, { isPasswordCorrect });
    };

    if (common?.groundOpen !== SECURE_NOTE) return null;
    return (
        <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1, transition: { delay: .3 } }} className="w-full flex flex-col">
            <h1 className="font-semibold text-xl capitalize mb-5">Make your note secure</h1>
            <div className="rounded-lg p-2 border border-red-400 mb-10 mt-5">
                <div className="m-0 text-xs text-red-400">
                    IMPORTANT
                    <ul className="mt-1">
                        <li>Collaboration: anyone in this project will be removed</li>
                        <li>Share Link: the link will not valid until set to unsecure</li>
                    </ul>
                </div>
            </div>
            <ConfirmSecure onFinish={onFinish} />
        </motion.div>
    );
}
