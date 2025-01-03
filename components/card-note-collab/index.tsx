"use client";

import CollabsList from "@/components/common/collabs-list";
import ResponsiveTagsListed from "@/components/common/tag-listed";
import { NoteContext, NoteContextType } from "@/context/note";
import { formatDate } from "@/lib/utils";
import { CollaborateProject } from "@/models/collab";
import { motion } from "framer-motion";
import { Bookmark, PanelRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import FreeTextCardNote from "../card-note/freetext";
import TodolistCardNote from "../card-note/todolist";
import { useMobileMediaQuery } from "@/hooks/responsive";
import { fireBridgeEvent } from "@/hooks/use-bridge-event";
import { HELPER_PANEL, HELPER_PANEL_NOTE_VIEW } from "../layout/helper-panel";
import useProcess from "@/hooks/use-process";

export type CardNoteCollabType<T> = {
  note?: T;
  attachMenu?: (note?: T) => any;
};

export default function CardNoteCollab<T extends CollaborateProject>({ note, attachMenu }: CardNoteCollabType<T>) {
  const isMobile = useMobileMediaQuery();

  const { proceed } = useProcess(note?.id);

  const { note: noteContext, setNote } = React.useContext(NoteContext) as NoteContextType;
  const onClickGear = () => {
    setNote((prev) => ({
      ...prev,
      note: note as any,
    }));
  };

  const content = React.useMemo(() => {
    if (note?.type === "freetext")
      return (
        <Link href={`/write/${note?.id}`}>
          <FreeTextCardNote note={note} />
        </Link>
      );
    if (note?.type === "todolist") return <TodolistCardNote note={note} />;
    return "";
  }, [note]);

  const onClickCard = () => {
    fireBridgeEvent(HELPER_PANEL, {
      data: note,
      content: HELPER_PANEL_NOTE_VIEW,
    });
  };

  return (
    <motion.div
      exit={{ scale: 0.3, opacity: 0, transition: { delay: 0.3 } }}
      style={{
        opacity: !noteContext?.note ? 1 : noteContext.note.id === note?.id ? 1 : 0.3,
      }}
      className="bg-white rounded-xl p-2 md:p-3 focus:border-gray-500 active:border-gray-500 flex flex-col gap-3 border border-solid border-gray-300"
    >
      <div className="flex w-full items-center justify-between gap-2">
        <Link href={`/write/${note?.id}`}>
          <p className="title line-clamp-1 text-base">{note?.title}</p>
        </Link>
        <div className="flex items-center gap-2">
          {attachMenu && attachMenu(note)}
          {!isMobile ? (
            <button disabled={!!proceed} onClick={onClickCard} title="Open in panel" className=" cursor-pointer bg-transparent border-none">
              <PanelRight className="text-gray-500" size={16} />
            </button>
          ) : null}
          <button onClick={onClickGear} className="w-[25px] h-[25px] rounded-full bg-gray-300 cursor-pointer bg-transparent border-none">
            <Image
              title={note?.ownerName || ""}
              height={25}
              width={25}
              alt={note?.ownerName || ""}
              src={note?.ownerImage || ""}
              className="rounded-full object-cover bg-gray-200"
            />
          </button>
        </div>
      </div>
      {content}
      <ResponsiveTagsListed tags={note?.tags} size={15} />
      <div className="flex w-full items-center justify-between">
        <span className="caption">{formatDate(note?.updatedAt)}</span>
        {note?.isHang && <Bookmark className="text-black" size={16} />}
      </div>
      <CollabsList noteId={note?.id} />
    </motion.div>
  );
}
