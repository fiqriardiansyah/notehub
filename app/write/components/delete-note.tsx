"use client"

import { REMOVE_NOTE_EVENT_DIALOG } from "@/components/card-note/setting/delete";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { fireBridgeEvent } from "@/hooks/use-bridge-event";
import useStatusBar from "@/hooks/use-status-bar";
import { pause } from "@/lib/utils";
import { Note } from "@/models/note";
import noteService from "@/service/note";
import { useMutation } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import { useRouter } from "next-nprogress-bar";

export default function DeleteNote({ note }: { note?: Note }) {
    const router = useRouter();
    const [_, setStatusBar, resetStatusBar] = useStatusBar();

    const deleteMutate = useMutation(async (id: any) => {
        await pause(1);
        return (await noteService.deleteNote(id)).data.data;
    });

    const onDelete = async (note: Note) => {
        try {
            setStatusBar({
                type: "loading",
                show: true,
                message: `Deleting ${note?.title} note...`,
            });
            await deleteMutate.mutateAsync(note.id);
            resetStatusBar();
            if (note?.folderId) {
                router.replace(`/folder/${note?.folderId}`);
                return;
            }
            if (note?.type === "habits") {
                router.replace("/habits");
                return;
            }
            router.replace("/");
        } catch (e: any) {
            setStatusBar({
                type: "danger",
                show: true,
                message: e?.message,
            });
        }
    }

    const onClickDelete = () => {
        fireBridgeEvent(REMOVE_NOTE_EVENT_DIALOG, {
            note,
            callback: onDelete,
        });
    };

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    loading={deleteMutate.isLoading}
                    onClick={onClickDelete}
                    size="icon"
                    variant="destructive"
                >
                    <Trash />
                </Button>
            </TooltipTrigger>
            <TooltipContent>Delete</TooltipContent>
        </Tooltip>
    );
}