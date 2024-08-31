"use client";

import { Todo } from "@/app/write/mode/todolist";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import useSkipFirstRender from "@/hooks/use-skip-first-render";
import { progressCheer } from "@/lib/utils";
import { Note } from "@/models/note";
import noteService from "@/service/note";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

export type TodolistCardNoteType = React.HTMLProps<HTMLDivElement> & {
    note: Partial<Note>;
    canInteract?: boolean;
    maxItemShow?: number;
};

export default function TodolistCardNote({ note, maxItemShow, canInteract = true, className, ...props }: TodolistCardNoteType) {
    const [todos, setTodos] = React.useState(() => note.todos);
    const prevProgressDoneCheer = React.useRef<number>()
    const [progressDoneCheer, setProgressDoneCheer] = React.useState<number>();

    const changeTodosMutate = useMutation(async (todos: Todo[]) => {
        return (await noteService.changeTodos({ noteId: note.id!, todos })).data.data;
    });

    useSkipFirstRender(() => {
        const update = setTimeout(() => {
            changeTodosMutate.mutate(todos || []);
        }, 1000);

        return () => clearTimeout(update);
    }, [todos]);

    useSkipFirstRender(() => {
        const update = setTimeout(() => {
            setProgressDoneCheer(undefined);
        }, 3000);

        return () => clearTimeout(update);
    }, [progressDoneCheer]);

    const progressCheerUpdate = (currentTodos: Todo[]) => {
        const progress = Math.round(currentTodos?.filter((t) => t.isCheck).length! / todos?.length! * 100);

        const messagePoint = Math.round(progress / (100 / progressCheer.length));
        if (messagePoint === prevProgressDoneCheer.current) return;
        setProgressDoneCheer(messagePoint);
        prevProgressDoneCheer.current = messagePoint === 100 ? undefined : messagePoint;
    }

    const onCheckChange = (todo: Todo) => {
        return (isCheck: boolean) => {
            const currentTodos = todos?.map((td) => {
                if (td.id !== todo.id) return td;
                return {
                    ...td,
                    isCheck,
                    checkedAt: isCheck ? new Date().getTime() : null,
                }
            });
            const isDoneIncrease = currentTodos?.filter((t) => t.isCheck).length! > todos?.filter((t) => t.isCheck).length!
            setTodos(currentTodos);
            if (isDoneIncrease) {
                progressCheerUpdate(currentTodos!);
            }
        }
    }

    const taskDone = todos?.filter((td) => td.isCheck).length
    const progress = Math.round(taskDone! / todos!.length * 100);

    return (
        <div className="relative">
            <div className={`text-sm flex flex-col gap-1 max-h-[120px] overflow-y-auto ${className}`} {...props}>
                {todos?.map((item, i) => {
                    if (maxItemShow !== undefined && i >= maxItemShow) return null;
                    return (
                        <label key={item.id} htmlFor={item.id} className="flex items-start gap-3">
                            <Checkbox disabled={!canInteract} onCheckedChange={onCheckChange(item)} checked={item.isCheck} id={item.id} />
                            <span className={`text-sm cursor-pointer line-clamp-1 ${item.isCheck ? "line-through" : ""}`}>{item.content}</span>
                        </label>
                    )
                })}
            </div>
            {canInteract && (
                <>
                    <Progress className="h-[5px] mt-3" value={progress} />
                    <div className="w-full flex items-start justify-between">
                        <div className="overflow-y-hidden h-[20px] flex-1 relative">
                            <AnimatePresence mode="wait" >
                                {progressCheer.map((pc) => {
                                    if (pc.donepoint === progressDoneCheer) {
                                        return (
                                            <motion.p
                                                key={pc.donepoint}
                                                initial={{ y: '30px' }}
                                                animate={{ y: 0 }}
                                                exit={{ y: '30px' }}
                                                className={`text-xs font-medium ${pc.color}`}>
                                                {pc.content}
                                            </motion.p>
                                        )
                                    }
                                    return null;
                                })}
                            </AnimatePresence>
                        </div>
                        <p className="m-0 text-xs text-gray-500 text-end">{`${taskDone}/${todos?.length}`} done</p>
                    </div>
                </>
            )}
        </div>
    )
}