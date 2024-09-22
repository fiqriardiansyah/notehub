"use client";

import TodoListModeEditor, { Todo } from "@/app/write/mode/todolist";
import StateRender from "@/components/state-render";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CommonContext, CommonContextType } from "@/context/common";
import { Note } from "@/models/note";
import noteService from "@/service/note";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { MoveRight } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import dynamic from "next/dynamic";
import React from "react";

const FreetextModeEditor = dynamic(() => import("@/app/write/mode/freetext").then((mod) => mod.default),
    { ssr: false }
)

export const VIEW_ATTACH_NOTE = "viewAttachNote";


export default function ViewAttachNote() {
    const router = useRouter();
    const { callbackPayload, common } = React.useContext(CommonContext) as CommonContextType;
    const [payload, setPayload] = React.useState<Pick<Note, "id" | "title">>();

    const noteDetailMutate = useMutation(async (id: string) => {
        return (await noteService.getOneNote(id)).data.data
    });

    const changeTodosMutate = useMutation(async (todos: Todo[]) => {
        return (await noteService.changeTodos({ noteId: payload!.id, todos })).data.data;
    });

    const onChangeTodoList = (todo: Todo[]) => {
        changeTodosMutate.mutate(todo);
    }

    callbackPayload((nameground, payload: Pick<Note, "id" | "title">) => {
        if (nameground === VIEW_ATTACH_NOTE) {
            noteDetailMutate.mutate(payload.id);
            setPayload(payload);
        }
    });

    const onClickToNote = () => {
        router.push(`/write/${payload?.id}`);
    }

    if (!common?.groundOpen) return null;
    if (common?.groundOpen !== VIEW_ATTACH_NOTE) return null;

    return (
        <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, transition: { delay: .3 } }}
            className="w-full h-full flex flex-col gap-6 p-5 md:p-0 md:w-[300px]">
            <div className="w-full flex justify-end">
                <Button onClick={onClickToNote} size="icon" variant="ghost">
                    <MoveRight />
                </Button>
            </div>
            <h1 className="capitalize">{payload?.title}</h1>
            <StateRender data={noteDetailMutate.data} isLoading={noteDetailMutate.isLoading}>
                <StateRender.Data>
                    {noteDetailMutate.data?.type === "freetext"
                        && <FreetextModeEditor asView data={noteDetailMutate.data?.note} asEdit options={{ readOnly: true }} />}
                    {noteDetailMutate.data?.type === "todolist"
                        && <TodoListModeEditor onChange={onChangeTodoList} onlyCanCheck todos={noteDetailMutate.data?.todos} />}
                </StateRender.Data>
                <StateRender.Loading>
                    <Skeleton className="w-[200px] h-[20px]" />
                    <Skeleton className="w-[250px] h-[20px]" />
                    <Skeleton className="w-[150px] h-[20px]" />
                </StateRender.Loading>
            </StateRender>
        </motion.div>
    )
}