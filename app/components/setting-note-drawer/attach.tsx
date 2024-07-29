"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NoteContext, NoteContextType } from "@/context/note";
import useSettingList, { NoteSetting } from "@/hooks/use-setting-list";
import { Note } from "@/models/note";
import React from "react";
import { useMediaQuery } from "react-responsive";

export type AttachType = {
  note?: Note;
  children?: any;
};

export default function Attach({ children, note: currentNote }: AttachType) {
  const { note, setNote } = React.useContext(NoteContext) as NoteContextType;
  const isSmallScreen = useMediaQuery({ query: "(min-width: 600px)" });
  const settings = useSettingList(currentNote);

  const onOpenChange = (val: boolean) => {
    if (!val) {
      setNote((prev) => ({
        ...prev,
        note: null,
      }));
    }
  };

  const isOpen =
    !!note?.note && note.note?.id === currentNote?.id && isSmallScreen;

  const handleClickSetting = (setting: NoteSetting) => {
    return () => {
      if (setting.type === "delete") {
        setting.func(currentNote);
        return;
      }
      setting.func();
    };
  };

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
  );
}
