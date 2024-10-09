"use client";

import ViewAttachNote, { VIEW_ATTACH_NOTE } from "@/app/habits/[id]/components/view-attach-note";
import CollabsNoteGround, { COLLABS_NOTE_GROUND } from "@/components/card-note/setting/collabs";
import FolderNoteGround, { FOLDER_NOTE_GROUND } from "@/components/card-note/setting/folder-note";
import InitiateSecureNote, { INITIATE_SECURE_NOTE } from "@/components/card-note/setting/initiate-secure-note";
import Scheduler, { SCHEDULER } from "@/components/card-note/setting/scheduler";
import SecureNote, { SECURE_NOTE } from "@/components/card-note/setting/secure-note";
import TagNote, { TAG_NOTE_GROUND } from "@/components/card-note/setting/tag-note";
import PickNotesProvider, { PICK_NOTES } from "@/components/pick-notes";
import { AnimatePresence, motion } from "framer-motion";
import Notifications, { NOTIFICATIONS } from "../../notifications";

export default function SidePanelMobile() {
    return (
        <motion.div className="w-[90vw] h-screen bg-white overflow-x-hidden p-4 relative">
            <AnimatePresence>
                <InitiateSecureNote key={INITIATE_SECURE_NOTE} />
                <SecureNote key={SECURE_NOTE} />
                <TagNote key={TAG_NOTE_GROUND} />
                <FolderNoteGround key={FOLDER_NOTE_GROUND} />
                <Notifications key={NOTIFICATIONS} />
                <Scheduler key={SCHEDULER} />
                <ViewAttachNote key={VIEW_ATTACH_NOTE} />
                <PickNotesProvider key={PICK_NOTES} />
                <CollabsNoteGround key={COLLABS_NOTE_GROUND} />
            </AnimatePresence>
        </motion.div>
    );
}
