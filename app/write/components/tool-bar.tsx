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
import { AnimatePresence, motion } from "framer-motion";

export type ToolsType = "tag" | "folder" | "secure" | "mode" | "delete" | "collabs"

export type ToolsBarType = {
    save: () => void;
    isLoading?: boolean;
    excludeSettings?: ToolsType[];
    currentNote?: Note;
};

const AnimateItem = ({ children }: { children: any }) => {
    return (
        <motion.div
            exit={{ width: '0', scale: 0, opacity: 0 }}
            animate={{ width: '40px', scale: 1, opacity: 1 }}
            initial={{ width: '0', scale: 0, opacity: 0 }}
        >
            {children}
        </motion.div>
    )
}

export default function ToolsBar({ save, isLoading, excludeSettings, currentNote }: ToolsBarType) {
    const { dataNote } = React.useContext(WriteContext) as WriteContextType;

    const showCollab = !excludeSettings?.find((s) => s === "collabs");
    const showTag = !excludeSettings?.find((s) => s === "tag");
    const showFolder = !excludeSettings?.find((s) => s === "folder");
    const showSecure = !excludeSettings?.find((s) => s === "secure");
    const showSchedule = dataNote.modeWrite === "habits";

    return (
        <div className="w-full bg-white p-1 h-full flex items-center justify-evenly gap-2 container-custom lg:rounded-full">
            <AnimatePresence mode="popLayout" >
                {showCollab && (
                    <AnimateItem key="collabs">
                        <CollabNote note={currentNote} />
                    </AnimateItem>
                )}
            </AnimatePresence>
            <AnimatePresence mode="popLayout" >
                {showTag && (
                    <AnimateItem key="tag">
                        <TagNote />
                    </AnimateItem>
                )}

            </AnimatePresence>
            <AnimatePresence mode="popLayout" >
                {showFolder && (
                    <AnimateItem key="folder">
                        <FolderNote />
                    </AnimateItem>
                )}
            </AnimatePresence>
            <AnimatePresence mode="popLayout" >
                {showSecure && (
                    <AnimateItem key="secure">
                        <SecureNote note={currentNote} />
                    </AnimateItem>
                )}
            </AnimatePresence>
            <AnimatePresence mode="popLayout" >
                {showSchedule && (
                    <AnimateItem key="scheduler">
                        <Scheduler />
                    </AnimateItem>
                )}
            </AnimatePresence>
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
            {
                !excludeSettings?.find((s) => s === "mode") && (
                    <>
                        <div className="h-[35px] w-[1px] bg-gray-500"></div>
                        <ModeWrite />
                    </>
                )
            }
            {!excludeSettings?.find((s) => s === "delete") && <DeleteNote note={currentNote} />}
        </div >
    );
}
