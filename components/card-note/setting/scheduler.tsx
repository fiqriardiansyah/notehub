"use client";

import { CLOSE_SIDE_PANEL } from '@/components/layout/side-panel';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Toggle } from '@/components/ui/toggle';
import { CommonContext, CommonContextType } from '@/context/common';
import { WriteContext, WriteContextType } from '@/context/write';
import { fireBridgeEvent } from '@/hooks/use-bridge-event';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import moment, { Moment } from 'moment';
import dynamic from "next/dynamic";
import 'rc-time-picker/assets/index.css';
import React from 'react';

const TimePicker = dynamic(() => import("rc-time-picker").then((mod) => mod.default),
    { ssr: false }
)

export const SCHEDULER = "scheduler";

const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const reschedules = [
    { value: "day", label: "Reschedule in a Day" },
    { value: "weekly", label: "Reschedule Weekly" },
    { value: "monthly", label: "Reshcedule Monthly" }
]

export default function Scheduler() {
    const { common } = React.useContext(CommonContext) as CommonContextType;
    const { setDataNote, dataNote } = React.useContext(WriteContext) as WriteContextType

    const [pickedReschedule, setPickedReschedule] = React.useState<string>();
    const [pickedDay, setPickedDay] = React.useState<string[]>([]);
    const [pickedTime, setPickedTime] = React.useState({
        start: "",
        end: ""
    });

    const isEveryDay = pickedDay.length === days.length;

    const onCheckEveryDay = (e: boolean) => {
        setPickedDay(isEveryDay ? [] : days);
    }

    const onPressDay = (day: string) => {
        return () => {
            setPickedDay((prev) => {
                if (prev.find((i) => i === day)) {
                    return prev.filter((i) => i !== day);
                };
                return [...prev, day];
            });
        }
    }

    const onRescheduleChange = (val: string) => {
        setPickedReschedule(val);
    }

    const onTimeChange = (type: string) => {
        return (val: Moment) => {
            console.log(val);
            setPickedTime((prev) => ({
                ...prev,
                [type]: val ? moment(val) : null
            }))
        }
    }

    const onSubmit = () => {
        setDataNote((prev) => ({
            ...prev,
            scheduler: {
                type: pickedReschedule as any,
                days: pickedReschedule === "day" ? pickedDay : [],
                startTime: pickedReschedule === "day" ? pickedTime.start ? moment(pickedTime.start).format() : undefined : undefined,
                endTime: pickedReschedule === "day" ? pickedTime.end ? moment(pickedTime.end).format() : undefined : undefined,
            }
        }));
        fireBridgeEvent(CLOSE_SIDE_PANEL, null);
    };

    const onDeleteSchedule = () => {
        setDataNote((prev) => ({
            ...prev,
            scheduler: undefined
        }))
    }

    const disabledSubmit = !pickedReschedule || (pickedReschedule === "day" && !pickedDay.length);

    const hasSchedule = !!dataNote?.scheduler?.type

    if (common?.groundOpen !== SCHEDULER) return null;
    return (
        <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, transition: { delay: .3 } }}
            className="w-full h-full flex flex-col gap-6">
            <h1 className="font-semibold text-xl capitalize mb-5">Schedule your habits 🔥</h1>
            {hasSchedule ? (
                <div className="border rounded-lg flex flex-col gap-2 flex-wrap border-solid border-gray-400 w-full p-2">
                    <div className="flex w-full items-center justify-between">
                        <p className='text-sm'>Reschedule habits in </p>
                        <button onClick={onDeleteSchedule} className='bg-transparent border-none text-gray-500'>
                            <X size={16} />
                        </button>
                    </div>
                    {dataNote.scheduler?.type === "day" && (
                        <p className='capitalize font-semibold text-sm'>{dataNote.scheduler?.days?.join(", ")}</p>
                    )}
                    {dataNote.scheduler?.type === "weekly" && (
                        <p className='capitalize font-semibold text-sm'>Every Week</p>
                    )}
                    {dataNote.scheduler?.type === "monthly" && (
                        <p className='capitalize font-semibold text-sm'>Every Month</p>
                    )}
                    {dataNote.scheduler?.startTime &&
                        <p className='m-0 text-sm'>Start at <span className='m-0 capitalize font-semibold text-sm'>{moment(dataNote.scheduler?.startTime).format("HH:MM")}</span></p>
                    }
                    {dataNote.scheduler?.endTime &&
                        <p className='m-0 text-sm'>End at <span className='m-0 capitalize font-semibold text-sm'>{moment(dataNote.scheduler?.endTime).format("HH:MM")}</span></p>
                    }
                </div>
            ) : (
                <>
                    <Select value={pickedReschedule} onValueChange={onRescheduleChange}>
                        <SelectTrigger>
                            <SelectValue placeholder="Reschedule in" />
                        </SelectTrigger>
                        <SelectContent>
                            {reschedules.map((r) => (
                                <SelectItem key={r.value} value={r.value}>
                                    {r.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {pickedReschedule === "day" && (
                        <>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="everyday" className='text-sm font-semibold flex items-center'>
                                    <Checkbox checked={isEveryDay} onCheckedChange={onCheckEveryDay} id="everyday" className="mr-2" />
                                    Every Day
                                </label>
                                <div className="flex flex-wrap gap-2 w-full">
                                    {days.map((day) => (
                                        <Toggle onPressedChange={onPressDay(day)} pressed={!!pickedDay.find((i) => i === day)} key={day} size="sm" variant="default" aria-label="Toggle" className="capitalize">
                                            {day}
                                        </Toggle>
                                    ))}
                                </div>
                            </div>
                            <label htmlFor="timestart" className='flex flex-col gap-1 text-sm font-semibold'>
                                Time start schedule
                                <TimePicker
                                    value={moment(pickedTime.start).format() === "Invalid date" ? undefined : moment(pickedTime.start)}
                                    onChange={onTimeChange("start")} showSecond={false} id='timestart' placeholder="Time start" />
                            </label>
                            <label htmlFor="timeend" className='flex flex-col gap-1 text-sm font-semibold'>
                                Time end schedule
                                <TimePicker
                                    value={moment(pickedTime.end).format() === "Invalid date" ? undefined : moment(pickedTime.end)}
                                    onChange={onTimeChange("end")} showSecond={false} id='timeend' placeholder="Time end" />
                            </label>
                        </>
                    )}
                    <div className="flex-1 h-full"></div>
                    <Button onClick={onSubmit} disabled={disabledSubmit}>
                        Scheduled
                    </Button></>
            )}
        </motion.div>
    )
}
