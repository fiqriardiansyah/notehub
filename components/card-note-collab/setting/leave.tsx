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
import { useBridgeEvent } from "@/hooks/use-bridge-event";
import { CollaborateProject } from "@/models/collab";
import collabService from "@/service/collab";
import { useMutation } from "@tanstack/react-query";
import React from "react";

export const LEAVE_PROJECT = "leaveProject";
export const LEAVE_PROJECT_SUCCESS = "leaveProjectSuccess";
export const LEAVE_PROJECT_FAILED = "leaveProjectFailed";

export default function LeaveProject() {
  const [open, setOpen] = React.useState(false);
  const [collabProject, setCollabProject] =
    React.useState<CollaborateProject | null>(null);
  const callbackRef = React.useRef<((data: CollaborateProject) => void) | null>(
    null
  );

  const leaveMutate = useMutation(async (id: string) => {
    return (await collabService.leaveProject(id)).data.data;
  });

  useBridgeEvent(
    LEAVE_PROJECT,
    (payload: { note: CollaborateProject; callback: () => void }) => {
      if (payload?.callback) {
        callbackRef.current = payload.callback;
      }
      setCollabProject(payload.note);
      setOpen(true);
    }
  );

  const onOpenChange = () => {
    setOpen((prev) => !prev);
  };

  const onClickLeave = () => {
    setOpen(false);
    if (callbackRef.current) {
      callbackRef.current(collabProject!);
      callbackRef.current = null;
      setCollabProject(null);
    } else {
      console.log("There is no callback [leave.tsx]");
    }
  };

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
          <Button
            disabled={leaveMutate.isLoading}
            variant="ghost"
            onClick={onOpenChange}
          >
            Cancel
          </Button>
          <Button
            loading={leaveMutate.isLoading}
            variant="destructive"
            onClick={onClickLeave}
          >
            Leave
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
