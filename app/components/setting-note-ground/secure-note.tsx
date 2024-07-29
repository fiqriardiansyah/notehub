"use client";

import SecurePassword from "@/app/secure-password/page";
import { WriteContext, WriteContextType } from "@/context/write";
import useSidePage from "@/hooks/use-side-page";
import { motion } from 'framer-motion';
import React from "react";

export const SECURE_NOTE_GROUND = "secureNoteGround";

export default function SecureNote() {
    const { setDataNote } = React.useContext(WriteContext) as WriteContextType;
    const [_, resetSidePage] = useSidePage();

    const loadingRef = React.useRef(false);

    const listener = ({ secureNote }: { secureNote?: boolean; }) => {
        setDataNote((prev) => ({ ...prev, isSecure: secureNote }));
        resetSidePage();
    };

    return (
        <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1, transition: { delay: .3 } }} className="w-full h-full flex items-center justify-center">
            <div className="px-5 md:px-0 md:w-[300px]">
                <SecurePassword onFinish={listener} ref={loadingRef} />
            </div>
        </motion.div>
    );
}
