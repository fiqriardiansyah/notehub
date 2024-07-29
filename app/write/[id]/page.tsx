"use client";

import StateRender from "@/components/state-render";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { WriteContext, WriteContextType } from "@/context/write";
import useStatusBar from "@/hooks/use-status-bar";
import { shortCut } from "@/lib/shortcut";
import { CreateNote } from "@/models/note";
import ShowedTags from "@/module/tags/showed-tags";
import noteService from "@/service/note";
import validation from "@/validation";
import { noteValidation } from "@/validation/note";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useParams } from "next/navigation";
import React, { useRef } from "react";
import ToolsBar from "../components/tool-bar";
import dynamic from "next/dynamic";

const Editor = dynamic<{
    editorRef: any
    children?: any
    data?: any
    options?: any
}>(
    () =>
        import("@/components/editor/index").then((mod) => mod.Editor),
    { ssr: false }
)

export default function Write() {

    const { id } = useParams();

    const titleRef = useRef<HTMLInputElement | null>(null);
    const [_, setStatusBar] = useStatusBar();
    const { dataNote, setDataNote } = React.useContext(WriteContext) as WriteContextType;

    const [editor, setEditor] = React.useState<any>(null)

    const { toast } = useToast();

    const noteDetailQuery = useQuery(["get-note", id], async () => {
        return (await noteService.getOneNote(id as string)).data.data
    }, {
        enabled: !!id,
        refetchInterval: false,
        refetchOnWindowFocus: false,
        onSuccess(data) {
            setDataNote((prev) => ({
                ...prev,
                isSecure: data?.isSecure,
                tags: data?.tags,
                title: data?.title,
            }))
        }
    })

    const saveMutate = useMutation(
        async (data: CreateNote) => {
            return (await noteService.updateNote(data, id as string)).data.data;
        },
        {
            onError(error: any) {
                toast({
                    title: "Error",
                    description: error?.message,
                    variant: "destructive",
                });
            },
        }
    );

    const saveWrite = async () => {
        if (!editor) return;
        const note = await editor.save();

        const data = {
            title: titleRef.current?.value,
            type: "freetext",
            note,
            isSecure: dataNote?.isSecure,
            tags: dataNote?.tags,
        } as CreateNote;

        try {
            validation(noteValidation.CREATE, data);
            saveMutate.mutateAsync(data as CreateNote).then(() => {
                toast({
                    title: "Success",
                    description: <p className="text-green-400">New Note Update!</p>,
                });
            });
        } catch (e: any) {
            setStatusBar({
                type: "danger",
                show: true,
                message: e?.message,
            });
        }
    };

    shortCut.saveWrite(saveWrite);

    const onChangeTitle = (e: any) => {
        const text = e.target.value;
        setDataNote((prev) => ({
            ...prev,
            title: text,
        }));
    }

    return (
        <div className="">
            <div className="container-custom">
                <ShowedTags />
                <StateRender data={noteDetailQuery.data} isLoading={noteDetailQuery.isLoading}>
                    <StateRender.Data>
                        <input
                            value={dataNote?.title}
                            onChange={onChangeTitle}
                            autoFocus={true}
                            ref={titleRef}
                            type="text"
                            placeholder="Your Title ..."
                            className="text-2xl text-gray-500 w-full font-medium border-none focus:outline-none outline-none my-7 bg-transparent"
                        />
                        <Editor editorRef={setEditor} data={noteDetailQuery.data?.note} />
                    </StateRender.Data>
                    <StateRender.Loading>
                        <Skeleton className="w-[300px] h-[50px]" />
                        <Skeleton className="w-[350px] h-[20px] mt-6" />
                        <Skeleton className="w-[200px] h-[20px] mt-3" />
                    </StateRender.Loading>
                </StateRender>
            </div>
            <div className="fixed z-40 bottom-8 left-1/2 -translate-x-1/2">
                <StateRender data={noteDetailQuery.data} isLoading={noteDetailQuery.isLoading}>
                    <StateRender.Data>
                        <AnimatePresence>
                            <motion.div animate={{ scale: 1 }} initial={{ scale: 0 }}>
                                <ToolsBar isLoading={saveMutate.isLoading} save={saveWrite} />
                            </motion.div>
                        </AnimatePresence>
                    </StateRender.Data>
                </StateRender>
            </div>
        </div>
    );
}
