"use client";

import TodoListModeEditor, { Todo } from "@/app/write/mode/todolist";
import ghostAnim from "@/asset/animation/ghost.json";
import CollabsList from "@/components/common/collabs-list";
import { CLOSE_SIDE_PANEL } from "@/components/layout/side-panel";
import OpenSecureNote from "@/components/open-secure-note";
import StateRender from "@/components/state-render";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CommonContext, CommonContextType } from "@/context/common";
import { fireBridgeEvent, useBridgeEvent } from "@/hooks/use-bridge-event";
import { formatDate } from "@/lib/utils";
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
    const { common } = React.useContext(CommonContext) as CommonContextType;
    const [payload, setPayload] = React.useState<Pick<Note, "id" | "title">>();
    const [todos, setTodos] = React.useState<Todo[]>([]);
    const [isSecure, setIsSecure] = React.useState(false);

    const noteDetailMutate = useMutation(async (id: string) => {
        return (await noteService.getOneNote(id)).data.data
    }, {
        onSuccess(data) {
            setTodos(data?.todos || []);
        }
    });

    const isSecureNoteQuery = useMutation([noteService.isSecureNote.name], async (id: string) => {
        return (await noteService.isSecureNote(id)).data.data;
    }, {
        onSuccess(data, id) {
            if (!data) {
                noteDetailMutate.mutate(id);
            }
            setIsSecure(data);
        },
    });

    const changeTodosMutate = useMutation(async (todos: Todo[]) => {
        return (await noteService.changeTodos({ noteId: payload!.id, todos })).data.data;
    });

    const openSecure = () => {
        setIsSecure(false);
        noteDetailMutate.mutate(payload!.id);
    }

    const onChangeTodoList = (todo: Todo[]) => {
        fireBridgeEvent("update_todos_to_panel_" + payload?.id, todo);
        const update = setTimeout(() => {
            changeTodosMutate.mutateAsync(todos || []);
        }, 300);

        return () => clearTimeout(update);
    }

    useBridgeEvent(VIEW_ATTACH_NOTE, (payload: Pick<Note, "id" | "title">) => {
        setPayload(payload);
        isSecureNoteQuery.mutate(payload.id);
    });

    const onClickToNote = () => {
        fireBridgeEvent(CLOSE_SIDE_PANEL, null);
        router.push(`/write/${payload?.id}`);
    }

    if (!common?.groundOpen) return null;
    if (common?.groundOpen !== VIEW_ATTACH_NOTE) return null;

    return (
        <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, transition: { delay: .3 } }}
            className="w-full h-full flex flex-col gap-6 overflow-y-auto">
            <div className="w-full flex items-center gap-3">
                {noteDetailMutate.data && (
                    <Button onClick={onClickToNote} size="icon" variant="ghost">
                        <MoveRight />
                    </Button>
                )}
                <h1 className="capitalize">{payload?.title}</h1>
            </div>
            <StateRender data={isSecureNoteQuery.data !== undefined || isSecureNoteQuery.data !== null} isLoading={isSecureNoteQuery.isLoading} isError={(isSecureNoteQuery.error as Error)?.message}>
                <StateRender.Data>
                    {isSecure ? <OpenSecureNote refetch={openSecure} />
                        : (
                            <StateRender
                                data={noteDetailMutate.data}
                                isLoading={noteDetailMutate.isLoading}
                                isError={noteDetailMutate.isError} >
                                <StateRender.Data>
                                    {noteDetailMutate.data?.type === "freetext"
                                        && <FreetextModeEditor key="view_attach_note_text" showInfoDefault={false} data={noteDetailMutate.data?.note} asEdit options={{ readOnly: true }} />}
                                    {noteDetailMutate.data?.type === "todolist"
                                        && <TodoListModeEditor key="view_attach_note_todo" showInfoDefault={false} defaultTodos={todos} todos={todos} onChange={onChangeTodoList} />}
                                    <CollabsList noteId={noteDetailMutate.data?.id as string} >
                                        {(list) => {
                                            if (!list?.length) {
                                                return (
                                                    <span className="caption my-10 block">
                                                        {`Last edit at ${formatDate(noteDetailMutate.data?.updatedAt)}`}
                                                    </span>
                                                )
                                            }
                                            return (
                                                <span className="caption my-10 block">
                                                    {`Edited ${formatDate(noteDetailMutate.data?.updatedAt)} By `}
                                                    <span className="font-semibold">{noteDetailMutate.data?.updatedBy}</span>
                                                </span>
                                            )
                                        }}
                                    </CollabsList>
                                </StateRender.Data>
                                <StateRender.Loading>
                                    <div className="container-read flex flex-col gap-2">
                                        <Skeleton className="w-[200px] h-[20px]" />
                                        <Skeleton className="w-[250px] h-[20px]" />
                                        <Skeleton className="w-[150px] h-[20px]" />
                                    </div>
                                </StateRender.Loading>
                                <StateRender.Error>
                                    <p className="text-red-500">
                                        {(noteDetailMutate.error as Error)?.message}
                                    </p>
                                </StateRender.Error>
                            </StateRender>
                        )}
                </StateRender.Data>
                <StateRender.Loading>
                    <div className="container-read flex flex-col gap-2">
                        <Skeleton className="w-[200px] h-[20px]" />
                        <Skeleton className="w-[250px] h-[20px]" />
                        <Skeleton className="w-[150px] h-[20px]" />
                    </div>
                </StateRender.Loading>
                <StateRender.Error>
                    <p className="text-red-500">
                        {(isSecureNoteQuery.error as Error)?.message}
                    </p>
                </StateRender.Error>
            </StateRender>
        </motion.div>
    )
}