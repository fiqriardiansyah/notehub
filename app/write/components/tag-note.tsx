"use client"

import { TAG_NOTE_GROUND } from "@/app/components/card-note/setting/tag-note";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { WriteContext, WriteContextType } from "@/context/write";
import useSidePage from "@/hooks/use-side-page";
import { Tag } from "lucide-react"
import React from "react";

export default function TagNote() {
    const { dataNote } = React.useContext(WriteContext) as WriteContextType;

    const [setSidePage] = useSidePage();

    const onClickLock = () => {
        setSidePage(TAG_NOTE_GROUND);
    };

    const isUseTag = dataNote?.tags?.length;

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    onClick={onClickLock}
                    size="icon"
                    variant={isUseTag ? "default" : "ghost"}
                >
                    <Tag />
                </Button>
            </TooltipTrigger>
            <TooltipContent>Add tags</TooltipContent>
        </Tooltip>
    );
}