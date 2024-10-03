"use client";

import CollabsList from "@/components/common/collabs-list";
import ResponsiveTagsListed from "@/components/common/tag-listed";
import { NoteContext, NoteContextType } from "@/context/note";
import { formatDate } from "@/lib/utils";
import { Note } from "@/models/note";
import { motion } from "framer-motion";
import { Bookmark } from "lucide-react";
import Link from "next/link";
import React from "react";
import { GoGear } from "react-icons/go";
import FreeTextCardNote from "./freetext";
import Secure from "./secure";
import TodolistCardNote from "./todolist";

export type CardNoteType<T> = {
  note?: T;
  attachMenu?: (note?: T) => any;
};

export default function CardNote<T extends Note>({ note, attachMenu }: CardNoteType<T>) {
  const { note: noteContext, setNote } = React.useContext(NoteContext) as NoteContextType;
  const onClickGear = () => {
    setNote((prev) => ({
      ...prev,
      note,
    }));
  };

  const content = () => {
    if (note?.isSecure) return <Secure />
    if (note?.type === "freetext") return <FreeTextCardNote note={note} />
    if (note?.type === "todolist") return <TodolistCardNote note={note} />
    return ""
  }

  return (
    <motion.div
      exit={{ scale: 0.3, opacity: 0, transition: { delay: 0.3 } }}
      style={{ opacity: !noteContext?.note ? 1 : noteContext.note.id === note?.id ? 1 : 0.3 }}
      className="bg-white rounded-xl p-3 flex flex-col gap-3 border border-solid border-gray-500"
    >
      <div className="flex w-full items-center justify-between gap-2">
        <Link href={`/write/${note?.id}`}>
          <p className="title line-clamp-1 text-base">{note?.title}</p>
        </Link>
        <div className="flex items-center gap-1">
          {attachMenu && attachMenu(note)}
          <button onClick={onClickGear} className=" cursor-pointer bg-transparent border-none">
            <GoGear className="text-gray-500" />
          </button>
        </div>
      </div>
      {content()}
      <ResponsiveTagsListed tags={note?.tags} size={15} />
      <div className="flex w-full items-center justify-between">
        <span className="caption">{formatDate(note?.updatedAt)}</span>
        {note?.isHang && <Bookmark className="text-black" size={16} />}
      </div>
      <CollabsList noteId={note?.id} />
    </motion.div>
  );
}
