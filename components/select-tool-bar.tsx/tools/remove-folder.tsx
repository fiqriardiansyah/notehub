import { Button } from "@/components/ui/button";
import { NoteContext, NoteContextType } from "@/context/note";
import useStatusBar from "@/hooks/use-status-bar";
import noteService from "@/service/note";
import { useMutation } from "@tanstack/react-query";
import { FolderOutput } from "lucide-react";
import React from "react";
import { useSelectToolBar } from "../provider";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function RemoveFolder() {
  const { generateChangesId } = React.useContext(
    NoteContext
  ) as NoteContextType;
  const { selectToolbar, emptiedSelectedNote } = useSelectToolBar();
  const [_, setStatusBar] = useStatusBar();

  const removeNoteFromFolderMutate = useMutation(
    [noteService.removeNoteFromFolder.name],
    async (noteIds: string[]) => {
      const request = (await noteService.removeNoteFromFolder({ noteIds })).data
        .data;
      return request;
    },
    {
      onSuccess(_, variables) {
        generateChangesId();
        setStatusBar({
          autoClose: 5,
          show: true,
          message: variables?.length + " Note moved!",
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

  const onContinue = () => {
    setStatusBar({
      show: true,
      message: `Moving ${selectToolbar?.selectedNotes?.length} notes out of folder`,
      type: "loading",
    });
    removeNoteFromFolderMutate.mutateAsync(
      selectToolbar?.selectedNotes?.map((n) => n?.id)
    );
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          loading={removeNoteFromFolderMutate.isLoading}
          size="icon"
          variant="ghost"
          className="!rounded"
          title="Remove from folder"
        >
          <FolderOutput size={16} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            {selectToolbar?.selectedNotes?.length} Item(s) will be remove from
            this folder
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onContinue}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
