"use client";

import ViewAttachNote, { VIEW_ATTACH_NOTE } from "@/app/habits/[id]/components/view-attach-note";
import CollabsNoteGround, { COLLABS_NOTE_GROUND } from "@/components/card-note/setting/collabs";
import FolderNoteGround, { FOLDER_NOTE_GROUND } from "@/components/card-note/setting/folder-note";
import InitiateSecureNote, { INITIATE_SECURE_NOTE } from "@/components/card-note/setting/initiate-secure-note";
import Scheduler, { SCHEDULER } from "@/components/card-note/setting/scheduler";
import SecureNote, { SECURE_NOTE } from "@/components/card-note/setting/secure-note";
import TagNote, { TAG_NOTE_GROUND } from "@/components/card-note/setting/tag-note";
import HabitsAlert from "@/components/habits/habits-alert";
import { navigation } from "@/components/navigation-bar/utils";
import PickNotesProvider, { PICK_NOTES } from "@/components/pick-notes";
import { Button } from "@/components/ui/button";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CommonContext, CommonContextType } from "@/context/common";
import habitsService from "@/service/habits";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";
import Notifications, { NOTIFICATIONS } from "../../notifications";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { fireBridgeEvent, useBridgeEvent } from "@/hooks/use-bridge-event";
import { CLOSE_SIDE_PANEL, OPEN_SIDE_PANEL } from ".";

export default function SidePanelDesktop() {
    const pathname = usePathname();
    const { common, setCommon } = React.useContext(CommonContext) as CommonContextType;

    // const habitsToday = useQuery([habitsService.getUrgentHabit.name, pathname], async () => {
    //     return (await habitsService.getUrgentHabit()).data.data;
    // }, {
    //     refetchInterval: false,
    //     onSuccess(data) {
    //         const open = () => {
    //             if (!data || !data?.length) return false;
    //             if (pathname === navigation.habits.href) return false;
    //             if (pathname === navigation.habits.href + "/" + data[0].id) return false;
    //             return !!data.length;
    //         }
    //         setCommon((prev) => ({ ...prev, sidePageOpen: open() }));
    //     },
    // });

    const onClose = () => {
        setCommon((prev) => ({ ...prev, sidePageOpen: false, groundOpen: undefined }));
    }

    // if (!common?.sidePageOpen) return null;
    return (
        <>
            {/* <ResizableHandle withHandle />
            <ResizablePanel defaultSize={30} minSize={25} order={2} id="panel-sidepage" >
                <ResizablePanelGroup direction="vertical">
                    {habitsToday?.data?.length && (
                        <ResizablePanel id="side-page-first" defaultSize={50}>
                            <ScrollArea className="h-screen p-4">
                                <HabitsAlert />
                            </ScrollArea>
                        </ResizablePanel>
                    )}
                </ResizablePanelGroup>
            </ResizablePanel> */}
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