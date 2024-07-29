"use client"

import { TAG_NOTE_GROUND } from "@/app/components/setting-note-ground/tag-note";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import useSidePage from "@/hooks/use-side-page";
import { Tag } from "lucide-react"

export default function TagNote() {
    const [setSidePage] = useSidePage();

    const onClickLock = () => {
        setSidePage(TAG_NOTE_GROUND);
    };

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    onClick={onClickLock}
                    size="icon"
                    variant="ghost"
                >
                    <Tag />
                </Button>
            </TooltipTrigger>
            <TooltipContent>Add tags</TooltipContent>
        </Tooltip>
    );
}