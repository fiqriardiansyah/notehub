"use client";

import PickNotesProvider, { PICK_NOTES } from "@/app/components/pick-notes";
import DialogDeleteGround, { REMOVE_NOTE_EVENT } from "@/app/components/setting-note-ground/delete";
import FolderNoteGround, { FOLDER_NOTE_GROUND } from "@/app/components/setting-note-ground/folder-note";
import InitiateSecureNote, { INITIATE_SECURE_NOTE } from "@/app/components/setting-note-ground/initiate-secure-note";
import Scheduler, { SCHEDULER } from "@/app/components/setting-note-ground/scheduler";
import SecureNote, { SECURE_NOTE } from "@/app/components/setting-note-ground/secure-note";
import TagNote, { TAG_NOTE_GROUND } from "@/app/components/setting-note-ground/tag-note";
import { CommonContext, CommonContextType } from "@/context/common";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

export default function SidePage() {
    const { common } = React.useContext(CommonContext) as CommonContextType;

    return (
        <motion.div className="w-[80vw] h-screen bg-white overflow-x-hidden">
            <AnimatePresence>
                {common?.groundOpen === INITIATE_SECURE_NOTE && <InitiateSecureNote key={INITIATE_SECURE_NOTE} />}
                {common?.groundOpen === SECURE_NOTE && <SecureNote key={SECURE_NOTE} />}
                {common?.groundOpen === FOLDER_NOTE_GROUND && <FolderNoteGround key={FOLDER_NOTE_GROUND} />}
                {common?.groundOpen === TAG_NOTE_GROUND && <TagNote key={TAG_NOTE_GROUND} />}
                <DialogDeleteGround key={REMOVE_NOTE_EVENT} />
                {common?.groundOpen === PICK_NOTES && <PickNotesProvider key={PICK_NOTES} />}
                {common?.groundOpen === SCHEDULER && <Scheduler />}
            </AnimatePresence>
        </motion.div>
    );
}
