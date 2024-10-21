"use client";

import { LEAVE_PROJECT } from "@/components/card-note-collab/setting/leave";
import { CommonContext, CommonContextType } from "@/context/common";
import { NoteContext, NoteContextType } from "@/context/note";
import { fireBridgeEvent } from "@/hooks/use-bridge-event";
import useMenuNoteCollabList, {
  CollaborateSetting,
} from "@/hooks/use-menu-note-collab-list";
import { NoteSetting } from "@/hooks/use-menu-note-list";
import useProcess from "@/hooks/use-process";
import useStatusBar from "@/hooks/use-status-bar";
import { CollaborateProject } from "@/models/collab";
import collabService from "@/service/collab";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import BottomSheet from "./bottom-sheet";
import Attach from "./attach";
import { HELPER_PANEL_EXIT } from "@/components/layout/helper-panel";

export type WithFunctionalityHOCProps = {
  settings: NoteSetting[];
  onOpenChange: (val: boolean) => void;
  handleClickSetting: (setting: NoteSetting) => () => void;
  isLoading: (setting?: NoteSetting) => boolean;
  isOpen: boolean;
  currentNote?: CollaborateProject;
};

export default function SettingNoteCollabDrawer() {}

export function withFunctionality(WrappedComponent: React.ComponentType<any>) {
  const Component = (props: any) => {
    const { common } = React.useContext(CommonContext) as CommonContextType;
    const { note, setNote, generateChangesId } = React.useContext(
      NoteContext
    ) as NoteContextType;

    const currentNote = note?.note as unknown as CollaborateProject;
    const isOpen = !!currentNote && !common?.sidePageOpen;

    const settings = useMenuNoteCollabList(currentNote);

    const { setProcess, finishProcess } = useProcess();
    const [_, setStatusBar] = useStatusBar();

    const onOpenChange = (val: boolean) => {
      if (common?.sidePageOpen) return;
      if (!val) {
        setNote((prev) => ({
          ...prev,
          note: null,
        }));
      }
    };

    const leaveMutate = useMutation(
      async (id: string) => (await collabService.leaveProject(id)).data.data
    );

    const leaveProjectCallback = async (collabProject: CollaborateProject) => {
      setStatusBar({
        type: "loading",
        show: true,
        message: `Leave the ${collabProject?.title} project`,
      });
      setProcess({
        id: collabProject.id,
        nameOfProcess: "Leaving project " + currentNote?.title + "...",
      });
      try {
        await leaveMutate.mutateAsync(collabProject?.collaborateId as string);
        setStatusBar({
          type: "success",
          show: true,
          message: "Project has been left",
          autoClose: 5,
        });
        setNote((prev) => ({ ...prev, note: null }));
        finishProcess(collabProject.id);
        generateChangesId();
        fireBridgeEvent(HELPER_PANEL_EXIT, null);
      } catch (e: any) {
        setStatusBar({ type: "danger", show: true, message: e?.message });
      }
    };

    const handleClickSetting = (setting: CollaborateSetting) => {
      return () => {
        if (setting.type === "leave_project") {
          fireBridgeEvent(LEAVE_PROJECT, {
            note: currentNote,
            callback: leaveProjectCallback,
          });
        }
      };
    };

    const isLoading = (setting?: CollaborateSetting) => {
      if (!setting) {
        return leaveMutate.isLoading;
      }
      if (setting?.type === "leave_project") return leaveMutate.isLoading;
      return false;
    };

    const allProps = {
      ...props,
      settings,
      handleClickSetting,
      isLoading,
      onOpenChange,
      isOpen,
      currentNote,
    };

    return <WrappedComponent {...allProps} />;
  };

  return Component;
}

SettingNoteCollabDrawer.Attach = withFunctionality(Attach);
SettingNoteCollabDrawer.BottomSheet = withFunctionality(BottomSheet);
