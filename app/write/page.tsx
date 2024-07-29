"use client";

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
import dynamic from 'next/dynamic';
import React, { useRef } from "react";
import ToolsBar from "./components/tool-bar";

const Editor = dynamic<{
  editorRef: any
  children?: any
  data?: any
  options?: any
}>(
  () =>
    import("@/components/editor/index").then((mod) => mod.Editor),
  { ssr: false }
)

export default function Write() {
  const titleRef = useRef<HTMLInputElement | null>(null);
  const [_, setStatusBar] = useStatusBar();
  const { dataNote } = React.useContext(WriteContext) as WriteContextType;

  const [editor, setEditor] = React.useState<any>(null)

  const { toast } = useToast();

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

  const saveWrite = async () => {
    if (!editor) return;
    const note = await editor.save();

    const data = {
      title: titleRef.current?.value,
      note,
      type: "freetext",
      isSecure: dataNote?.isSecure,
      tags: dataNote?.tags,
    } as CreateNote;

    try {
      validation(noteValidation.CREATE, data);
      saveMutate.mutateAsync(data as CreateNote).then(() => {
        toast({
          title: "Success",
          description: <p className="text-green-400">New Note Created!</p>,
        });
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

  return (
    <div className="container-custom">
      <ShowedTags />
      <input
        autoFocus={true}
        ref={titleRef}
        type="text"
        placeholder="Your Title ..."
        className="text-2xl text-gray-500 w-full font-medium border-none focus:outline-none outline-none my-7 bg-transparent"
      />
      <Editor editorRef={setEditor} />
      <ToolsBar isLoading={saveMutate.isLoading} save={saveWrite} />
    </div>
  );
}
