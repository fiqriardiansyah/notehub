"use client"

import { TAG_NOTE_GROUND } from "@/components/card-note/setting/tag-note";
import { OPEN_SIDE_PANEL } from "@/components/layout/side-panel";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { WriteContext, WriteContextType } from "@/context/write";
import { fireBridgeEvent } from "@/hooks/use-bridge-event";
import { Tag } from "lucide-react";
import React from "react";

export default function TagNote() {
    const { dataNote } = React.useContext(WriteContext) as WriteContextType;

    const onClickLock = () => {
        fireBridgeEvent(OPEN_SIDE_PANEL, {
            groundOpen: TAG_NOTE_GROUND
        });
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