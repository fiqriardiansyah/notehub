"use client";

import ResponsiveTagsListed from "@/components/common/tag-listed";
import { convertEditorDataToText, hexToRgba } from "@/lib/utils";
import { Note } from "@/models/note";
import parse from "html-react-parser";
import { ChevronRight, icons } from "lucide-react";
import Link from "next/link";
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import themeColor from "tailwindcss/colors";

export type ListCardHabitProps = {
    habit: Note;
    index: number;
}

export default function ListCardHabit({ habit, index }: ListCardHabitProps) {

    const taskDone = habit.todos?.filter((td) => td.isCheck).length
    const progress = Math.round(taskDone! / habit.todos!.length * 100);

    return (
        <Link href={`/habits/${habit.id}`} className="relative">
            {index === 0 && <p className="text-xs bg-white px-1 absolute -top-2 left-2">On Going 🔥</p>}
            <div className={`flex justify-between items-center p-2 gap-3 w-full rounded-xl border-2 border-dashed bg-white 
                ${index === 0 ? "!border-solid border-orange-400" : "border-gray-300"}`}>
                <div className="flex items-center gap-3 flex-1">
                    <div className="w-[50px] h-[50px] rounded-full ">
                        <CircularProgressbar
                            value={progress}
                            text={`${progress}%`}
                            styles={buildStyles({
                                trailColor: index === 0 ? themeColor.orange[100] : themeColor.gray[100],
                                textSize: '22px',
                                textColor: index === 0 ? themeColor.orange[400] : themeColor.gray[400],
                                pathColor: index === 0 ? themeColor.orange[400] : hexToRgba(themeColor.gray[400], progress / 100),
                            })} />
                    </div>
                    <div className="flex flex-col gap-1 flex-1">
                        <div className="m-0 leading-none font-medium capitalize line-clamp-1 flex flex-1 w-full">
                            {habit.title}
                            <ResponsiveTagsListed tags={habit?.tags} size={14} />
                        </div>
                        <span className="m-0 leading-[13px] text-xs line-clamp-2">
                            {habit.schedulerType} | {parse(convertEditorDataToText(habit?.description))}
                        </span>
                    </div>
                </div>
                <ChevronRight strokeWidth={1} />
            </div>
        </Link>
    )
}