"use client";

import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import { NoteContext, NoteContextType } from "@/context/note";
import useMenuNoteCollabList, { CollaborateSetting } from "@/hooks/use-menu-note-collab-list";
import useSidePage from "@/hooks/use-side-page";
import { CollaborateProject } from "@/models/collab";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import React from "react";
import { useMediaQuery } from "react-responsive";

export type CollabBottomSheet = {
    refetch?: () => void;
}

export default function CollabBottomSheet({ refetch }: CollabBottomSheet) {
    const { note, setNote } = React.useContext(NoteContext) as NoteContextType;
    const isBigScreen = useMediaQuery({ query: "(max-width: 600px)" });

    const collabNote = note?.note as unknown as CollaborateProject;

    const settings = useMenuNoteCollabList(collabNote);
    const [setSidePage, resetSidePage, isSidePageOpen] = useSidePage();

    const isOpen = !!note?.note && isBigScreen && !isSidePageOpen;

    const onOpenChange = (val: boolean) => {
        if (isSidePageOpen) return;
        if (!val) {
            setNote((prev) => ({
                ...prev,
                note: null,
            }));
        }
    };

    const handleClickSetting = (setting: CollaborateSetting) => {
        return () => {

        }
    };

    const isLoading = (setting: CollaborateSetting) => {
        return false;
    }

    return (
        <Drawer open={isOpen} onOpenChange={onOpenChange}>
            <DrawerContent className="z-50">
                <DrawerHeader>
                    <DrawerTitle className="capitalize">{collabNote?.title}</DrawerTitle>
                </DrawerHeader>
                <div className="flex flex-col p-4 gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-[25px] h-[25px] rounded-full bg-slate-300">
                            <Image
                                title={collabNote?.ownerName || ""} height={25} width={25} alt={collabNote?.ownerName || ""}
                                src={collabNote?.ownerImage || ""} className="rounded-full object-cover bg-gray-200" />
                        </div>
                        <p className="m-0">{`${collabNote?.ownerName}'s Project`}</p>
                    </div>
                    {settings?.map((Setting) => (
                        <Button
                            loading={isLoading(Setting)}
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
    );
}
