"use client";

import { Note } from "@/models/note";
import { icons } from "lucide-react";
import moment from "moment";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import cupAnimation from '@/asset/animation/cup.json';
import fireAnimation from "@/asset/animation/fire.json";
import Lottie from "react-lottie";
import themeColor from "tailwindcss/colors";
import Link from "next/link";
import ResponsiveTagsListed from "@/components/common/tag-listed";

const defaultOptions = {
    loop: true,
    animationData: cupAnimation,
    autoplay: true,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

type GridCardHabitProps = {
    habits: Note;
    onGoingHabits?: string
}

export default function GridCardHabit({ habits, onGoingHabits }: GridCardHabitProps) {

    const taskDone = habits.todos?.filter((td) => td.isCheck).length
    const progress = Math.round(taskDone! / habits.todos!.length * 100);

    const isFreeToday = habits?.schedulerType === "day"
        && !habits?.schedulerDays?.includes(moment().format("dddd").toLocaleLowerCase());

    return (
        <Link href={`/habits/${habits.id}`} className="h-full">
            <div className="bg-white rounded-xl border justify-between h-full border-gray-400 border-solid p-2 flex flex-col text-sm">
                <div className="w-full flex flex-col justify-start text-start">
                    <p className="m-0 line-clamp-1 font-semibold mb-1 capitalize">{habits.title}</p>
                    {habits?.schedulerStartTime && (
                        <span className="m-0 capitalize  text-xs">
                            Start at {moment(habits?.schedulerStartTime).format("HH:mm:ss")}
                            {habits?.schedulerEndTime && ` - ${moment(habits?.schedulerEndTime).format("HH:mm:ss")}`}
                        </span>
                    )}
                </div>
                <div className="w-full flex items-center justify-between mt-2 gap-3">
                    <div className="flex flex-1 items-center gap-2 line-clamp-1">
                        <div className="capitalize font-semibold text-[10px] w-6 h-6 rounded-full border border-solid border-gray-400 text-gray-400 flex items-center justify-center">
                            {habits!.schedulerType![0]}
                        </div>
                        <ResponsiveTagsListed tags={habits?.tags} size={14} />
                    </div>
                    <div className="flex items-center gap-3">
                        {!habits?.reschedule && (
                            <Lottie style={{ pointerEvents: 'none' }} options={defaultOptions} height={40} width={40} />
                        )}

                        {habits?.reschedule && !isFreeToday &&
                            <div className="w-[40px] h-[40px] rounded-full relative">
                                {onGoingHabits === habits.id && <div className="absolute top-[-40px] left-1/2 transform -translate-x-1/2 z-10">
                                    <Lottie style={{ pointerEvents: 'none' }} options={{ ...defaultOptions, animationData: fireAnimation }} height={40} width={40} />
                                </div>}
                                <CircularProgressbar
                                    value={progress}
                                    text={`${progress}%`}
                                    styles={buildStyles({
                                        trailColor: onGoingHabits === habits.id ? themeColor.orange[100] : themeColor.green[100],
                                        pathColor: onGoingHabits === habits.id ? themeColor.orange[400] : themeColor.green[400],
                                        textColor: onGoingHabits === habits.id ? themeColor.orange[400] : themeColor.gray[400],
                                        textSize: 24
                                    })} />
                            </div>}
                    </div>
                </div>
            </div></Link>
    )
}