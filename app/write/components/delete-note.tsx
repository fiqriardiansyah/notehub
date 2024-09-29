"use client"

import { REMOVE_NOTE_EVENT, REMOVE_NOTE_EVENT_FAILED, REMOVE_NOTE_EVENT_SUCCESS } from "@/app/components/card-note/setting/delete";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import useStatusBar from "@/hooks/use-status-bar";
import { Note } from "@/models/note";
import { Trash } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import React from "react";

export default function DeleteNote({ note }: { note?: Note }) {
    const router = useRouter();
    const [_, setStatusBar] = useStatusBar();

    React.useEffect(() => {
        const onDeleteSuccess = (e: { detail: Note }) => {
            if (e?.detail?.folderId) {
                router.replace(`/folder/${e?.detail?.folderId}`);
                return;
            }
            if (e.detail?.type === "habits") {
                router.replace("/habits");
                return;
            }
            router.replace("/");
        }

        const onDeleteFailed = (e: { detail: string }) => {
            setStatusBar({
                type: "danger",
                show: true,
                message: e?.detail,
            });
        }

        window.addEventListener(REMOVE_NOTE_EVENT_SUCCESS, onDeleteSuccess as any);
        window.addEventListener(REMOVE_NOTE_EVENT_FAILED, onDeleteFailed as any);

        return () => {
            window.removeEventListener(REMOVE_NOTE_EVENT_SUCCESS, onDeleteSuccess as any);
            window.removeEventListener(REMOVE_NOTE_EVENT_FAILED, onDeleteFailed as any);
        }
    }, []);

    const onClickDelete = () => {
        window.dispatchEvent(
            new CustomEvent(REMOVE_NOTE_EVENT, { detail: { note } })
        );
    };

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
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