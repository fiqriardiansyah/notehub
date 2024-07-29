"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { NoteContext, NoteContextType } from "@/context/note";
import useSettingList from "@/hooks/use-setting-list";
import React from "react";
import { useMediaQuery } from "react-responsive";

export default function BottomSheet() {
  const { note, setNote } = React.useContext(NoteContext) as NoteContextType;
  const isBigScreen = useMediaQuery({ query: "(max-width: 600px)" });

  const settings = useSettingList(note?.note);

  const onOpenChange = (val: boolean) => {
    if (!val) {
      setNote((prev) => ({
        ...prev,
        note: null,
      }));
    }
  };

  const isOpen = !!note?.note && isBigScreen;

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="z-50">
        <DrawerHeader>
          <DrawerTitle className="capitalize">{note?.note?.title}</DrawerTitle>
        </DrawerHeader>
        <div className="flex flex-col p-4 gap-3">
          {settings?.map((Setting) => (
            <Button
              key={Setting.text}
              onClick={Setting.func}
              className="flex items-center gap-3"
              variant={Setting.danger ? "destructive" : "ghost"}
            >
              <Setting.icon />
              {Setting.text}
            </Button>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
