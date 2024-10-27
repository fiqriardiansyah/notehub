import { REMOVE_MANY_NOTE_EVENT_DIALOG } from "@/components/card-note/setting/delete-many";
import { Button } from "@/components/ui/button";
import { fireBridgeEvent } from "@/hooks/use-bridge-event";
import { Trash } from "lucide-react";
import { useSelectToolBar } from "../provider";
import { Note } from "@/models/note";
import { useMutation } from "@tanstack/react-query";
import noteService from "@/service/note";
import useStatusBar from "@/hooks/use-status-bar";
import React from "react";
import { NoteContext, NoteContextType } from "@/context/note";

export default function Delete() {
  const { generateChangesId } = React.useContext(
    NoteContext
  ) as NoteContextType;
  const { selectToolbar, emptiedSelectedNote } = useSelectToolBar();
  const [_, setStatusBar] = useStatusBar();

  const deleteNotes = useMutation(
    async (ids: string[]) => {
      return (await noteService.deleteNotes({ ids })).data.data;
    },
    {
      onSuccess(_, variables) {
        generateChangesId();
        setStatusBar({
          autoClose: 5,
          show: true,
          message: variables?.length + " Note deleted!",
          type: "success",
        });
        emptiedSelectedNote();
      },
      onError(error) {
        setStatusBar({
          show: true,
          message: (error as Error)?.message,
          type: "danger",
        });
      },
    }
  );

  const onDelete = (notes: Note[]) => {
    setStatusBar({
      show: true,
      message: `Deleting ${selectToolbar?.selectedNotes?.length} note`,
      type: "loading",
    });
    deleteNotes.mutateAsync(notes?.map((n) => n.id));
  };

  const onClick = () => {
    fireBridgeEvent(REMOVE_MANY_NOTE_EVENT_DIALOG, {
      notes: selectToolbar?.selectedNotes,
      callback: onDelete,
    });
  };

  return (
    <Button
      loading={deleteNotes?.isLoading}
      onClick={onClick}
      size="icon"
      variant="ghost"
      className="!rounded text-red-500"
      title="Delete"
    >
      <Trash size={16} />
    </Button>
  );
}
