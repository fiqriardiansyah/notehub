"use client"

import HabitsTimer from "@/app/components/habits/habits-timer";
import { Todo } from "@/app/write/mode/todolist";
import Countdown from "@/components/common/countdown";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { easeDefault, hexToRgba, progressCheer } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Timer } from "lucide-react";
import moment from "moment";
import React from "react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import themeColor from "tailwindcss/colors";

export type ListCardHabitProps = {
    todo: Todo;
    noteId?: string;
    progressDoneCheer?: { progress: number; todoId: string };
    onCheck?: (todo: Todo) => void;
    completedHabit?: boolean;
    setTodos?: React.Dispatch<React.SetStateAction<Todo[]>>;
}

export default function ListCardHabit({ todo, onCheck, progressDoneCheer, completedHabit, setTodos, noteId }: ListCardHabitProps) {

    const onSetTimer = (todo: Todo) => {
        if (setTodos) {
            setTodos((prev) => {
                return prev.map((td) => {
                    if (td.id !== todo.id) return td;
                    return todo;
                })
            })
        }
    }

    const onCompleteTimer = (todo: Todo) => {
        if (todo?.timer?.autoComplete) {
            onSetTimer({
                ...todo,
                isCheck: true,
                checkedAt: todo?.checkedAt || new Date(todo?.timer?.endTime || Date.now()).getTime(),
                timer: {
                    ...todo?.timer,
                    isEnd: true,
                },
            } as Todo);
            return;
        }
        onSetTimer({ ...todo, timer: null });
    };

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
                <HabitsTimer anyId={noteId} setTimer={onSetTimer} todo={todo}>
                    {(ctrl) => {
                        if (todo?.timer && !todo?.timer?.isEnd) {
                            return (
                                <Countdown
                                    onCompleteRender={ctrl.isOpen ? () => { } : () => onCompleteTimer(todo)}
                                    endTime={todo?.timer?.endTime}
                                    startTime={todo?.timer?.startTime}>
                                    {({ text, progress }) => (
                                        <div className="flex items-center gap-2">
                                            <button onClick={todo?.isCheck ? () => { } : ctrl.open} className="w-9 h-9 rounded-full relative">
                                                <CircularProgressbar text="" value={progress} styles={buildStyles({
                                                    textColor: hexToRgba("#000000", 0.7),
                                                    backgroundColor: "#00000000",
                                                    pathColor: themeColor.gray[500],
                                                })} />
                                                <Timer size={16} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                                            </button>
                                            <span className="text-[10px] font-medium">{text}</span>
                                        </div>
                                    )}
                                </Countdown>
                            )
                        }
                        return (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button onClick={todo?.isCheck ? () => { } : ctrl.open} disabled={!!todo?.isCheck} size="icon-small" variant="secondary" className="mb-3">
                                        <Timer size={16} />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    Timer
                                </TooltipContent>
                            </Tooltip>
                        )
                    }}
                </HabitsTimer>
            )}
            {!completedHabit ? (
                <Button onClick={() => onCheck && onCheck(todo)} size="icon-small" variant={todo?.isCheck ? "default" : "ghost"} className="mb-3">
                    <Check size={16} />
                </Button>
            ) : <>
                {todo?.isCheck ? <Check size={16} className="mb-3" /> : null}
            </>}
        </div>
        <p className="m-0 capitalize font-medium">{todo.content}</p>
        {todo.checkedAt && <span className="m-0 text-xs leading-[10px] text-gray-400">Done at {moment(todo.checkedAt).format("DD MMM, HH:mm")}</span>}
    </div>
}