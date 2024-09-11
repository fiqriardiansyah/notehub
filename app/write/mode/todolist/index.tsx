"use client";

import { Input } from "@/components/ui/input";
import { Info, Plus, Trash } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { AnimatePresence, motion } from "framer-motion";
import { CheckedState } from "@radix-ui/react-checkbox";
import { v4 as uuid } from 'uuid';
import dayjs from "dayjs";
import useStatusBar from "@/hooks/use-status-bar";
import { WriteContext, WriteContextType } from "@/context/write";
import { Note } from "@/models/note";
import { Timer } from "@/models/habits";

export type Todo = {
    id: string;
    content: any;
    isCheck: boolean;
    checkedAt: any;
    timer?: Partial<Timer> | null;
}

export type TodoListModeEditorProps = {
    onChange?: (todo: Todo[]) => void;
    todos?: Todo[];
    children?: React.ReactElement
    onSave?: (data: Partial<Note>) => void;
    showInfoDefault?: boolean;
}

export default function TodoListModeEditor({ onChange, todos = [], children, onSave, showInfoDefault = true }: TodoListModeEditorProps) {
    const { dataNote } = React.useContext(WriteContext) as WriteContextType;
    const [_, setStatusBar] = useStatusBar();
    const [list, setList] = React.useState<Todo[]>(() => todos);
    const [str, setStr] = React.useState("");
    const [showInfo, setShowInfo] = React.useState(true);

    React.useEffect(() => {
        if (onChange) onChange(list);
    }, [list]);

    const onDeleteItem = (todo: Todo) => {
        return () => {
            setList((prev) => prev.filter((ls) => ls.id !== todo.id));
        }
    }

    const onUpdateCheck = (todo: Todo) => {
        return (e: CheckedState) => {
            setList((prev) => prev.map((ls) => {
                if (ls.id !== todo.id) return ls;
                return {
                    ...ls,
                    isCheck: e as boolean,
                    checkedAt: e ? new Date().getTime() : null,
                }
            }))
        }
    }

    const onAddTodo = (e: any) => {
        e.preventDefault();
        const value = e.target.elements.content.value;
        setList((prev) => [...prev, {
            id: uuid(),
            content: value,
            isCheck: false,
            checkedAt: null,
        }]);
        setStr("");
    }

    const onChangeStr = (e: any) => {
        const value = e.target.value;
        setStr(value);
    }

    const onSubmit = async (e: any) => {
        e.preventDefault();
        if (!list.length) {
            setStatusBar({
                type: "danger",
                show: true,
                message: "At least make one todo task",
            });
            return;
        }
        if (onSave) {
            onSave({
                todos: list,
                folderId: dataNote?.folder?.id,
                newFolder: {
                    title: dataNote?.folder?.name,
                },
            });
        }
    }

    return (
        <>
            <div className="container-custom flex flex-col gap-3">
                <AnimatePresence>
                    {list?.map((item) => (
                        <motion.div animate={{ height: 'auto' }} initial={{ height: 0 }} exit={{ height: 0, opacity: 0 }} key={item.id} className="flex items-start overflow-hidden justify-between">
                            <label htmlFor={item.id} className="flex items-center cursor-pointer gap-3 p-1">
                                <Checkbox id={item.id} checked={item.isCheck} onCheckedChange={onUpdateCheck(item)} />
                                <div className="flex flex-col">
                                    <span>{item.content}</span>
                                    {item.checkedAt && <span className="text-xs font-medium text-gray-400">done at {dayjs(item.checkedAt).format("DD MMM, HH:mm")}</span>}
                                </div>
                            </label>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button onClick={onDeleteItem(item)} className="text-red-400">
                                        <Trash size={18} />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    Delete
                                </TooltipContent>
                            </Tooltip>
                        </motion.div>
                    ))}
                </AnimatePresence>
                <form onSubmit={onAddTodo} className="flex items-center gap-4">
                    <Input value={str} onChange={onChangeStr} name="content" placeholder="Type anything here..." className="border-none bg-transparent focus-visible:!ring-0 focus-visible:!ring-offset-0 outline-none" />
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button type="submit" className="">
                                <Plus />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>
                            Add todo
                        </TooltipContent>
                    </Tooltip>
                </form>
            </div>
            <form onSubmit={onSubmit} className="h-0 w-0 opacity-0 hidden">
                {children}
            </form>
            <div className="w-full flex justify-center my-10">
                {showInfo && showInfoDefault && (
                    <p onClick={() => setShowInfo(false)} className="bg-primary rounded-full p-1 pr-2 text-white w-fit flex items-center text-xs text-center">
                        <Info className="mr-2" size={14} />
                        Todo list mode
                    </p>
                )}
            </div>
        </>
    )
}