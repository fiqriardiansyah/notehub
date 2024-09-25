"use client";

import { Button } from "@/components/ui/button";
import { useTimer } from "@/context/timer";
import { Note } from "@/models/note";

export type CardContinueZenModeProps = {
    note?: Partial<Note>;
}

export default function CardContinueZenMode({ note }: CardContinueZenModeProps) {
    const timerContext = useTimer();

    const currentTodo = note?.todos?.find((t) => t.id === timerContext?.timer?.todo?.id);

    if (timerContext?.timer?.peakZenMode && timerContext?.timer?.todo && currentTodo) {
        return (
            <Button onClick={() => timerContext.open()} className="my-5" variant="default">
                Continue Zen Mode at {timerContext?.timer?.todo?.content}
            </Button>
        )
    }

    return null;

}