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
import { NoteContext, NoteContextType } from "@/context/note";
import useStatusBar from "@/hooks/use-status-bar";
import { pause } from "@/lib/utils";
import { Note } from "@/models/note";
import noteService from "@/service/note";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";

export const REMOVE_NOTE_EVENT = "removeNoteEvent";
export const REMOVE_NOTE_EVENT_SUCCESS = "removeNoteEventSuccess";
export const REMOVE_NOTE_EVENT_FAILED = "removeNoteEventFailed";

export default function DialogDeleteGround() {
  const { note, setNote } = React.useContext(NoteContext) as NoteContextType;
  const [open, setOpen] = React.useState(false);
  const [payloadListenerEvent, setPayloadListenerEvent] =
    React.useState<Note>();
  const [_, setStatusBar, resetStatusBar] = useStatusBar();
  const queryClient = useQueryClient();

  const deleteMutate = useMutation(
    async (id: any) => {
      await pause(1);
      return (await noteService.deleteNote(id)).data.data;
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

  const listener = (e?: any) => {
    if (e?.detail?.note) {
      setPayloadListenerEvent(e.detail.note);
    }
    setOpen((prev) => !prev);
  };

  React.useEffect(() => {
    window.addEventListener(REMOVE_NOTE_EVENT, listener);
    return () => {
      window.removeEventListener(REMOVE_NOTE_EVENT, listener);
    };
  }, []);

  const onClickContinue = () => {
    listener();
    setStatusBar({
      type: "loading",
      show: true,
      message: `Deleting ${note?.note?.title || payloadListenerEvent?.title || ""
        } note...`,
    });
    deleteMutate
      .mutateAsync(note?.note?.id || payloadListenerEvent?.id)
      .then(() => {
        window.dispatchEvent(new CustomEvent(REMOVE_NOTE_EVENT_SUCCESS, { detail: payloadListenerEvent || note?.note }))
      })
      .catch((e: any) => {
        window.dispatchEvent(new CustomEvent(REMOVE_NOTE_EVENT_FAILED, { detail: e?.message }));
      })
      .finally(() => {
        setTimeout(resetStatusBar, 500);
        queryClient.refetchQueries();
      });
    setNote((prev) => ({ ...prev, note: null }));
    setPayloadListenerEvent(undefined);
  };

  return (
    <AlertDialog open={open} onOpenChange={listener}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            {note?.note?.title || payloadListenerEvent?.title} will be deleted
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-row items-center gap-3 justify-end">
          <Button variant="ghost" onClick={listener}>
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
