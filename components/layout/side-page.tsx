"use client";

import PickNotesProvider, { PICK_NOTES } from "@/components/pick-notes";
import CollabsNoteGround, { COLLABS_NOTE_GROUND } from "@/components/card-note/setting/collabs";
import DialogDeleteGround, { REMOVE_NOTE_EVENT } from "@/components/card-note/setting/delete";
import DialogDeleteFolderGround, { REMOVE_FOLDER_EVENT } from "@/components/card-note/setting/delete-folder";
import FolderNoteGround, { FOLDER_NOTE_GROUND } from "@/components/card-note/setting/folder-note";
import InitiateSecureNote, { INITIATE_SECURE_NOTE } from "@/components/card-note/setting/initiate-secure-note";
import Scheduler, { SCHEDULER } from "@/components/card-note/setting/scheduler";
import SecureNote, { SECURE_NOTE } from "@/components/card-note/setting/secure-note";
import TagNote, { TAG_NOTE_GROUND } from "@/components/card-note/setting/tag-note";
import ViewAttachNote, { VIEW_ATTACH_NOTE } from "@/app/habits/[id]/components/view-attach-note";
import { CommonContext, CommonContextType } from "@/context/common";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import Notifications, { NOTIFICATIONS } from "../notifications";

export default function SidePage() {
    const { common } = React.useContext(CommonContext) as CommonContextType;
    return (
        <motion.div className="w-[90vw] h-screen bg-white overflow-x-hidden">
            <AnimatePresence>
                {common?.groundOpen === INITIATE_SECURE_NOTE && <InitiateSecureNote key={INITIATE_SECURE_NOTE} />}
                {common?.groundOpen === SECURE_NOTE && <SecureNote key={SECURE_NOTE} />}
                {common?.groundOpen === FOLDER_NOTE_GROUND && <FolderNoteGround key={FOLDER_NOTE_GROUND} />}
                {common?.groundOpen === TAG_NOTE_GROUND && <TagNote key={TAG_NOTE_GROUND} />}
                {common?.groundOpen === NOTIFICATIONS && <Notifications />}
                <DialogDeleteGround key={REMOVE_NOTE_EVENT} />
                <DialogDeleteFolderGround key={REMOVE_FOLDER_EVENT} />
                {common?.groundOpen === SCHEDULER && <Scheduler key={SCHEDULER} />}
                <ViewAttachNote key={VIEW_ATTACH_NOTE} />
                <PickNotesProvider key={PICK_NOTES} />
                <CollabsNoteGround key={COLLABS_NOTE_GROUND} />
            </AnimatePresence>
        </motion.div>
    );
}
