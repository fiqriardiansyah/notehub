"use client";

import LayoutGrid from "@/app/components/layout-grid";
import SettingNoteDrawer from "@/app/components/setting-note-drawer";
import ToolBar from "@/app/components/tool-bar";
import StateRender from "@/components/state-render";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import noteService from "@/service/note";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, Pencil, Plus, Trash } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import { useParams } from "next/navigation";
import React from "react";
import FormTitle from "../components/form-title";
import useSidePage from "@/hooks/use-side-page";
import { emitterPickNotes, PICK_NOTES, PICK_NOTES_SUBMIT, usePickNotes } from "@/app/components/pick-notes";
import { Note } from "@/models/note";
import { pause } from "@/lib/utils";
import useStatusBar from "@/hooks/use-status-bar";

export default function FolderPage() {
    const queryClient = useQueryClient();
    const { id } = useParams();
    const router = useRouter();
    const [edit, setEdit] = React.useState({
        isEdit: false,
        tempTitle: ""
    });
    const [setSidePage, resetSidePage] = useSidePage();
    const pickNotes = usePickNotes();
    const [_, setStatusBar] = useStatusBar();

    const detailFolderQuery = useQuery([noteService.getFolderAndContent.name, id], async () => {
        return (await noteService.getFolderAndContent(id as string)).data.data
    }, {
        onSuccess(data) {
            setEdit((prev) => ({ ...prev, tempTitle: data?.folder?.title }));
        },
    });

    const addNoteToFolderMutate = useMutation([noteService.addNoteToFolder.name], async (ids: string[]) => {
        await pause(3);
        return (await noteService.addNoteToFolder(id as string, ids)).data.data;
    })

    const onClickBack = () => {
        router.back();
    }

    const onClickEdit = () => {
        setEdit((prev) => ({ ...prev, isEdit: true }));
    }

    const onClickDiscard = () => {
        setEdit((prev) => ({ ...prev, isEdit: false }));
    }

    const onClickAddNotes = () => {
        setSidePage(PICK_NOTES);
    }

    React.useEffect(() => {
        const handleSubmitPickNote = (pickedNotes: Note[]) => {
            resetSidePage();
            if (addNoteToFolderMutate.isLoading) return;
            pickNotes.hideNotes(pickedNotes);
            addNoteToFolderMutate.mutateAsync(pickedNotes.map((n) => n.id)).then(() => {
                detailFolderQuery.refetch();
                pickNotes.notesQuery.refetch();
                pickNotes.resetPickedNotes();
                pickNotes.hideNotes([]);
                queryClient.refetchQueries({ queryKey: [noteService.getAllItems.name] })
            }).catch((e: any) => {
                pickNotes.hideNotes([]);
                pickNotes.setPickedNotes(pickedNotes);
                setStatusBar({
                    type: "danger",
                    show: true,
                    message: e?.message,
                });
            });
        };

        emitterPickNotes.on(PICK_NOTES_SUBMIT, handleSubmitPickNote);

        return () => {
            emitterPickNotes.off(PICK_NOTES_SUBMIT, handleSubmitPickNote);
        };
    }, []);

    const notes = () => {
        if (addNoteToFolderMutate.isLoading || detailFolderQuery.isLoading) {
            return [
                ...pickNotes.pickedNotes,
                ...(detailFolderQuery.data?.notes || [])
            ]
        };
        return detailFolderQuery.data?.notes
    }

    return (
        <div className="container-custom pb-20">
            <div className="w-full flex items-center gap-3 py-1 z-20 sticky top-0 left-0 bg-primary-foreground">
                <Button onClick={onClickBack} size="icon" variant="ghost" className="!w-10">
                    <ChevronLeft />
                </Button>
                {detailFolderQuery.isLoading ?
                    <p className="font-medium text-lg line-clamp-1 capitalize">Getting Detail...</p> :
                    !edit.isEdit ? <p className="font-medium text-lg line-clamp-1 capitalize">{edit?.tempTitle}</p> :
                        <FormTitle title={edit.tempTitle} onDiscard={onClickDiscard} refetch={detailFolderQuery.refetch} setEdit={setEdit} />
                }
            </div>
            <div className={`${edit.isEdit ? "blur-sm pointer-events-none" : ""}`}>
                <ToolBar rightAddition={() => (
                    <>
                        <button onClick={onClickAddNotes} title="Add Note" className="bg-none cursor-pointer p-2 text-lg">
                            <Plus size={20} strokeWidth={1.25} />
                        </button>
                        <button title="Delete Folder" className="bg-none cursor-pointer p-2 text-lg">
                            <Trash className="text-red-500" size={20} strokeWidth={1.25} />
                        </button>
                        <button onClick={onClickEdit} title="Edit Folder" className="bg-none cursor-pointer p-2 text-lg">
                            <Pencil size={20} strokeWidth={1.25} />
                        </button>
                    </>
                )} />
                <StateRender data={detailFolderQuery.data} isLoading={detailFolderQuery.isLoading}>
                    <StateRender.Data>
                        <div className="w-full my-7">
                            <LayoutGrid notes={notes()} />
                            {!notes()?.length && (
                                <div className="min-h-[250px] flex items-center justify-center gap-3">
                                    <div className="text-center text-sm">Ooops, there is no notes in this folder 😴
                                        <br />
                                        <span onClick={onClickAddNotes} role="button" className="!text-blue-500" tabIndex={0}>Import Note</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </StateRender.Data>
                    <StateRender.Loading>
                        <Skeleton className="w-[300px] h-[50px]" />
                        <Skeleton className="w-[350px] h-[20px] mt-6" />
                        <Skeleton className="w-[200px] h-[20px] mt-3" />
                    </StateRender.Loading>
                </StateRender>
            </div>
            <SettingNoteDrawer.BottomSheet refetch={detailFolderQuery.refetch} />
        </div>
    )
}