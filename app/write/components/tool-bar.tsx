"use client";

import ButtonSuccessAnim from "@/components/animation/button-success";
import { Button } from "@/components/ui/button";
import FolderNote from "./folder-note";
import ModeWrite from "./mode-write";
import SecureNote from "./secure-note";
import TagNote from "./tag-note";
import { WriteContext, WriteContextType } from "@/context/write";
import React from "react";
import Scheduler from "./scheduler";
import { Note } from "@/models/note";
import DeleteNote from "./delete-note";
import CollabNote from "./collab-note";

export type ToolsType = "tag" | "folder" | "secure" | "mode" | "delete" | "collabs"

export type ToolsBarType = {
    save: () => void;
    isLoading?: boolean;
    excludeSettings?: ToolsType[];
    currentNote?: Note;
};

export default function ToolsBar({ save, isLoading, excludeSettings, currentNote }: ToolsBarType) {
    const { dataNote } = React.useContext(WriteContext) as WriteContextType;

    return (
        <div className="w-full bg-white p-1 h-full flex items-center justify-evenly gap-2 container-custom">
            {!excludeSettings?.find((s) => s === "collabs") && <CollabNote note={currentNote} />}
            {!excludeSettings?.find((s) => s === "tag") && <TagNote />}
            {!excludeSettings?.find((s) => s === "folder") && <FolderNote />}
            {!excludeSettings?.find((s) => s === "secure") && <SecureNote note={currentNote} />}
            {dataNote.modeWrite === "habits" && <Scheduler />}
            <ButtonSuccessAnim id="button-save-write" message="Saved ✨">
                <Button
                    disabled={isLoading}
                    onClick={save}
                    size="sm"
                    className="rounded-full px-5"
                >
                    Save
                </Button>
            </ButtonSuccessAnim>
            {!excludeSettings?.find((s) => s === "mode") && (
                <>
                    <div className="h-[35px] w-[1px] bg-gray-500"></div>
                    <ModeWrite />
                </>
            )}
            {!excludeSettings?.find((s) => s === "delete") && <DeleteNote note={currentNote} />}
        </div>
    );
}
