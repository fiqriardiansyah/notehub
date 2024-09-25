"use client";

import habitsService from "@/service/habits";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import RunningTimerCard from "./card";
import { useTimer } from "@/context/timer";
import { RunningTimer as RunningTimerType } from "@/models/habits";

export type RunningTimerProps = {

}

export default function RunningTimer({ }: RunningTimerProps) {
    const timerContext = useTimer();

    const runningTimerQuery = useQuery([habitsService.getRunningTimer.name], async () => {
        return (await habitsService.getRunningTimer()).data.data;
    });

    const onClickZenMode = (timer: RunningTimerType) => {
        return () => {
            const todo = { id: timer.itemId, content: timer.itemTitle, timer: { startTime: timer.startTime, endTime: timer.endTime } };
            timerContext.open(todo);
        }
    }

    if (!runningTimerQuery.isLoading && runningTimerQuery.data?.length) {
        return <div className="flex flex-col gap-4">
            <p className="font">Running Timer ⏱️</p>
            <div className="flex flex-col gap-2">
                {runningTimerQuery.data?.map((item) => {
                    if (item.isZenMode) {
                        return (
                            <button key={item.id} onClick={onClickZenMode(item)} className="text-start">
                                <RunningTimerCard item={item} />
                            </button>
                        )
                    }
                    return (
                        <Link href={`/habits/${item.noteId}`} key={item.id}>
                            <RunningTimerCard item={item} />
                        </Link>
                    )
                })}
            </div>
        </div>
    }

    return null;
}