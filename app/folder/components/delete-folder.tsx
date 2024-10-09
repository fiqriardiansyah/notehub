"use client";

import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { fireBridgeEvent, useBridgeEvent } from "@/hooks/use-bridge-event";
import useStatusBar from "@/hooks/use-status-bar";
import { pause } from "@/lib/utils";
import { DetailFolder } from "@/models/note";
import noteService from "@/service/note";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";

export const REMOVE_FOLDER_EVENT_DIALOG = "removeFolderEvent";
export const REMOVE_FOLDER_EVENT_SUCCESS = "removeFolderEventSuccess";
export const REMOVE_FOLDER_EVENT_FAILED = "removeFolderEventFailed";

export default function DialogDeleteFolderGround() {

    const [open, setOpen] = React.useState(false);
    const [detailFolder, setDetailFolder] = React.useState<DetailFolder | undefined>();
    const [_, setStatusBar, resetStatusBar] = useStatusBar();
    const queryClient = useQueryClient();

    const deleteMutate = useMutation(async (id: any) => {
        await pause(1);
        return (await noteService.deleteFolder(id)).data.data;
    });

    const toggleOpen = () => {
        setOpen((prev) => !prev);
    }

    useBridgeEvent(REMOVE_FOLDER_EVENT_DIALOG, (payload) => {
        setDetailFolder(payload);
        toggleOpen();
    });

    const onClickContinue = async () => {
        if (deleteMutate.isLoading) return;
        toggleOpen();
        setStatusBar({
            type: "loading",
            show: true,
            message: `Deleting Folder ${detailFolder?.folder?.title}...`,
        });

        try {
            await deleteMutate.mutateAsync(detailFolder?.folder?.id);
            fireBridgeEvent(REMOVE_FOLDER_EVENT_SUCCESS, detailFolder);
        } catch (e: any) {
            fireBridgeEvent(REMOVE_FOLDER_EVENT_FAILED, e?.message);
        }
        resetStatusBar();
        queryClient.refetchQueries();
        setDetailFolder(undefined);
    };

    return (
        <AlertDialog open={open} onOpenChange={toggleOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Folder &ldquo;{detailFolder?.folder?.title}&ldquo; will be deleted <br />
                        {detailFolder?.notes?.length ? <span className="text-red-400">and the content({detailFolder?.notes?.length}) will be deleted aswell</span> : null}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex flex-row items-center gap-3 justify-end">
                    <Button variant="ghost" onClick={toggleOpen}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={onClickContinue}>
                        Continue
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
