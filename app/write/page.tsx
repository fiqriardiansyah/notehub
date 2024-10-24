"use client";

import { BUTTON_SUCCESS_ANIMATION_TRIGGER } from "@/components/animation/button-success";
import ListFile from "@/components/file/list-file";
import ListImage from "@/components/file/list-image";
import { Button } from "@/components/ui/button";
import { NoteContext, NoteContextType } from "@/context/note";
import {
  ON_SAVE_SUCCESS,
  WriteContext,
  WriteContextType,
} from "@/context/write";
import { useBridgeEvent } from "@/hooks/use-bridge-event";
import useProcess from "@/hooks/use-process";
import useStatusBar from "@/hooks/use-status-bar";
import useToggleHideNav from "@/hooks/use-toggle-hide-nav";
import { CreateNote, ModeNote } from "@/models/note";
import ShowedTags from "@/module/tags/showed-tags";
import validation from "@/validation";
import { noteValidation } from "@/validation/note";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import dynamic from "next/dynamic";
import { usePathname, useSearchParams } from "next/navigation";
import React from "react";
import { v4 as uuid } from "uuid";
import ToolsBar from "./components/tool-bar";
import TopToolBar from "./components/top-tool-bar";
import TodoListModeEditor from "./mode/todolist/index";

const FreetextModeEditor = dynamic(
  () => import("./mode/freetext").then((mod) => mod.default),
  { ssr: false }
);

const HabitsModeEditor = dynamic(
  () => import("./mode/habits").then((mod) => mod.default),
  { ssr: false }
);

export default function Write() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { dataNote, setDataNote, saveMutate } = React.useContext(
    WriteContext
  ) as WriteContextType;
  const { generateChangesId } = React.useContext(
    NoteContext
  ) as NoteContextType;
  const saveBtnRef = React.useRef<HTMLButtonElement>(null);
  const idForProcessRef = React.useRef(uuid());
  const [_, setStatusBar, resetStatusBar] = useStatusBar();
  const isNavHide = useToggleHideNav();
  const { allProcess } = useProcess();
  const typeDefault = searchParams.get("type") as ModeNote;
  const currentProcess = allProcess?.find(
    (process) => process.id === idForProcessRef.current
  );

  React.useEffect(() => {
    if (!typeDefault) return;
    if (
      typeDefault === "freetext" ||
      typeDefault === "todolist" ||
      typeDefault === "habits"
    ) {
      setDataNote((prev) => ({
        ...prev,
        modeWrite: typeDefault,
      }));
    }
  }, []);

  const onClickBack = () => {
    router.back();
  };

  useBridgeEvent(ON_SAVE_SUCCESS, (payload: { processId: string }) => {
    generateChangesId();
    if (
      pathname === "/write" &&
      payload.processId === idForProcessRef.current
    ) {
      setDataNote({ modeWrite: dataNote.modeWrite });
      window.dispatchEvent(
        new CustomEvent(BUTTON_SUCCESS_ANIMATION_TRIGGER + "button-save-write")
      );
      router.push("/");
    }
  });

  const saveWrite = async (restData: any) => {
    let data = {
      title: dataNote?.title,
      type: dataNote.modeWrite,
      isSecure: dataNote?.isSecure,
      tags: dataNote?.tags,
      images: dataNote?.images?.map((img) => ({
        base64: img.base64,
        contentType: img.contentType,
        name: img.name,
        sizeInMb: img.sizeInMb,
      })),
      files: dataNote?.files?.map((file) => ({
        base64: file.base64,
        contentType: file.contentType,
        name: file.name,
        sizeInMb: file.sizeInMb,
      })),
      ...restData,
    } as CreateNote;

    try {
      resetStatusBar();
      validation(noteValidation.CREATE, data as any);
      saveMutate
        .mutateAsync({ note: data as CreateNote, id: idForProcessRef.current })
        .catch(() => {
          idForProcessRef.current = uuid();
        });
    } catch (e: any) {
      setStatusBar({
        type: "danger",
        show: true,
        message: e?.message,
      });
    }
  };

  const onSaveClick = () => {
    if (!saveBtnRef.current) return;
    saveBtnRef.current.click();
  };

  const onChangeTitle = (e: any) => {
    const val = e.target.value as string;
    setDataNote((prev) => ({ ...prev, title: val }));
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-row flex-1 w-full items-center container-custom z-10 justify gap-3 py-1 sticky top-0 left-0 bg-white">
        <div className="mr-3">
          <Button
            onClick={onClickBack}
            title="Back"
            size="icon"
            variant="ghost"
            className="!w-10"
          >
            <ChevronLeft />
          </Button>
        </div>
        <TopToolBar />
      </div>
      <div className="w-full container-read lg:flex-1 mt-10 bg-white overflow-y-auto min-h-screen pb-20 lg:!px-10">
        <input
          value={dataNote?.title}
          onChange={onChangeTitle}
          autoFocus={true}
          type="text"
          placeholder="Title ..."
          className="text-2xl w-full font-medium border-none focus:outline-none outline-none bg-transparent mb-5"
        />
        {dataNote.tags?.length ? (
          <div className="">
            <p className="text-xs text-gray-400 font-light mb-2 w-fit">Tags</p>
            <ShowedTags className="my-5 sm:!flex-wrap" />
          </div>
        ) : null}
        {dataNote.modeWrite === "freetext" && (
          <FreetextModeEditor onSave={saveWrite}>
            <button ref={saveBtnRef} type="submit">
              submit
            </button>
          </FreetextModeEditor>
        )}
        {dataNote.modeWrite === "todolist" && (
          <TodoListModeEditor onSave={saveWrite}>
            <button ref={saveBtnRef} type="submit">
              submit
            </button>
          </TodoListModeEditor>
        )}
        {dataNote.modeWrite === "habits" && (
          <HabitsModeEditor onSave={saveWrite}>
            <button ref={saveBtnRef} type="submit">
              submit
            </button>
          </HabitsModeEditor>
        )}
        <div className="h-6"></div>
        <ListImage canEdit />
        <div className="h-6"></div>
        <ListFile canEdit />
      </div>
      <div className="flex justify-center fixed sm:absolute z-40 sm:bottom-2 bottom-0 left-0 sm:left-1/2 transform sm:-translate-x-1/2 w-full sm:w-fit sm:bg-white sm:rounded-full sm:shadow-xl">
        <ToolsBar
          excludeSettings={
            dataNote.modeWrite === "habits"
              ? ["folder", "delete", "collabs", "secure"]
              : ["delete", "collabs"]
          }
          isLoading={currentProcess?.type === "progress"}
          save={onSaveClick}
        />
      </div>
    </div>
  );
}
