"use client";

import CardNote from "@/components/card-note";
import {
  REMOVE_FOLDER_EVENT_DIALOG,
  REMOVE_FOLDER_EVENT_FAILED,
  REMOVE_FOLDER_EVENT_SUCCESS,
} from "@/app/folder/components/delete-folder";
import LayoutGrid from "@/components/layout-grid";
import {
  CLOSE_SIDE_PANEL,
  OPEN_SIDE_PANEL,
} from "@/components/layout/side-panel";
import {
  PICK_NOTES,
  PICK_NOTES_SUBMIT,
  usePickNotes,
} from "@/components/pick-notes";
import SettingNoteDrawer from "@/components/setting-note-drawer";
import StateRender from "@/components/state-render";
import ToolBar from "@/components/tool-bar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { NoteContext, NoteContextType } from "@/context/note";
import { fireBridgeEvent, useBridgeEvent } from "@/hooks/use-bridge-event";
import useStatusBar from "@/hooks/use-status-bar";
import useToggleHideNav from "@/hooks/use-toggle-hide-nav";
import { easeDefault, pause } from "@/lib/utils";
import { DetailFolder, Note, Tag } from "@/models/note";
import noteService from "@/service/note";
import { useMutation, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ChevronLeft, Pencil, Plus, Trash } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import { useParams } from "next/navigation";
import React from "react";
import FormTitle from "../components/form-title";
import { SelectToolBarProvider } from "@/components/select-tool-bar.tsx/provider";
import SelectToolbar from "@/components/select-tool-bar.tsx";

