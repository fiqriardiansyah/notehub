"use client";

import { COLLABS_NOTE_GROUND } from "@/app/components/setting-note-ground/collabs";
import CollabsList from "@/components/common/collabs-list";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import useSidePage from "@/hooks/use-side-page";
import { Note } from "@/models/note";
import { Blocks } from "lucide-react";

type CollabNoteProps = {
    note?: Note;
}

export default function CollabNote({ note }: CollabNoteProps) {
    const [setSidePage] = useSidePage();

    const onClickLock = () => {
        setSidePage(COLLABS_NOTE_GROUND, note);
    };

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    onClick={onClickLock}
                    size="icon"
                    variant="ghost"
                    className="relative"
                >
                    <CollabsList noteId={note?.id} >
                        {(list) => <div className="m-0 flex items-center justify-center absolute top-0 right-0 w-4 h-4 rounded-full bg-yellow-300 pointer-events-none text-xs">
                            {list?.length}
                        </div>}
                    </CollabsList>
                    <Blocks />
                </Button>
            </TooltipTrigger>
            <TooltipContent>Collabs</TooltipContent>
        </Tooltip>
    );
}
