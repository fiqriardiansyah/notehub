"use client"

import { Todo } from "@/app/write/mode/todolist";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { easeDefault, progressCheer } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Timer } from "lucide-react";
import moment from "moment";
import React from "react";

export type ListCardHabitProps = {
    todo: Todo;
    progressDoneCheer?: { progress: number; todoId: string };
    onCheck: (todo: Todo) => void;
    completedHabit?: boolean;
}

export default function ListCardHabit({ todo, onCheck, progressDoneCheer, completedHabit }: ListCardHabitProps) {
    return <div className="flex p-2 rounded-2xl flex-col border border-solid border-gray-200 relative overflow-hidden">
        {!completedHabit && (
            <AnimatePresence mode="wait">
                {progressCheer.map((pc) => {
                    if (pc.donepoint === progressDoneCheer?.progress && progressDoneCheer.todoId === todo.id) {
                        return (
                            <motion.div
                                key={pc.donepoint}
                                initial={{ y: '100%' }}
                                animate={{ y: 0 }}
                                exit={{ y: '100%' }}
                                transition={{ ease: easeDefault }}
                                style={{ background: pc.bgColor }}
                                className="z-20 absolute top-0 left-0 w-full h-full text-xl font-medium text-white flex items-center justify-center p-2">
                                {pc.content}
                            </motion.div>
                        )
                    }
                    return null
                })}
            </AnimatePresence>
        )}
        <div className="flex items-center justify-between">
            {!completedHabit && (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button size="icon-small" variant="secondary">
                            <Timer size={16} />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        Timer
                    </TooltipContent>
                </Tooltip>
            )}
            {!completedHabit ? (
                <Button onClick={() => onCheck(todo)} size="icon-small" variant={todo?.isCheck ? "default" : "ghost"}>
                    <Check size={16} />
                </Button>
            ) : <>
                {todo?.isCheck ? <Check size={16} /> : null}
            </>}
        </div>
        <p className="m-0 capitalize font-medium mt-3">{todo.content}</p>
        {todo.checkedAt && <span className="m-0 text-xs leading-[10px] text-gray-400">Done at {moment(todo.checkedAt).format("DD MMM, HH:mm")}</span>}
    </div>
}