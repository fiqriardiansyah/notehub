"use client";

import dynamic from "next/dynamic";
import React from "react";
import TodoListModeEditor, { Todo } from "../todolist";
import { Note } from "@/models/note";
import useStatusBar from "@/hooks/use-status-bar";
import { WriteContext, WriteContextType } from "@/context/write";

const Editor = dynamic(() => import("@/components/editor/index").then((mod) => mod.Editor),
    { ssr: false }
)

export type HabitsModeEditorProps = {
    children: React.ReactElement
    onSave: (data: Partial<Note>) => void;
}

export default function HabitsModeEditor({ children, onSave }: HabitsModeEditorProps) {
    const [_, setStatusBar, resetBar] = useStatusBar();
    const { dataNote } = React.useContext(WriteContext) as WriteContextType;
    const [freetextEditor, setFreetextEditor] = React.useState<any>(null);
    const [todos, setTodos] = React.useState<Todo[]>([]);

    const onSubmit = async (e: any) => {
        e.preventDefault();
        resetBar();
        if (!todos.length) {
            setStatusBar({
                type: "danger",
                show: true,
                message: "At least make one todo task",
            });
            return;
        }
        const description = await freetextEditor?.save()
        onSave({
            todos,
            description,
            schedulerDays: dataNote.scheduler?.days,
            schedulerType: dataNote.scheduler?.type,
            schedulerStartTime: dataNote.scheduler?.startTime,
            schedulerEndTime: dataNote.scheduler?.endTime
        });
    }

    return (
        <>
            <div className="flex w-full flex-col gap-2">
                <Editor placeholder="Description" editorRef={setFreetextEditor} />
                <hr />
                <TodoListModeEditor onChange={setTodos} />
            </div>
            <form onSubmit={onSubmit} className="h-0 w-0 opacity-0 hidden">
                {children}
            </form>
        </>
    )
}