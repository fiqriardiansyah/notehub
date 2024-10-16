"use client";

import ViewAttachNote, { VIEW_ATTACH_NOTE } from "@/app/habits/[id]/components/view-attach-note";
import CollabsNoteGround, { COLLABS_NOTE_GROUND } from "@/components/card-note/setting/collabs";
import FolderNoteGround, { FOLDER_NOTE_GROUND } from "@/components/card-note/setting/folder-note";
import InitiateSecureNote, { INITIATE_SECURE_NOTE } from "@/components/card-note/setting/initiate-secure-note";
import Scheduler, { SCHEDULER } from "@/components/card-note/setting/scheduler";
import SecureNote, { SECURE_NOTE } from "@/components/card-note/setting/secure-note";
import TagNote, { TAG_NOTE_GROUND } from "@/components/card-note/setting/tag-note";
import PickNotesProvider, { PICK_NOTES } from "@/components/pick-notes";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle
} from "@/components/ui/sheet";
import { CommonContext, CommonContextType } from "@/context/common";
import React from "react";
import Notifications, { NOTIFICATIONS } from "../../notifications";

export default function SidePanelDesktop() {
    const { common, setCommon } = React.useContext(CommonContext) as CommonContextType;

    const onClose = () => {
        setCommon((prev) => ({ ...prev, sidePageOpen: false, groundOpen: undefined }));
    }

    return (
        <>

            <Sheet open={common?.sidePageOpen && !!common?.groundOpen} onOpenChange={onClose} >
                <SheetContent className="min-w-[400px] sm:min-w-[540px]">
                    <SheetHeader className="hidden">
                        <SheetTitle></SheetTitle>
                    </SheetHeader>
                    <InitiateSecureNote key={INITIATE_SECURE_NOTE} />
                    <SecureNote key={SECURE_NOTE} />
                    <TagNote key={TAG_NOTE_GROUND} />
                    <FolderNoteGround key={FOLDER_NOTE_GROUND} />
                    <Notifications key={NOTIFICATIONS} />
                    <Scheduler key={SCHEDULER} />
                    <ViewAttachNote key={VIEW_ATTACH_NOTE} />
                    <PickNotesProvider key={PICK_NOTES} />
                    <CollabsNoteGround key={COLLABS_NOTE_GROUND} />
                </SheetContent>
            </Sheet>
        </>
    );
}