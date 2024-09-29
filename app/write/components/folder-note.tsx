"use client";

import { FOLDER_NOTE_GROUND } from "@/app/components/card-note/setting/folder-note";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { WriteContext, WriteContextType } from "@/context/write";
import useSidePage from "@/hooks/use-side-page";
import { FolderCheck, FolderPlus } from "lucide-react";
import React from "react";

export default function FolderNote() {
    const { dataNote } = React.useContext(WriteContext) as WriteContextType;

    const [setSidePage] = useSidePage();

    const onClickLock = () => {
        setSidePage(FOLDER_NOTE_GROUND);
    };

    const isInFolder = (dataNote?.folder?.id || dataNote?.folder?.name)

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    onClick={onClickLock}
                    size="icon"
                    variant={isInFolder ? "default" : "ghost"}
                >
                    {isInFolder ? <FolderCheck /> : <FolderPlus />}
                </Button>
            </TooltipTrigger>
            <TooltipContent>Add to folder</TooltipContent>
        </Tooltip>
    );
}
