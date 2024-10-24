"use client";

import dynamic from "next/dynamic";
import React from "react";
import TodoListModeEditor, { Todo } from "../todolist";
import { Note } from "@/models/note";
import useStatusBar from "@/hooks/use-status-bar";
import { WriteContext, WriteContextType } from "@/context/write";
import { Info } from "lucide-react";
import { useMobileMediaQuery } from "@/hooks/responsive";

const Editor = dynamic(
  () => import("@/components/editor/index").then((mod) => mod.Editor),
  { ssr: false }
);

export type HabitsModeEditorProps = {
  asEdit?: boolean;
  note?: Note;
  children: React.ReactElement;
  onSave: (data: Partial<Note>) => void;
  showInfoDefault?: boolean;
};

export default function HabitsModeEditor({
  children,
  onSave,
  asEdit,
  note,
  showInfoDefault = true,
}: HabitsModeEditorProps) {
  const [_, setStatusBar, resetBar] = useStatusBar();
  const { dataNote } = React.useContext(WriteContext) as WriteContextType;
  const [freetextEditor, setFreetextEditor] = React.useState<any>(null);
  const [todos, setTodos] = React.useState<Todo[]>([]);
  const [showInfo, setShowInfo] = React.useState(true);
  const isMobile = useMobileMediaQuery();

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
    if (!dataNote.scheduler?.type) {
      setStatusBar({
        type: "danger",
        show: true,
        message: "Choose scheduler type first",
      });
      return;
    }
    const description = await freetextEditor?.save();
    onSave({
      todos,
      description,
      schedulerDays: dataNote.scheduler?.days,
      schedulerType: dataNote.scheduler?.type,
      schedulerStartTime: dataNote.scheduler?.startTime,
      schedulerEndTime: dataNote.scheduler?.endTime,
    });
  };

  return (
    <>
      <div className="flex w-full flex-col gap-4">
        <p className="text-xs text-gray-400 font-light mb-2 w-fit">
          Description
        </p>
        <Editor
          asEdit={asEdit}
          data={asEdit ? note?.description : undefined}
          placeholder="Habits Description"
          editorRef={setFreetextEditor}
        />
        <TodoListModeEditor
          todos={todos}
          defaultTodos={note?.todos}
          onChange={setTodos}
          showInfoDefault={false}
        />
      </div>
      <form onSubmit={onSubmit} className="h-0 w-0 opacity-0 hidden">
        {children}
      </form>
      {showInfo && showInfoDefault && isMobile && (
        <div className="w-full flex justify-center my-10">
          <p
            onClick={() => setShowInfo(false)}
            className="bg-primary rounded-full p-1 pr-2 text-white w-fit flex items-center text-xs text-center"
          >
            <Info className="mr-2" size={14} />
            Habits mode
          </p>
        </div>
      )}
    </>
  );
}
