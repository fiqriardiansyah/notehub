"use client";

import habitsService from "@/service/habits";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import RunningTimerCard from "./card";

export type RunningTimerProps = {

}

export default function RunningTimer({ }: RunningTimerProps) {
    const runningTimerQuery = useQuery([habitsService.getRunningTimer.name], async () => {
        return (await habitsService.getRunningTimer()).data.data;
    });

    if (!runningTimerQuery.isLoading && runningTimerQuery.data?.length) {
        return <div className="flex flex-col gap-4">
            <p className="font">Running Timer ⏱️</p>
            <div className="flex flex-col gap-2">
                {runningTimerQuery.data?.map((item) => (
                    <Link href={`/habits/${item.noteId}`} key={item.id}>
                        <RunningTimerCard item={item} />
                    </Link>
                ))}
            </div>
        </div>
    }

    return null;
}