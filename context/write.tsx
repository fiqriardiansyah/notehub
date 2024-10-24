import { UPDATE_PROGRESS_PROCESS } from "@/components/status-bar/progress";
import { fireBridgeEvent } from "@/hooks/use-bridge-event";
import useProcess from "@/hooks/use-process";
import { FileInfo } from "@/hooks/use-upload-file";
import { CreateNote, ModeNote, Tag } from "@/models/note";
import noteService from "@/service/note";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import React from "react";

export type WriteStateType = {
  authorized?: boolean;
  isSecure?: boolean;
  tags?: Tag[];
  title?: string;
  folder?: {
    id?: string;
    name?: string;
  };
  modeWrite?: ModeNote;
  scheduler?: {
    type: "day" | "weekly" | "monthly";
    days?: string[];
    startTime?: string;
    endTime?: string;
  };
  files?: FileInfo[];
  images?: FileInfo[];
};

export type WriteContextType = {
  dataNote: WriteStateType;
  setDataNote: React.Dispatch<React.SetStateAction<WriteStateType | undefined>>;
  saveMutate: UseMutationResult<
    any,
    any,
    {
      note: CreateNote;
      id: string;
    },
    unknown
  >;
  updateMutate: UseMutationResult<
    any,
    any,
    {
      note: CreateNote;
      id: string;
    },
    unknown
  >;
};

export const WriteContext = React.createContext({});

export const ON_SAVE_SUCCESS = "onSaveSuccess";
export const ON_UPDATE_SUCCESS = "onUpdateSuccess";

export const WriteProvider = ({ children }: { children: any }) => {
  const pathname = usePathname();
  const [dataNote, setDataNote] = React.useState<WriteStateType>({
    modeWrite: "freetext",
  });
  const { setProcess, updateProcess } = useProcess();

  const onUploadProgress = (event: any, id: string) => {
    const percentCompleted = Math.round((event.loaded * 100) / event.total);
    fireBridgeEvent(UPDATE_PROGRESS_PROCESS + "_" + id, {
      val: percentCompleted,
    });
  };

  const saveMutate = useMutation(
    async (data: { note: CreateNote; id: string }) => {
      setProcess({
        id: data.id,
        nameOfProcess: "Creating " + data.note.title,
        type: "progress",
        putInFloatingStack: true,
      });
      (
        await noteService.createNote(data.note, {
          onUploadProgress: (event) => onUploadProgress(event, data.id),
        })
      ).data.data;
      return { idProcess: data.id };
    },
    {
      onSuccess(_, variable) {
        updateProcess(variable.id, {
          type: "success",
          nameOfProcess: `Done creating ${variable.note.title}`,
        });
        fireBridgeEvent(ON_SAVE_SUCCESS, { processId: variable.id });
      },
      onError(error: any, variable) {
        updateProcess(variable.id, {
          type: "danger",
          nameOfProcess: `${variable.note.title}: ${error?.message}`,
        });
      },
    }
  );

  const updateMutate = useMutation(
    async (data: { note: CreateNote; id: string }) => {
      setProcess({
        id: data.id,
        nameOfProcess: "Updating " + data.note.title,
        type: "progress",
        putInFloatingStack: true,
      });
      const request = (
        await noteService.updateNote(data.note, data.id, {
          onUploadProgress: (event) => onUploadProgress(event, data.id),
        })
      ).data.data;
      return request;
    },
    {
      onSuccess(_, variable) {
        updateProcess(variable.id, {
          type: "success",
          nameOfProcess: `Done updating ${variable.note.title}`,
        });
        fireBridgeEvent(ON_UPDATE_SUCCESS, { processId: variable.id });
      },
      onError(error: any, variable) {
        updateProcess(variable.id, {
          type: "danger",
          nameOfProcess: `${variable.note.title}: ${error?.message}`,
        });
      },
    }
  );

  React.useEffect(() => {
    setDataNote((prev) => ({
      modeWrite: prev.modeWrite,
    }));
  }, [pathname]);

  const value = {
    dataNote,
    setDataNote,
    saveMutate,
    updateMutate,
  };

  return (
    <WriteContext.Provider value={value}>{children}</WriteContext.Provider>
  );
};
