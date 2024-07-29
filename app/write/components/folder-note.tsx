"use client";

import { FOLDER_NOTE_GROUND } from "@/app/components/setting-note-ground/folder-note";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import useSidePage from "@/hooks/use-side-page";
import { FolderPlus } from "lucide-react";

export default function FolderNote() {
    const [setSidePage] = useSidePage();

    const onClickLock = () => {
        setSidePage(FOLDER_NOTE_GROUND);
    };

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    //   loading={checkHasPassNote.isLoading}
                    onClick={onClickLock}
                    size="icon"
                    //   variant={dataNote?.isSecure ? "default" : "ghost"}
                    variant="ghost"
                >
                    <FolderPlus />
                </Button>
            </TooltipTrigger>
            <TooltipContent>Add to folder</TooltipContent>
        </Tooltip>
    );
}
