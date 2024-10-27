import { FOLDER_NOTE_GROUND } from "@/components/card-note/setting/folder-note";
import {
  CLOSE_SIDE_PANEL,
  OPEN_SIDE_PANEL,
} from "@/components/layout/side-panel";
import { Button } from "@/components/ui/button";
import { NoteContext, NoteContextType } from "@/context/note";
import { WriteStateType } from "@/context/write";
import { fireBridgeEvent } from "@/hooks/use-bridge-event";
import useStatusBar from "@/hooks/use-status-bar";
import noteService, { AddNoteFolderParams } from "@/service/note";
import { useMutation } from "@tanstack/react-query";
import { FolderPlus } from "lucide-react";
import React from "react";
import { useSelectToolBar } from "../provider";

export default function AddFolder() {
  const { generateChangesId } = React.useContext(
    NoteContext
  ) as NoteContextType;
  const { selectToolbar, emptiedSelectedNote } = useSelectToolBar();
  const [_, setStatusBar] = useStatusBar();

  const addNoteToFolderMutate = useMutation(
    [noteService.addNoteToFolder.name],
    async (params: AddNoteFolderParams) => {
      const request = (await noteService.addNoteToFolder(params)).data.data;
      return request;
    },
    {
      onSuccess(_, variables) {
        generateChangesId();
        setStatusBar({
          autoClose: 5,
          show: true,
          message: variables?.noteIds?.length + " Note moved!",
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

  const onAddToFolder = async (payload: {
    folder: WriteStateType["folder"];
  }) => {
    const folder = payload?.folder;
    fireBridgeEvent(CLOSE_SIDE_PANEL, null);
    setStatusBar({
      show: true,
      message:
        `Moving ${selectToolbar?.selectedNotes?.length} notes to folder ` +
        folder?.name,
      type: "loading",
    });

    addNoteToFolderMutate.mutateAsync({
      noteIds: selectToolbar?.selectedNotes?.map((n) => n.id),
      folderId: folder?.id,
      newFolderName: folder?.name,
    });
  };

  const onClick = () => {
    fireBridgeEvent(OPEN_SIDE_PANEL, {
      groundOpen: FOLDER_NOTE_GROUND,
      payload: {
        openAddButton: true,
        callback: onAddToFolder,
      },
    });
  };

  return (
    <Button
      loading={addNoteToFolderMutate.isLoading}
      onClick={onClick}
      size="icon"
      variant="ghost"
      className="!rounded"
      title="Add to folder"
    >
      <FolderPlus size={16} />
    </Button>
  );
}
