"use client"

import HabitsTimer from "@/components/habits/habits-timer";
import HabitsTodoDrawerMenu from "@/components/habits/habits-todo-drawer-menu";
import { Todo } from "@/app/write/mode/todolist";
import Countdown from "@/components/common/countdown";
import { Button } from "@/components/ui/button";
import useSidePage from "@/hooks/use-side-page";
import { easeDefault, hexToRgba, progressCheer } from "@/lib/utils";
import { Note } from "@/models/note";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Ellipsis, Paperclip, Timer } from "lucide-react";
import moment from "moment";
import React from "react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import themeColor from "tailwindcss/colors";
import { VIEW_ATTACH_NOTE } from "./view-attach-note";

export type ListCardHabitProps = {
    todo: Todo;
    noteId?: string;
    progressDoneCheer?: { progress: number; todoId: string };
    onCheck?: (todo: Todo) => void;
    completedHabit?: boolean;
    setTodos?: React.Dispatch<React.SetStateAction<Todo[]>>;
    onClickAttach?: () => void;
}

export default function ListCardHabit({ todo, onCheck, progressDoneCheer, completedHabit, setTodos, noteId, onClickAttach }: ListCardHabitProps) {
    const [setSidePage, resetSidePage] = useSidePage();

    const onClickCheck = (todo: Todo) => {
        return () => {
            if (completedHabit) return;
            if (onCheck) onCheck(todo);
        }
    }

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

    const onAddAttachNote = (notes: Note[], todo: Todo) => {
        if (setTodos) {
            setTodos((prev) => {
                return prev.map((td) => {
                    if (td.id !== todo.id) return td;
                    return {
                        ...td,
                        attach: notes.map((n) => ({ id: n.id, title: n.title })),
                    }
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

    const onClickAttachNote = (attach: Pick<Note, "id" | "title">) => {
        return () => {
            if (onClickAttach) {
                onClickAttach()
            }
            setSidePage(VIEW_ATTACH_NOTE, attach);
        }
    }

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
                                className="z-20 absolute top-0 left-0 text-center w-full h-full text-xl font-medium text-white flex items-center justify-center p-2">
                                {pc.content}
                            </motion.div>
                        )
                    }
                    return null
                })}
            </AnimatePresence>
        )}
        <div className="flex items-center justify-between">
            {!completedHabit ? (
                <Button onClick={onClickCheck(todo)} size="icon-small" variant={todo?.isCheck ? "default" : "ghost"} className="mb-3">
                    <Check size={16} />
                </Button>
            ) : <>
                {todo?.isCheck ? <Check size={16} className="mb-3" /> : null}
            </>}
            {!completedHabit && (
                <HabitsTimer anyId={noteId} setTimer={onSetTimer} todo={todo}>
                    {(timerControl) => (
                        <HabitsTodoDrawerMenu onClickTimer={timerControl.open} todo={todo} onAttachNote={onAddAttachNote}>
                            {(drawerControl) => (
                                <div className="flex items-center gap-2">
                                    {todo?.timer && !todo?.timer?.isEnd && (
                                        <Countdown
                                            onCompleteRender={timerControl.isOpen ? () => { } : () => onCompleteTimer(todo)}
                                            endTime={todo?.timer?.endTime}
                                            startTime={todo?.timer?.startTime}>
                                            {({ text, progress }) => (
                                                <button onClick={todo?.isCheck ? () => { } : timerControl.open} className="w-[30px] h-[30px] rounded-full relative">
                                                    <CircularProgressbar text="" value={progress} styles={buildStyles({
                                                        textColor: hexToRgba("#000000", 0.7),
                                                        backgroundColor: "#00000000",
                                                        pathColor: themeColor.gray[500],
                                                    })} />
                                                    <Timer size={12} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                                                </button>
                                            )}
                                        </Countdown>
                                    )}
                                    <Button onClick={drawerControl.open} size="icon-small" variant="ghost" className="mb-3">
                                        <Ellipsis size={16} />
                                    </Button>
                                </div>
                            )}
                        </HabitsTodoDrawerMenu>
                    )}
                </HabitsTimer>
            )}
        </div>
        <p onClick={onClickCheck(todo)} style={{ cursor: completedHabit ? "" : "pointer" }} className="m-0 capitalize font-medium">{todo.content}</p>
        {todo.checkedAt && <span onClick={onClickCheck(todo)} style={{ cursor: completedHabit ? "" : "pointer" }} className="m-0 text-xs leading-[10px] text-gray-400">Done at {moment(todo.checkedAt).format("DD MMM, HH:mm")}</span>}
        <div className="mt-1 flex flex-col gap-1">
            {todo?.attach?.map((attach) =>
                <a onClick={onClickAttachNote(attach)} key={attach.id} className="underline cursor-pointer line-clamp-1 text-[12px] font-medium flex items-center">
                    <Paperclip size={12} className="mr-1" />
                    {attach?.title}</a>)}
        </div>
    </div>
}