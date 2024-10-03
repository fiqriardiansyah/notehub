"use client";

import { INITIATE_SECURE_NOTE } from "@/components/card-note/setting/initiate-secure-note";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NoteContext, NoteContextType } from "@/context/note";
import { useDesktopMediaQuery, useMobileMediaQuery, useTabletMediaQuery } from "@/hooks/responsive";
import useMenuNoteList, { NoteSetting } from "@/hooks/use-menu-note-list";
import useSidePage from "@/hooks/use-side-page";
import { Note } from "@/models/note";
import React from "react";

export type AttachType = {
  note?: Note;
  children?: any;
};

export default function Attach({ children, note: currentNote }: AttachType) {
  const { note, setNote } = React.useContext(NoteContext) as NoteContextType;
  const settings = useMenuNoteList(currentNote);
  const [setContentSidePage] = useSidePage();
  const isTablet = useTabletMediaQuery();
  const isDesktop = useDesktopMediaQuery();

  const onOpenChange = (val: boolean) => {
    if (!val) {
      setNote((prev) => ({
        ...prev,
        note: null,
      }));
    }
  };

  const isOpen = !!note?.note && note.note?.id === currentNote?.id;

  const handleClickSetting = (setting: NoteSetting) => {
    return () => {
      if (setting.type === "delete") {
        setting.func(currentNote);
        return;
      }
      if (setting.type === "secure_note") {
        setContentSidePage(INITIATE_SECURE_NOTE);
        return;
      }
      setting.func();
    };
  };

  if (isTablet || isDesktop) {
    return (
      <DropdownMenu open={isOpen} onOpenChange={onOpenChange}>
        <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuGroup>
            {settings?.map((Setting) => (
              <DropdownMenuItem
                onClick={handleClickSetting(Setting)}
                key={Setting.text}
                className="cursor-pointer"
                variant={Setting.danger ? "danger" : null}
              >
                <Setting.icon className="mr-2 h-4 w-4" />
                <span>{Setting.text}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
  return null;
}
