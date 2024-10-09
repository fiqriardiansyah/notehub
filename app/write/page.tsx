"use client";

import { BUTTON_SUCCESS_ANIMATION_TRIGGER } from "@/components/animation/button-success";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { NoteContext, NoteContextType } from "@/context/note";
import { WriteContext, WriteContextType } from "@/context/write";
import useStatusBar from "@/hooks/use-status-bar";
import useToggleHideNav from "@/hooks/use-toggle-hide-nav";
import { easeDefault } from "@/lib/utils";
import { CreateNote, ModeNote } from "@/models/note";
import ShowedTags from "@/module/tags/showed-tags";
import noteService from "@/service/note";
import validation from "@/validation";
import { noteValidation } from "@/validation/note";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import React, { useRef } from "react";
import ToolsBar from "./components/tool-bar";
import TodoListModeEditor from "./mode/todolist/index";

const FreetextModeEditor = dynamic(() => import("./mode/freetext").then((mod) => mod.default),
  { ssr: false }
)

const HabitsModeEditor = dynamic(() => import("./mode/habits").then((mod) => mod.default),
  { ssr: false }
)

export default function Write() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { dataNote, setDataNote } = React.useContext(WriteContext) as WriteContextType;
  const { generateChangesId } = React.useContext(NoteContext) as NoteContextType;
  const saveBtnRef = React.useRef<HTMLButtonElement>(null);
  const [_, setStatusBar, resetStatusBar] = useStatusBar();
  const { toast } = useToast();
  const isNavHide = useToggleHideNav();
  const typeDefault = searchParams.get("type") as ModeNote;

  React.useEffect(() => {
    if (!typeDefault) return;
    if (typeDefault === "freetext" || typeDefault === "todolist" || typeDefault === "habits") {
      setDataNote((prev) => ({
        ...prev,
        modeWrite: typeDefault,
      }));
    };
  }, []);

  const saveMutate = useMutation(
    async (data: CreateNote) => {
      return (await noteService.createNote(data)).data.data;
    },
    {
      onError(error: any) {
        toast({
          title: "Error",
          description: error?.message,
          variant: "destructive",
        });
      },
    }
  );

  const onClickBack = () => {
    router.back();
  }

  const saveWrite = async (restData: any) => {
    let data = {
      title: dataNote?.title,
      type: dataNote.modeWrite,
      isSecure: dataNote?.isSecure,
      tags: dataNote?.tags,
      ...restData,
    } as CreateNote;

    try {
      resetStatusBar();
      validation(noteValidation.CREATE, data as any);
      saveMutate.mutateAsync(data as CreateNote).then(() => {
        setDataNote({ modeWrite: dataNote.modeWrite });
        window.dispatchEvent(new CustomEvent(BUTTON_SUCCESS_ANIMATION_TRIGGER + "button-save-write"));
        generateChangesId();
        router.push("/");
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
  }

  return (
    <div className="flex flex-col">
      <motion.div
        style={{ pointerEvents: isNavHide ? "none" : "auto" }}
        animate={{ y: isNavHide ? "-100%" : 0 }}
        transition={{ ease: easeDefault }}
        className="w-full flex items-center container-custom z-10 justify gap-3 py-1 sticky top-0 left-0 bg-white">
        <div className="flex flex-row items-center flex-1 w-full">
          <div className="mr-3">
            <Button onClick={onClickBack} size="icon" variant="ghost" className="!w-10">
              <ChevronLeft />
            </Button>
          </div>
          <p>Create new {dataNote.modeWrite}</p>
        </div>
      </motion.div>
      <div className="w-full overflow-x-hidden container-read lg:flex-1 bg-white overflow-y-auto min-h-screen pb-20 lg:!px-10">
        <input
          value={dataNote?.title}
          onChange={onChangeTitle}
          autoFocus={true}
          type="text"
          placeholder="Title ..."
          className="text-2xl w-full font-medium border-none focus:outline-none outline-none bg-transparent mb-8"
        />
        {dataNote.tags?.length ? (
          <div className="">
            <h1 className="text-2xl font-light mb-3 underline w-fit">Tags</h1>
            <ShowedTags className="my-5 sm:!flex-wrap" />
          </div>
        ) : null}
        {dataNote.modeWrite === "freetext" && <FreetextModeEditor onSave={saveWrite}>
          <button ref={saveBtnRef} type="submit">submit</button>
        </FreetextModeEditor>}
        {dataNote.modeWrite === "todolist" && <TodoListModeEditor onSave={saveWrite}>
          <button ref={saveBtnRef} type="submit">submit</button>
        </TodoListModeEditor>}
        {dataNote.modeWrite === "habits" && <HabitsModeEditor onSave={saveWrite}>
          <button ref={saveBtnRef} type="submit">submit</button>
        </HabitsModeEditor>}
      </div>
      <div className="flex justify-center fixed sm:absolute z-40 sm:bottom-2 bottom-0 left-0 sm:left-1/2 transform sm:-translate-x-1/2 w-full sm:w-fit sm:bg-white sm:rounded-full sm:shadow-xl">
        <ToolsBar
          excludeSettings={dataNote.modeWrite === "habits" ? ["folder", "delete", "collabs", "secure"] : ["delete", "collabs"]}
          isLoading={saveMutate.isLoading}
          save={onSaveClick} />
      </div>
    </div>
  );
}
