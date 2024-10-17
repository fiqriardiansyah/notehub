"use client";

import { Todo } from "@/app/write/mode/todolist";
import { Progress } from "@/components/ui/progress";
import { fireBridgeEvent, useBridgeEvent } from "@/hooks/use-bridge-event";
import useSkipFirstRender from "@/hooks/use-skip-first-render";
import { calculateShowProgress, progressCheer } from "@/lib/utils";
import { Note } from "@/models/note";
import noteService from "@/service/note";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import lodash from "lodash";
import React from "react";
import CheckboxCustom from "../ui/checkbox-custom";

export type TodolistCardNoteType = React.HTMLProps<HTMLDivElement> & {
  note: Partial<Note>;
  canInteract?: boolean;
  maxItemShow?: number;
};

export default function TodolistCardNote({
  note,
  maxItemShow,
  canInteract = true,
  className,
  ...props
}: TodolistCardNoteType) {
  const [todos, setTodos] = React.useState(() => note.todos);
  const prevProgressDoneCheer = React.useRef<number>();
  const [progressDoneCheer, setProgressDoneCheer] = React.useState<number>();
  const blockHitApiRef = React.useRef(false);

  const changeTodosMutate = useMutation(
    [noteService.changeTodos.name, "card"],
    async (todos: Todo[]) => {
      return (await noteService.changeTodos({ noteId: note.id!, todos })).data
        .data;
    }
  );

  const getOnlyTodos = useQuery(
    [noteService.getOnlyTodos.name, note?.id],
    async () => {
      return (await noteService.getOnlyTodos(note.id as string)).data.data;
    },
    {
      onSuccess(data) {
        setTodos(data.todos);
      },
    }
  );

  useBridgeEvent("update_todos_from_helper_panel" + note?.id, (tds: Todo[]) => {
    blockHitApiRef.current = true;
    setTodos(tds);
    const timeout = setTimeout(() => {
      blockHitApiRef.current = false;
      clearTimeout(timeout);
    }, 200);
  });

  useSkipFirstRender(() => {
    if (blockHitApiRef.current) return;
    if (lodash.isEqual(todos, note.todos)) return;
    const update = setTimeout(() => {
      changeTodosMutate.mutateAsync(todos || []);
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
    const stepPoint = calculateShowProgress({
      taskDone: currentTodos?.filter((t) => t.isCheck).length!,
      taskLength: todos?.length!,
    });
    if (stepPoint === prevProgressDoneCheer.current) return;
    setProgressDoneCheer(stepPoint);
    prevProgressDoneCheer.current = stepPoint === 100 ? undefined : stepPoint;
  };

  const onCheckChange = (todo: Todo, isCheck: boolean) => {
    const currentTodos = todos?.map((td) => {
      if (td.id !== todo.id) return td;
      return {
        ...td,
        isCheck,
        checkedAt: isCheck ? new Date().getTime() : null,
      };
    });
    const isDoneIncrease =
      currentTodos?.filter((t) => t.isCheck).length! >
      todos?.filter((t) => t.isCheck).length!;
    setTodos(currentTodos);
    fireBridgeEvent("update_todos_to_panel_" + note?.id, currentTodos);
    if (isDoneIncrease) {
      progressCheerUpdate(currentTodos!);
    }
  };

  const taskDone = todos?.filter((td) => td.isCheck).length;
  const progress = Math.round((taskDone! / (todos?.length || 0)) * 100);

  return (
    <div className="relative">
      <div
        className={`text-sm flex flex-col gap-1 max-h-[120px] overflow-y-auto ${className}`}
        {...props}
      >
        {todos?.map((item, i) => {
          if (maxItemShow !== undefined && i >= maxItemShow) return null;
          return (
            <CheckboxCustom
              disabled={!canInteract}
              key={item.id}
              checked={item.isCheck}
              onChecked={(checked) => onCheckChange(item, checked)}
              label={
                <span
                  className={`text-sm cursor-pointer line-clamp-1 ${
                    item.isCheck ? "line-through" : ""
                  }`}
                >
                  {item.content}
                </span>
              }
            />
          );
        })}
      </div>
      {canInteract && (
        <>
          <Progress className="h-[5px] mt-3" value={progress} />
          <div className="w-full flex items-start justify-between">
            <div className="overflow-y-hidden h-[20px] flex-1 relative">
              <AnimatePresence mode="wait">
                {progressCheer.map((pc) => {
                  if (pc.donepoint === progressDoneCheer) {
                    return (
                      <motion.p
                        key={pc.donepoint}
                        initial={{ y: "30px" }}
                        animate={{ y: 0 }}
                        exit={{ y: "30px" }}
                        className={`text-xs font-medium ${pc.color}`}
                      >
                        {pc.content}
                      </motion.p>
                    );
                  }
                  return null;
                })}
              </AnimatePresence>
            </div>
            <p className="m-0 text-xs text-gray-500 text-end">
              {`${taskDone}/${todos?.length}`} done
            </p>
          </div>
        </>
      )}
    </div>
  );
}
