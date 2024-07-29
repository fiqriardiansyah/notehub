"use client";
import FolderNoteGround, { FOLDER_NOTE_GROUND } from "@/app/components/setting-note-ground/folder-note";
import SecureNote, { SECURE_NOTE_GROUND } from "@/app/components/setting-note-ground/secure-note";
import TagNote, { TAG_NOTE_GROUND } from "@/app/components/setting-note-ground/tag-note";
import { CommonContext, CommonContextType } from "@/context/common";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

export default function SidePage() {
    const { common } = React.useContext(CommonContext) as CommonContextType;

    return (
        <motion.div className="w-[80vw] h-screen bg-white overflow-x-hidden">
            <AnimatePresence>
                {common?.groundOpen === SECURE_NOTE_GROUND && <SecureNote />}
                {common?.groundOpen === FOLDER_NOTE_GROUND && <FolderNoteGround />}
                {common?.groundOpen === TAG_NOTE_GROUND && <TagNote />}
            </AnimatePresence>
        </motion.div>
    );
}
