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
import useBridgeTrigger from "@/context/trigger";
import useStatusBar from "@/hooks/use-status-bar";
import { CollaborateProject } from "@/models/collab";
import collabService from "@/service/collab";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { CLOSE_BOTTOM_SHEET } from "../../setting-note-drawer/collab-bottom-sheet";

export const LEAVE_PROJECT = "leaveProject";
export const LEAVE_PROJECT_SUCCESS = "leaveProjectSuccess";
export const LEAVE_PROJECT_FAILED = "leaveProjectFailed";

export default function LeaveProject() {
    const [open, setOpen] = React.useState(false);
    const [collabProject, setCollabProject] = React.useState<CollaborateProject | null>(null);
    const { onBridgeTrigger, fireBridgeTrigger } = useBridgeTrigger<CollaborateProject>();
    const [_, setStatusBar, resetStatusBar] = useStatusBar();

    const leaveMutate = useMutation(async (id: string) => {
        return (await collabService.leaveProject(id)).data.data;
    })

    onBridgeTrigger((key: string, payload) => {
        if (key === LEAVE_PROJECT && payload) {
            setCollabProject(payload);
            setOpen(true);
        }
    });

    const onOpenChange = () => {
        setOpen((prev) => !prev);
    };

    const onClickLeave = () => {
        setStatusBar({
            type: "loading",
            show: true,
            message: `Leave the ${collabProject?.title} project`,
        });
        leaveMutate.mutateAsync(collabProject?.collaborateId as string).finally(() => {
            setOpen(false);
            fireBridgeTrigger(CLOSE_BOTTOM_SHEET, undefined);
            setTimeout(() => {
                resetStatusBar();
                setCollabProject(null);
            }, 500);
        });
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure</AlertDialogTitle>
                    <AlertDialogDescription>
                        To leave {`'${collabProject?.title}'`} Project?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex flex-row items-center gap-3 justify-end">
                    <Button disabled={leaveMutate.isLoading} variant="ghost" onClick={onOpenChange}>
                        Cancel
                    </Button>
                    <Button loading={leaveMutate.isLoading} variant="destructive" onClick={onClickLeave}>
                        Leave
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
