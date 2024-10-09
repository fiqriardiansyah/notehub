"use client";

import { COLLABS_NOTE_GROUND } from "@/components/card-note/setting/collabs";
import CollabsList from "@/components/common/collabs-list";
import { OPEN_SIDE_PANEL } from "@/components/layout/side-panel";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { fireBridgeEvent } from "@/hooks/use-bridge-event";
import { Note } from "@/models/note";
import { Blocks } from "lucide-react";

type CollabNoteProps = {
    note?: Note;
}

export default function CollabNote({ note }: CollabNoteProps) {

    const onClick = () => {
        fireBridgeEvent(OPEN_SIDE_PANEL, {
            groundOpen: COLLABS_NOTE_GROUND,
            payload: note,
        })
    };

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    onClick={onClick}
                    size="icon"
                    variant="ghost"
                    className="relative"
                >
                    <CollabsList noteId={note?.id} >
                        {(list) => {
                            if (!list?.length) return null;
                            return <div className="m-0 flex items-center justify-center absolute top-0 right-0 w-4 h-4 rounded-full bg-yellow-300 pointer-events-none text-xs">
                                {list?.length}
                            </div>
                        }}
                    </CollabsList>
                    <Blocks />
                </Button>
            </TooltipTrigger>
            <TooltipContent>Collabs</TooltipContent>
        </Tooltip>
    );
}
