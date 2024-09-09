"use client";

import OpenSecureNote from "@/app/components/open-secure-note";
import { BUTTON_SUCCESS_ANIMATION_TRIGGER } from "@/components/animation/button-success";
import StateRender from "@/components/state-render";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
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
import { ChevronLeft, FolderOpen } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useRef } from "react";
import ToolsBar from "../components/tool-bar";
import FreetextModeEditor from "../mode/freetext";
import TodoListModeEditor, { Todo } from "../mode/todolist";
import useToggleHideNav from "@/hooks/use-toggle-hide-nav";
import { easeDefault } from "@/lib/utils";

export default function Write() {
    const router = useRouter();
    const { id } = useParams();

    const titleRef = useRef<HTMLInputElement | null>(null);
    const [_, setStatusBar] = useStatusBar();
    const { dataNote, setDataNote } = React.useContext(WriteContext) as WriteContextType;
    const isNavHide = useToggleHideNav();

    const [freetextEditor, setFreetextEditor] = React.useState<any>(null)
    const [todos, setTodos] = React.useState<Todo[]>([]);

    const { toast } = useToast();

    const noteDetailQuery = useMutation(["get-note", id], async () => {
        return (await noteService.getOneNote(id as string)).data.data
    }, {
        onSuccess(data) {
            if (data.type === "habits") {
                router.replace("/", { scroll: true });
            }
            setTodos(data?.todos || []);
            setDataNote((prev) => ({
                ...prev,
                isSecure: data?.isSecure,
                tags: data?.tags,
                title: data?.title,
                modeWrite: data.type,
            }));
        }
    });

    const isSecureNoteQuery = useQuery([noteService.isSecureNote.name, id], async () => {
        return (await noteService.isSecureNote(id as string)).data.data;
    }, {
        enabled: !!id,
        refetchInterval: false,
        refetchOnWindowFocus: false,
        onSuccess(data) {
            if (!data) {
                noteDetailQuery.mutate();
            }
            setDataNote((prev) => ({
                ...prev,
                authorized: !data,
            }));
        },
    });

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
        const data = {
            title: titleRef.current?.value,
            type: dataNote.modeWrite,
            isSecure: dataNote?.isSecure,
            tags: dataNote?.tags,
        } as CreateNote;

        if (dataNote.modeWrite === "freetext") {
            if (!freetextEditor) return;
            const note = await freetextEditor?.save();
            data.note = note;
        };

        if (dataNote.modeWrite === "todolist") {
            if (!todos.length) {
                setStatusBar({
                    type: "danger",
                    show: true,
                    message: "At least make one todo task",
                });
                return;
            }
            data.todos = todos;
        }

        try {
            validation(noteValidation.CREATE, data as any);
            saveMutate.mutateAsync(data as CreateNote).then(() => {
                setDataNote({
                    authorized: true,
                    modeWrite: dataNote.modeWrite
                });
                window.dispatchEvent(new CustomEvent(BUTTON_SUCCESS_ANIMATION_TRIGGER + "button-save-write"))
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

    const onClickBack = () => {
        router.back();
    }

    return (
        <div className="container-custom pb-20 min-h-[150vh]">
            <motion.div animate={{ y: isNavHide ? "-100%" : 0 }} transition={{ ease: easeDefault }} className="w-full flex items-center z-10 justify gap-3 py-1 sticky top-0 left-0 bg-primary-foreground">
                <Button onClick={onClickBack} size="icon" variant="ghost" className="!w-10">
                    <ChevronLeft />
                </Button>
                {noteDetailQuery.isLoading ? <p>Getting Detail...</p> : (
                    <input
                        value={dataNote?.title}
                        onChange={onChangeTitle}
                        autoFocus={true}
                        ref={titleRef}
                        type="text"
                        placeholder="Title ..."
                        className="text-2xl text-gray-500 flex-1 font-medium border-none focus:outline-none outline-none bg-transparent"
                    />
                )}
            </motion.div>
            {noteDetailQuery.data?.folderName && (
                <Breadcrumb>
                    <BreadcrumbList>
                        <FolderOpen size={18} />
                        <BreadcrumbItem>
                            <Link href={`/folder/${noteDetailQuery.data?.folderId}`} passHref>
                                <BreadcrumbLink>
                                    {noteDetailQuery.data?.folderName}
                                </BreadcrumbLink>
                            </Link>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            )}
            <ShowedTags className="my-5" />
            <StateRender data={noteDetailQuery.data || isSecureNoteQuery.data} isLoading={noteDetailQuery.isLoading || isSecureNoteQuery.isLoading}>
                <StateRender.Data>
                    {(isSecureNoteQuery.data && !dataNote?.authorized) ? (
                        <OpenSecureNote refetch={noteDetailQuery.mutate} />
                    ) : (
                        <>
                            {dataNote.modeWrite === "freetext" && <FreetextModeEditor editorRef={setFreetextEditor} asEdit data={noteDetailQuery.data?.note} />}
                            {dataNote.modeWrite === "todolist" && <TodoListModeEditor todos={todos} onChange={setTodos} />}

                            <div className="fixed z-40 sm:bottom-8 sm:left-1/2 sm:-translate-x-1/2 bottom-0 left-0 w-full">
                                <AnimatePresence>
                                    <motion.div animate={{ scale: 1 }} initial={{ scale: 0 }} className="flex justify-center">
                                        <ToolsBar excludeSettings={["folder", "mode"]} isLoading={saveMutate.isLoading} save={saveWrite} />
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </>

                    )}
                </StateRender.Data>
                <StateRender.Loading>
                    <Skeleton className="w-[300px] h-[50px]" />
                    <Skeleton className="w-[350px] h-[20px] mt-6" />
                    <Skeleton className="w-[200px] h-[20px] mt-3" />
                </StateRender.Loading>
            </StateRender>
        </div>
    );
}
