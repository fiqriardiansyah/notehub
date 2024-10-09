"use client";

import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import { CommonContext, CommonContextType } from "@/context/common";
import { NoteContext, NoteContextType } from "@/context/note";
import { useMobileMediaQuery } from "@/hooks/responsive";
import { fireBridgeEvent, useBridgeEvent } from "@/hooks/use-bridge-event";
import useMenuNoteCollabList, { CollaborateSetting } from "@/hooks/use-menu-note-collab-list";
import { CollaborateProject } from "@/models/collab";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import React from "react";
import LeaveProject, { LEAVE_PROJECT } from "../card-note-collab/setting/leave";

export type CollabBottomSheet = {
    refetch?: () => void;
}

export const CLOSE_BOTTOM_SHEET = "closeBottomSheet";

export default function CollabBottomSheet({ refetch }: CollabBottomSheet) {
    const { common } = React.useContext(CommonContext) as CommonContextType;
    const { note, setNote } = React.useContext(NoteContext) as NoteContextType;
    const collabNote = note?.note as unknown as CollaborateProject;

    const isMobile = useMobileMediaQuery();
    const settings = useMenuNoteCollabList(collabNote);

    const isOpen = !!note?.note && !common?.sidePageOpen;

    const onOpenChange = (val: boolean) => {
        if (common?.sidePageOpen) return;
        if (!val) {
            setNote((prev) => ({
                ...prev,
                note: null,
            }));
        }
    };

    useBridgeEvent(CLOSE_BOTTOM_SHEET, (payload) => {
        setNote((prev) => ({ ...prev, note: null }));
        if (refetch) refetch();
    });

    const handleClickSetting = (setting: CollaborateSetting) => {
        return () => {
            if (setting.type === "leave_project") {
                fireBridgeEvent(LEAVE_PROJECT, collabNote);
            }
        }
    };

    if (!isMobile) return null;
    return (
        <>
            <Drawer open={isOpen} onOpenChange={onOpenChange}>
                <DrawerContent className="z-50">
                    <DrawerHeader>
                        <DrawerTitle className="capitalize">{collabNote?.title}</DrawerTitle>
                    </DrawerHeader>
                    <div className="flex flex-col p-4 gap-3">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-[25px] h-[25px] rounded-full bg-slate-300">
                                <Image
                                    title={collabNote?.ownerName || ""} height={25} width={25} alt={collabNote?.ownerName || ""}
                                    src={collabNote?.ownerImage || ""} className="rounded-full object-cover bg-gray-200" />
                            </div>
                            <p className="m-0">{`${collabNote?.ownerName}'s Project`}</p>
                        </div>
                        {settings?.map((Setting) => (
                            <Button
                                key={Setting.text}
                                onClick={handleClickSetting(Setting)}
                                className="flex items-center gap-3 justify-between"
                                variant={Setting.danger ? "destructive" : "ghost"}
                            >
                                <div className="flex items-center gap-3 flex-1">
                                    <Setting.icon />
                                    {Setting.text}
                                </div>
                                {Setting?.rightElement ? Setting?.rightElement : <ChevronRight />}
                            </Button>
                        ))}
                    </div>
                </DrawerContent>
            </Drawer>
            <LeaveProject />
        </>
    );
}
