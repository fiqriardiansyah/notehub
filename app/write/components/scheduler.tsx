"use client";

import { SCHEDULER } from "@/components/card-note/setting/scheduler";
import { OPEN_SIDE_PANEL } from "@/components/layout/side-panel";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { WriteContext, WriteContextType } from "@/context/write";
import { fireBridgeEvent } from "@/hooks/use-bridge-event";
import { CalendarRange } from "lucide-react";
import React from "react";

export default function Scheduler() {
    const { dataNote } = React.useContext(WriteContext) as WriteContextType;

    const onClick = () => {
        fireBridgeEvent(OPEN_SIDE_PANEL, {
            groundOpen: SCHEDULER,
        })
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
