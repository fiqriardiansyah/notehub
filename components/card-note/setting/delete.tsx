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
import { Note } from "@/models/note";
import React from "react";

export const REMOVE_NOTE_EVENT_DIALOG = "removeNoteEvent";
export const REMOVE_NOTE_EVENT_EXECUTE = "removeNoteEventExecute";

export default function DialogDeleteGround() {
  const [open, setOpen] = React.useState(false);
  const [notePayload, setNotePayload] = React.useState<Note>();
  const callbackRef = React.useRef<((args: any) => void) | null>(null);

  const toggleOpen = () => {
    setOpen((prev) => !prev);
  }

  useBridgeEvent(REMOVE_NOTE_EVENT_DIALOG, (payload: { note: Note, callback: () => void }) => {
    callbackRef.current = payload.callback;
    setNotePayload(payload.note);
    toggleOpen();
  });

  const onClickContinue = async () => {
    if (callbackRef.current) {
      callbackRef.current(notePayload);
      toggleOpen();
      callbackRef.current = null;
    } else {
      console.log("There is no callback [delete.tsx]");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={toggleOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            {notePayload?.title} will be deleted
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