export default function FolderPage() {
  const { id } = useParams();
  const router = useRouter();

  const {
    generateChangesId,
    note: { changesRandomId },
  } = React.useContext(NoteContext) as NoteContextType;

  const [edit, setEdit] = React.useState({
    isEdit: false,
    tempTitle: "",
  });
  const pickNotes = usePickNotes();
  const [_, setStatusBar] = useStatusBar();
  const isNavHide = useToggleHideNav();
  const [orderList, setOrderList] = React.useState<"desc" | "asc">("desc");
  const [filterTag, setFilterTag] = React.useState<Tag[]>([]);

  const detailFolderQuery = useQuery(
    [noteService.getFolderAndContent.name, id, changesRandomId],
    async () => {
      return (await noteService.getFolderAndContent(id as string)).data.data;
    },
    {
      onSuccess(data) {
        if (!data) {
          router.back();
          return;
        }
        setEdit((prev) => ({ ...prev, tempTitle: data?.folder?.title }));
      },
    }
  );

  const addNoteToFolderMutate = useMutation(
    [noteService.addNoteToFolder.name],
    async (ids: string[]) => {
      const request = (
        await noteService.addNoteToFolder({
          noteIds: ids,
          folderId: id as string,
        })
      ).data.data;
      await pause(3);
      return request;
    }
  );

  const onClickBack = () => {
    router.back();
  };

  const onClickEdit = () => {
    setEdit((prev) => ({ ...prev, isEdit: true }));
  };

  const onClickDiscard = () => {
    setEdit((prev) => ({ ...prev, isEdit: false }));
  };

  const onClickAddNotes = () => {
    fireBridgeEvent(OPEN_SIDE_PANEL, {
      groundOpen: PICK_NOTES,
    });
  };

  useBridgeEvent(PICK_NOTES_SUBMIT, (pickedNotes: Note[]) => {
    fireBridgeEvent(CLOSE_SIDE_PANEL, null);

    if (addNoteToFolderMutate.isLoading) return;
    pickNotes.hideNotes(pickedNotes);
    addNoteToFolderMutate
      .mutateAsync(pickedNotes.map((n) => n.id))
      .then(() => {
        detailFolderQuery.refetch();
        pickNotes.notesQuery.refetch();
        pickNotes.resetPickedNotes();
        pickNotes.hideNotes([]);
        generateChangesId();
      })
      .catch((e: any) => {
        pickNotes.hideNotes([]);
        pickNotes.setPickedNotes(pickedNotes);
        setStatusBar({
          type: "danger",
          show: true,
          message: e?.message,
        });
      });
  });

  const notes = () => {
    if (addNoteToFolderMutate.isLoading || detailFolderQuery.isLoading) {
      return [
        ...pickNotes.pickedNotes,
        ...(detailFolderQuery.data?.notes || []),
      ];
    }
    return detailFolderQuery.data?.notes?.sort((a, b) => {
      if (orderList === "desc") {
        return (
          new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
        );
      }
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  };

  const onClickDelete = () => {
    fireBridgeEvent(REMOVE_FOLDER_EVENT_DIALOG, detailFolderQuery.data);
  };

  const onClickModified = () => {
    setOrderList((prev) => (prev === "desc" ? "asc" : "desc"));
  };

  useBridgeEvent(REMOVE_FOLDER_EVENT_SUCCESS, (payload: DetailFolder) => {
    setStatusBar({
      type: "success",
      show: true,
      message: "Folder " + payload.folder?.title + " delete success",
      autoClose: 5,
    });
    router.replace("/");
  });

  useBridgeEvent(REMOVE_FOLDER_EVENT_FAILED, (payload: string) => {
    setStatusBar({
      type: "danger",
      show: true,
      message: payload,
    });
  });

  const listNote = notes();

  const tags = listNote
    ?.map((item) => item.tags)
    .filter(Boolean)
    .flat() as Tag[];

  const filteredItems = listNote?.filter((i) => {
    if (!filterTag.length) return true;
    return !!i.tags?.find((t) => !!filterTag.find((tag) => tag.id === t.id));
  });

  return (
    <SelectToolBarProvider notes={listNote}>
      {(context) => (
        <div className="container-custom pb-20 min-h-screen bg-white">
          <div className="w-full flex bg-white items-center gap-3 z-20">
            <Button
              onClick={onClickBack}
              title="Back"
              size="icon"
              variant="ghost"
              className="!w-10"
            >
              <ChevronLeft />
            </Button>
            {detailFolderQuery.isLoading ? (
              <p className="font-medium line-clamp-1 capitalize">
                Getting Detail...
              </p>
            ) : !edit.isEdit ? (
              <p className="font-medium line-clamp-1 capitalize">
                {edit?.tempTitle}
              </p>
            ) : (
              <FormTitle
                title={edit.tempTitle}
                onDiscard={onClickDiscard}
                refetch={detailFolderQuery.refetch}
                setEdit={setEdit}
              />
            )}
          </div>
          <div
            className={`${edit.isEdit ? "blur-sm pointer-events-none" : ""}`}
          >
            <div className="w-full sticky z-10 top-0 left-0 bg-white">
              {context?.selectToolbar?.selectedNotes?.length ? (
                <SelectToolbar tools={["deleted", "remove_folder"]} />
              ) : (
                <ToolBar
                  filterTag={filterTag}
                  setFilterTag={setFilterTag}
                  tags={tags}
                  order={orderList}
                  onClickModified={onClickModified}
                  rightAddition={() => (
                    <>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={onClickAddNotes}
                        title="Add Note"
                        className="!rounded"
                      >
                        <Plus size={16} strokeWidth={1.25} />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={onClickDelete}
                        title="Delete Folder"
                        className="!rounded"
                      >
                        <Trash
                          className="text-red-500"
                          size={16}
                          strokeWidth={1.25}
                        />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={onClickEdit}
                        title="Edit Folder"
                        className="!rounded"
                      >
                        <Pencil size={16} strokeWidth={1.25} />
                      </Button>
                    </>
                  )}
                />
              )}
            </div>
            <StateRender
              data={detailFolderQuery.data}
              isLoading={detailFolderQuery.isLoading}
            >
              <StateRender.Data>
                <div className="w-full my-7">
                  <LayoutGrid items={filteredItems}>
                    {(item) => (
                      <CardNote
                        note={item as Note}
                        key={item.id}
                        attachMenu={(note) => (
                          <SettingNoteDrawer.Attach note={note} />
                        )}
                      />
                    )}
                  </LayoutGrid>
                  {!listNote?.length && (
                    <div className="min-h-[250px] flex items-center justify-center gap-3">
                      <div className="text-center text-sm">
                        Ooops, there is no notes in this folder 😴
                        <br />
                        <span
                          onClick={onClickAddNotes}
                          role="button"
                          className="!text-blue-500"
                          tabIndex={0}
                        >
                          Import Note
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </StateRender.Data>
              <StateRender.Loading>
                <Skeleton className="w-[300px] h-[50px]" />
                <Skeleton className="w-[350px] h-[20px] mt-6" />
                <Skeleton className="w-[200px] h-[20px] mt-3" />
              </StateRender.Loading>
            </StateRender>
          </div>
          <SettingNoteDrawer.BottomSheet refetch={detailFolderQuery.refetch} />
        </div>
      )}
    </SelectToolBarProvider>
  );
}
