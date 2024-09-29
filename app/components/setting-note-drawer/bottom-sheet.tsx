"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { NoteContext, NoteContextType } from "@/context/note";
import useSecureNote from "@/hooks/use-secure-note";
import useMenuNoteList, { NoteSetting } from "@/hooks/use-menu-note-list";
import useSidePage from "@/hooks/use-side-page";
import useStatusBar from "@/hooks/use-status-bar";
import { CreateNote } from "@/models/note";
import noteService from "@/service/note";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bookmark, ChevronRight, LockKeyhole } from "lucide-react";
import React from "react";
import { useMediaQuery } from "react-responsive";
import { FOLDER_NOTE_GROUND, FOLDER_NOTE_SAVE } from "@/app/components/card-note/setting/folder-note";
import { INITIATE_SECURE_NOTE } from "@/app/components/card-note/setting/initiate-secure-note";
import { SECURE_NOTE } from "@/app/components/card-note/setting/secure-note";
import { COLLABS_NOTE_GROUND } from "@/app/components/card-note/setting/collabs";

export type BottomSheet = {
  refetch?: () => void;
}

export default function BottomSheet({ refetch }: BottomSheet) {
  const { note, setNote } = React.useContext(NoteContext) as NoteContextType;
  const isBigScreen = useMediaQuery({ query: "(max-width: 600px)" });
  const settings = useMenuNoteList(note?.note);
  const [setSidePage, resetSidePage, isSidePageOpen] = useSidePage();
  const queryClient = useQueryClient();
  const [_, setStatusBar] = useStatusBar();

  const isOpen = !!note?.note && isBigScreen && !isSidePageOpen;

  const updateNoteMutate = useMutation(
    [noteService.updateNote.name],
    async (data: Partial<CreateNote> & { typeProcess: NoteSetting["type"] }) => {
      return (await noteService.updateNote(data, note.note!.id)).data.data;
    }
  );

  const { checkHasPassNote } = useSecureNote({
    onInitiateSecure() {
      setSidePage(SECURE_NOTE);
    },
    onSecure(isPasswordCorrect) {
      if (isPasswordCorrect) {
        updateNoteMutate.mutateAsync({ isSecure: true, typeProcess: "secure_note" }).then(async () => {
          await queryClient.refetchQueries({ queryKey: [noteService.getNote.name] });
          resetSidePage();
          setNote((prev) => ({ ...prev, note: null }));
          setStatusBar({
            autoClose: 5,
            show: true,
            icon: <LockKeyhole className="text-sm" />,
            message: "Your note now secured! 😎",
            type: "success"
          });
        });
      }
    },
  });

  const onOpenChange = (val: boolean) => {
    if (isSidePageOpen) return;
    if (!val) {
      setNote((prev) => ({
        ...prev,
        note: null,
      }));
    }
  };

  const handleClickSetting = (setting: NoteSetting) => {
    return () => {
      if (setting.type === "delete") {
        setting.func(note);
        return;
      }
      if (setting.type === "secure_note") {
        checkHasPassNote.mutateAsync().then((isHasPassword) => {
          if (!isHasPassword) {
            setSidePage(INITIATE_SECURE_NOTE);
            return;
          }

          setSidePage(SECURE_NOTE);
        });
        return;
      }
      if (setting.type === "hang_note" || setting.type === "unhang_note") {
        const currentHang = note?.note?.isHang;
        updateNoteMutate.mutateAsync({ isHang: !currentHang, typeProcess: "hang_note" }).then(async () => {
          if (!currentHang) {
            setStatusBar({
              autoClose: 5,
              show: true,
              icon: <Bookmark className="text-sm" />,
              message: "Hang Note 📒",
              type: "success"
            });
          }
          await queryClient.refetchQueries();
          setNote((prev) => ({ ...prev, note: null }));
        });
        return;
      }
      if (setting.type === "add_folder") {
        setSidePage(FOLDER_NOTE_GROUND);
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent(FOLDER_NOTE_GROUND));
        }, 700);
        window.addEventListener(FOLDER_NOTE_SAVE, (e: any) => {
          resetSidePage();
          const folder = e.detail?.folder;
          setStatusBar({
            show: true,
            message: "Moving note to folder...",
            type: "loading"
          });
          updateNoteMutate.mutateAsync({ typeProcess: "add_folder", folderId: folder?.id, newFolder: { title: folder?.name } }).then(async () => {
            if (refetch) refetch();
            setNote((prev) => ({ ...prev, note: null }));
            setStatusBar({
              autoClose: 5,
              show: true,
              message: "Note moved!",
              type: "success"
            });
          }).catch((e) => {
            setStatusBar({
              show: true,
              message: e?.message,
              type: "danger"
            });
          })
        });
      }
      if (setting.type === "remove_folder") {
        updateNoteMutate.mutateAsync({ folderId: "remove", typeProcess: "remove_folder" }).then(async () => {
          if (refetch) refetch();
          setNote((prev) => ({ ...prev, note: null }));
        });
      }
      if (setting.type === "collabs") {
        setSidePage(COLLABS_NOTE_GROUND, note?.note);
      }

      setting.func();
    };
  };

  const isLoading = (setting: NoteSetting) => {
    if (setting.type === "secure_note") return checkHasPassNote.isLoading;
    if (setting.type === "hang_note") return updateNoteMutate.isLoading && updateNoteMutate.variables?.typeProcess === "hang_note";
    if (setting.type === "add_folder") return updateNoteMutate.isLoading && updateNoteMutate.variables?.typeProcess === "add_folder";
    if (setting.type === "remove_folder") return updateNoteMutate.isLoading && updateNoteMutate.variables?.typeProcess === "remove_folder";
    return false;
  }

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="z-50">
        <DrawerHeader>
          <DrawerTitle className="capitalize">{note?.note?.title}</DrawerTitle>
        </DrawerHeader>
        <div className="flex flex-col p-4 gap-3">
          {settings?.map((Setting) => (
            <Button
              loading={isLoading(Setting)}
              key={Setting.text}
              onClick={handleClickSetting(Setting)}
              className="flex items-center gap-3 justify-between"
              variant={Setting.danger ? "destructive" : "ghost"}
            >
              <div className="flex items-center gap-3 flex-1">
                <Setting.icon />
                {Setting.text}
              </div>
              {Setting?.rightElement ? Setting?.rightElement : <ChevronRight />}
            </Button>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
