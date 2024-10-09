"use client";

import { BUTTON_SUCCESS_ANIMATION_TRIGGER } from "@/components/animation/button-success";
import { COLLABS_NOTE_GROUND } from "@/components/card-note/setting/collabs";
import CollabsList from "@/components/common/collabs-list";
import ResponsiveTagsListed from "@/components/common/tag-listed";
import OpenSecureNote from "@/components/open-secure-note";
import StateRender from "@/components/state-render";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { NoteContext, NoteContextType } from "@/context/note";
import { WriteContext, WriteContextType, WriteStateType } from "@/context/write";
import useStatusBar from "@/hooks/use-status-bar";
import useToggleHideNav from "@/hooks/use-toggle-hide-nav";
import { easeDefault, formatDate } from "@/lib/utils";
import { CreateNote } from "@/models/note";
import ShowedTags from "@/module/tags/showed-tags";
import noteService from "@/service/note";
import validation from "@/validation";
import { noteValidation } from "@/validation/note";
import { useMutation, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ChevronLeft, FolderOpen } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useRef } from "react";
import ToolsBar, { ToolsType } from "../components/tool-bar";
import TodoListModeEditor, { Todo } from "../mode/todolist";
import { OPEN_SIDE_PANEL } from "@/components/layout/side-panel";
import { fireBridgeEvent } from "@/hooks/use-bridge-event";

const FreetextModeEditor = dynamic(() => import("../mode/freetext").then((mod) => mod.default),
    { ssr: false }
)

const HabitsModeEditor = dynamic(() => import("../mode/habits").then((mod) => mod.default),
    { ssr: false }
)

