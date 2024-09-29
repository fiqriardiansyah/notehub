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
import { toast } from "@/components/ui/use-toast";
import useStatusBar from "@/hooks/use-status-bar";
import { pause } from "@/lib/utils";
import { DetailFolder } from "@/models/note";
import noteService from "@/service/note";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";

export const REMOVE_FOLDER_EVENT = "removeFolderEvent";
export const REMOVE_FOLDER_EVENT_SUCCESS = "removeFolderEventSuccess";
export const REMOVE_FOLDER_EVENT_FAILED = "removeFolderEventFailed";

export default function DialogDeleteFolderGround() {

    const [open, setOpen] = React.useState(false);
    const [detailFolder, setDetailFolder] = React.useState<DetailFolder | undefined>();
    const [_, setStatusBar, resetStatusBar] = useStatusBar();
    const queryClient = useQueryClient();

    const deleteMutate = useMutation(
        async (id: any) => {
            await pause(4);
            return (await noteService.deleteFolder(id)).data.data;
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

    const listener = (e?: { detail: DetailFolder }) => {
        setDetailFolder(e?.detail);
        setOpen((prev) => !prev);
    };

    React.useEffect(() => {
        window.addEventListener(REMOVE_FOLDER_EVENT, listener as any);
        return () => {
            window.removeEventListener(REMOVE_FOLDER_EVENT, listener as any);
        };
    }, []);

    const onClickContinue = () => {
        listener();
        setStatusBar({
            type: "loading",
            show: true,
            message: `Deleting Folder ${detailFolder?.folder?.title}...`,
        });
        deleteMutate
            .mutateAsync(detailFolder?.folder?.id)
            .then(() => {
                window.dispatchEvent(new CustomEvent(REMOVE_FOLDER_EVENT_SUCCESS, { detail: detailFolder }))
            })
            .catch((e: any) => {
                window.dispatchEvent(new CustomEvent(REMOVE_FOLDER_EVENT_FAILED, { detail: e?.message }));
                setStatusBar({
                    type: "danger",
                    show: true,
                    message: e?.message,
                });
            })
            .finally(() => {
                setTimeout(resetStatusBar, 500);
                queryClient.refetchQueries();
            });
        setDetailFolder(undefined);
    };

    return (
        <AlertDialog open={open} onOpenChange={listener as any}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Folder &ldquo;{detailFolder?.folder?.title}&ldquo; will be deleted <br />
                        {detailFolder?.notes?.length ? <span className="text-red-400">and the content({detailFolder?.notes?.length}) will be deleted aswell</span> : null}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex flex-row items-center gap-3 justify-end">
                    <Button variant="ghost" onClick={listener as any}>
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
