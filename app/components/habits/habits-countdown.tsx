"use client";

import { remainingTimeInDays, remainingTimeInHour } from "@/lib/utils";
import { Note } from "@/models/note";
import moment from "moment";
import React from "react";

export type HabitsCountdownProps = {
    noteHabits?: Note
}

export default function HabitsCountdown({ noteHabits }: HabitsCountdownProps) {
    const refCount = React.useRef<HTMLParagraphElement>(null);

    React.useEffect(() => {
        const interval = setInterval(() => {
            if (!refCount.current) return;
            refCount.current!.classList.remove("text-red-400");
            refCount.current!.classList.remove("text-green-400");
            if (noteHabits?.schedulerType === "day") {
                const start = noteHabits?.schedulerStartTime ? moment(noteHabits?.schedulerStartTime) : moment(moment().startOf("day"));
                const end = noteHabits?.schedulerEndTime ? moment(noteHabits?.schedulerEndTime) : moment(moment().endOf("day"));
                const countdown = remainingTimeInHour({ start, end });

                if (!noteHabits?.schedulerStartTime) {
                    refCount.current!.innerText = `Have to finish in ${countdown.string}`;
                    return;
                }

                const isStartCount = moment(moment.now(), "HH:mm:ss").isSameOrAfter(countdown.string);

                if (noteHabits.schedulerStartTime && isStartCount) {
                    refCount.current!.innerText = `Have to finish in ${countdown.string}`;
                    return;
                }

                if (noteHabits.schedulerStartTime && !isStartCount) {
                    refCount.current!.classList.add("text-green-400");

                    const startInCount = remainingTimeInHour({ start: moment(), end: moment(noteHabits.schedulerStartTime) })

                    refCount.current!.innerText = `Relax, Will start in ${startInCount.string}`;
                    return;
                }

                if (countdown.isTimesUp) {
                    refCount.current!.innerText = "Times up! ";
                    refCount.current!.classList.add("text-red-400");
                    return;
                }
            }

            if (noteHabits?.schedulerType === "weekly" || noteHabits?.schedulerType === "monthly") {
                const countdown = remainingTimeInDays(noteHabits?.schedulerType === "weekly" ? "week" : "month");

                if (countdown.isTimesUp) {
                    refCount.current!.innerText = "Times up! ";
                    refCount.current!.classList.add("text-red-400");
                    return;
                }
                refCount.current!.classList.remove("text-red-400");
                refCount.current!.innerText = `Have to finish in ${countdown.string}`;
            }

        }, 1000);
        return () => clearInterval(interval);
    }, [noteHabits]);

    return <p ref={refCount} className="text-xs font-semibold"></p>
}