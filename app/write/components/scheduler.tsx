"use client";

import { FOLDER_NOTE_GROUND } from "@/app/components/setting-note-ground/folder-note";
import { SCHEDULER } from "@/app/components/setting-note-ground/scheduler";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { WriteContext, WriteContextType } from "@/context/write";
import useSidePage from "@/hooks/use-side-page";
import { CalendarRange } from "lucide-react";
import React from "react";

export default function Scheduler() {
    const { dataNote } = React.useContext(WriteContext) as WriteContextType;

    const [setSidePage] = useSidePage();

    const onClick = () => {
        setSidePage(SCHEDULER);
    };

    const hasSchedule = !!dataNote?.scheduler?.type

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    onClick={onClick}
                    size="icon"
                    variant={hasSchedule ? "default" : "ghost"}
                >
                    <CalendarRange />
                </Button>
            </TooltipTrigger>
            <TooltipContent>Schedule</TooltipContent>
        </Tooltip>
    );
}
