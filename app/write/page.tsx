"use client";

import { BUTTON_SUCCESS_ANIMATION_TRIGGER } from "@/components/animation/button-success";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { WriteContext, WriteContextType } from "@/context/write";
import useStatusBar from "@/hooks/use-status-bar";
import { shortCut } from "@/lib/shortcut";
import { CreateNote } from "@/models/note";
import ShowedTags from "@/module/tags/showed-tags";
import noteService from "@/service/note";
import validation from "@/validation";
import { noteValidation } from "@/validation/note";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import React, { useRef } from "react";
import ToolsBar from "./components/tool-bar";
import dynamic from "next/dynamic";
import TodoListModeEditor from "./mode/todolist/index";
import useToggleHideNav from "@/hooks/use-toggle-hide-nav";
import { easeDefault } from "@/lib/utils";

const FreetextModeEditor = dynamic(() => import("./mode/freetext").then((mod) => mod.default),
  { ssr: false }
)

const HabitsModeEditor = dynamic(() => import("./mode/habits").then((mod) => mod.default),
  { ssr: false }
)

export default function Write() {
  const router = useRouter();
  const { dataNote, setDataNote } = React.useContext(WriteContext) as WriteContextType;
  const titleRef = useRef<HTMLInputElement | null>(null);
  const saveBtnRef = React.useRef<HTMLButtonElement>(null);
  const [_, setStatusBar] = useStatusBar();
  const { toast } = useToast();
  const isNavHide = useToggleHideNav();

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
      title: titleRef.current?.value,
      type: dataNote.modeWrite,
      isSecure: dataNote?.isSecure,
      tags: dataNote?.tags,
      ...restData,
    } as CreateNote;

    try {
      validation(noteValidation.CREATE, data as any);
      saveMutate.mutateAsync(data as CreateNote).then(() => {
        setDataNote({ modeWrite: dataNote.modeWrite });
        window.dispatchEvent(new CustomEvent(BUTTON_SUCCESS_ANIMATION_TRIGGER + "button-save-write"))
      });
    } catch (e: any) {
      setStatusBar({
        type: "danger",
        show: true,
        message: e?.message,
      });
    }
  };

  shortCut.saveWrite(saveWrite);

  const onSaveClick = () => {
    if (!saveBtnRef.current) return;
    saveBtnRef.current.click();
  }

  return (
    <>
      <div className="container-custom pb-20">
        <motion.div animate={{ y: isNavHide ? "-100%" : 0 }} transition={{ ease: easeDefault }} className="w-full flex items-center z-10 justify gap-3 py-1 sticky top-0 left-0 bg-primary-foreground">
          <Button onClick={onClickBack} size="icon" variant="ghost" className="!w-10">
            <ChevronLeft />
          </Button>
          <input
            autoFocus={true}
            ref={titleRef}
            type="text"
            placeholder="Title ..."
            className="text-2xl flex-1 text-gray-500 font-medium border-none focus:outline-none outline-none bg-transparent"
          />
        </motion.div>
        <ShowedTags className="my-5" />
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
      <div className="fixed z-40 sm:bottom-8 sm:left-1/2 sm:-translate-x-1/2 bottom-0 left-0 w-full">
        <AnimatePresence>
          <motion.div animate={{ scale: 1 }} initial={{ scale: 0 }} className="flex justify-center w-full">
            <ToolsBar excludeSettings={dataNote.modeWrite === "habits" ? ["folder"] : undefined} isLoading={saveMutate.isLoading} save={onSaveClick} />
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