export default function Write() {
    const router = useRouter();
    const { id } = useParams();

    const [_, setStatusBar, resetStatusBar] = useStatusBar();
    const { dataNote, setDataNote } = React.useContext(WriteContext) as WriteContextType;
    const { generateChangesId } = React.useContext(NoteContext) as NoteContextType;
    const isNavHide = useToggleHideNav();
    const saveBtnRef = React.useRef<HTMLButtonElement>(null);
    const [todos, setTodos] = React.useState<Todo[]>([]);
    const { toast } = useToast();

    const noteDetailQuery = useMutation(["get-note", id], async () => {
        return (await noteService.getOneNote(id as string)).data.data
    }, {
        onSuccess(data) {
            if (!data) {
                router.back();
                return;
            }
            setTodos(data?.todos || []);
            setDataNote((prev) => ({
                ...prev,
                isSecure: data?.isSecure,
                tags: data?.tags,
                title: data?.title,
                modeWrite: data?.type || "freetext",
                scheduler: data?.type === "habits" ? {
                    type: data?.schedulerType,
                    days: data?.schedulerDays,
                    startTime: data?.schedulerStartTime,
                    endTime: data?.schedulerEndTime,
                } as WriteStateType["scheduler"] : undefined,
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

    const saveWrite = async (restData: any) => {
        let data = {
            title: dataNote?.title,
            type: dataNote.modeWrite,
            isSecure: dataNote?.isSecure,
            tags: dataNote?.tags,
            ...restData,
        } as CreateNote;

        try {
            resetStatusBar();
            validation(noteValidation.CREATE, data as any);
            saveMutate.mutateAsync(data as CreateNote).then(() => {
                setDataNote({ modeWrite: dataNote.modeWrite });
                window.dispatchEvent(new CustomEvent(BUTTON_SUCCESS_ANIMATION_TRIGGER + "button-save-write"));
                generateChangesId();
                setTimeout(() => {
                    router.back();
                }, 500);
            });
        } catch (e: any) {
            setStatusBar({
                type: "danger",
                show: true,
                message: e?.message,
            });
        }
    };

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

    const onSaveClick = () => {
        if (!saveBtnRef.current) return;
        saveBtnRef.current.click();
    };

    const onClickListCollabAccount = () => {
        fireBridgeEvent(OPEN_SIDE_PANEL, {
            groundOpen: COLLABS_NOTE_GROUND,
            payload: noteDetailQuery.data,
        });
    }

    const excludeTools = () => {
        let excludesSetting = ["folder", "mode"];
        if (noteDetailQuery.data?.type === 'habits' || dataNote?.modeWrite === "habits") {
            excludesSetting = [...excludesSetting, "secure", "collabs"];
        }
        if (noteDetailQuery.data?.isSecure || dataNote?.isSecure) {
            excludesSetting.push("collabs");
        }
        if (noteDetailQuery.data?.role === "editor") {
            excludesSetting = [...excludesSetting, "delete", "secure", "collabs", "tag"] as ToolsType[];
        }

        return excludesSetting as ToolsType[];
    }

    const asViewer = noteDetailQuery.data?.role === "viewer";
    const isOwner = !noteDetailQuery.data?.role;
    const isSecure = (isSecureNoteQuery.data && !dataNote?.authorized)

    return (
        <>
            <div className="container-custom pb-20 min-h-screen bg-white relative">
                <motion.div style={{ pointerEvents: isNavHide ? "none" : "auto" }} animate={{ y: isNavHide ? "-100%" : 0 }} transition={{ ease: easeDefault }} className="sticky top-0 left-0 py-1 bg-white z-20">
                    <div className="flex flex-row items-center flex-1">
                        <div className="mr-3">
                            <Button onClick={onClickBack} size="icon" variant="ghost" className="!w-10">
                                <ChevronLeft />
                            </Button>
                        </div>
                        <h1>Detail {dataNote?.title}</h1>
                    </div>
                </motion.div>
                {noteDetailQuery.data?.folderName && isOwner && (
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
                <StateRender data={noteDetailQuery.data || isSecureNoteQuery.data} isLoading={noteDetailQuery.isLoading || isSecureNoteQuery.isLoading}>
                    <StateRender.Data>
                        {isSecure ? (
                            <div className="flex items-center min-h-[400px] w-full">
                                <OpenSecureNote refetch={noteDetailQuery.mutate} />
                            </div>
                        ) : (
                            <div className="w-full container-read overflow-x-hidden lg:!px-10">
                                <input
                                    disabled={asViewer}
                                    value={dataNote?.title}
                                    onChange={onChangeTitle}
                                    autoFocus={true}
                                    type="text"
                                    placeholder="Title ..."
                                    className="text-2xl w-full font-medium border-none focus:outline-none outline-none bg-transparent mb-8"
                                />
                                {dataNote.tags?.length ? (
                                    <div className="">
                                        <h1 className="text-2xl font-light mb-3 underline w-fit">Tags</h1>
                                        {isOwner ?
                                            <ShowedTags className="my-5 sm:!flex-wrap" /> :
                                            <div className="my-4">
                                                <ResponsiveTagsListed tags={noteDetailQuery.data?.tags} size={16} />
                                            </div>}
                                    </div>
                                ) : null}
                                {dataNote.modeWrite === "freetext" &&
                                    <FreetextModeEditor showInfoDefault={false} options={{ readOnly: asViewer }} data={noteDetailQuery.data?.note} asEdit onSave={saveWrite}>
                                        <button ref={saveBtnRef} type="submit">submit</button>
                                    </FreetextModeEditor>}
                                {dataNote.modeWrite === "todolist" && (asViewer ?
                                    (<TodoListModeEditor.AsView todos={todos} />) :
                                    <TodoListModeEditor showInfoDefault={false} defaultTodos={todos} todos={todos} onSave={saveWrite}>
                                        <button ref={saveBtnRef} type="submit">submit</button>
                                    </TodoListModeEditor>)}
                                {dataNote.modeWrite === "habits" && isOwner &&
                                    <HabitsModeEditor showInfoDefault={false} note={noteDetailQuery.data} asEdit onSave={saveWrite}>
                                        <button ref={saveBtnRef} type="submit">submit</button>
                                    </HabitsModeEditor>}
                                <CollabsList noteId={id as string} >
                                    {(list) => {
                                        if (isOwner && !list?.length) return null;
                                        return (
                                            <span className="caption my-10 block">
                                                {`Edited ${formatDate(noteDetailQuery.data?.updatedAt)} By `}
                                                <span className="font-semibold">{noteDetailQuery.data?.updatedBy}</span>
                                            </span>
                                        )
                                    }}
                                </CollabsList>
                            </div>
                        )}
                    </StateRender.Data>
                    <StateRender.Loading>
                        <div className="container-read">
                            <Skeleton className="w-[300px] h-[50px]" />
                            <Skeleton className="w-[350px] h-[20px] mt-6" />
                            <Skeleton className="w-[200px] h-[20px] mt-3" />
                        </div>
                    </StateRender.Loading>
                </StateRender>
            </div>
            {!noteDetailQuery?.isLoading && noteDetailQuery.data?.role !== "viewer" && !isSecure && (
                <div className="flex justify-center fixed sm:absolute z-40 sm:bottom-2 bottom-0 left-0 sm:left-1/2 transform sm:-translate-x-1/2 w-full sm:w-fit sm:bg-white sm:rounded-full sm:shadow-xl">
                    <ToolsBar
                        currentNote={noteDetailQuery.data}
                        excludeSettings={excludeTools()}
                        isLoading={saveMutate.isLoading}
                        save={onSaveClick} />
                </div>
            )}
        </>
    );
}
