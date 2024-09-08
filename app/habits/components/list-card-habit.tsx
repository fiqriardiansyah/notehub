"use client";

import { convertEditorDataToText } from "@/lib/utils";
import { Note } from "@/models/note";
import parse from "html-react-parser";
import { ChevronRight, icons } from "lucide-react";
import Link from "next/link";
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export type ListCardHabitProps = {
    habit: Note;
    index: number;
}

export default function ListCardHabit({ habit, index }: ListCardHabitProps) {

    const taskDone = habit.todos?.filter((td) => td.isCheck).length
    const progress = Math.round(taskDone! / habit.todos!.length * 100);

    return (
        <Link href={`/habits/${habit.id}`}>
            {index === 0 && <p className="text-xs mb-1">On Going 🔥</p>}
            <div className={`flex justify-between items-center p-2 gap-3 w-full rounded-xl border-2 border-dashed bg-white 
                ${index === 0 ? "!border-solid border-orange-400" : "border-gray-300"}`}>
                <div className="flex items-center gap-3">
                    <div className="w-[50px] h-[50px] rounded-full ">
                        <CircularProgressbar
                            value={progress}
                            text={`${progress}%`}
                            styles={buildStyles({
                                trailColor: index === 0 ? 'rgba(251, 146, 60, 0.5)' : `rgba(89, 89, 89, 0.2)`,
                                textSize: '22px',
                                textColor: index === 0 ? `rgba(251, 146, 60, 1)` : `rgba(89, 89, 89, 1)`,
                                pathColor: index === 0 ? `rgba(251, 146, 60, 1)` : `rgba(89, 89, 89, ${progress / 100})`
                            })} />
                    </div>
                    <div className="flex flex-col gap-1">
                        <div className="m-0 leading-none font-medium capitalize line-clamp-1 flex">
                            {habit.title}
                            {!!habit?.tags?.length && (
                                <div className="flex items-center gap-2 line-clamp-1 ml-2">
                                    {habit?.tags?.map((tag) => {
                                        const Icon = icons[tag.icon as keyof typeof icons];
                                        return <Icon size={13} key={tag.id} className="text-gray-700" />
                                    })}
                                </div>
                            )}
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