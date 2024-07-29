"use client";

import { NoteContext, NoteContextType } from "@/context/note";
import { formatDate } from "@/lib/utils";
import { Note } from "@/models/note";
import Link from "next/link";
import React from "react";
import { GoGear } from "react-icons/go";
import FreeTextCardNote from "./freetext";
import SettingNoteDrawer from "../setting-note-drawer";
import { motion } from "framer-motion";
import { icons } from "lucide-react";
import Secure from "./secure";

export type CardNoteType = Note;

export default function CardNote({ title, updatedAt, ...props }: CardNoteType) {
  const { note, setNote } = React.useContext(NoteContext) as NoteContextType;
  const onClickGear = () => {
    setNote((prev) => ({
      ...prev,
      note: { title, updatedAt, ...props },
    }));
  };

  const content = () => {
    if (props?.isSecure) return <Secure />
    return <FreeTextCardNote {...props} />
  }

  return (
    <motion.div
      exit={{ scale: 0.3, opacity: 0, transition: { delay: 0.3 } }}
      style={{ opacity: !note?.note ? 1 : note.note.id === props.id ? 1 : 0.3 }}
      className="bg-white rounded-xl p-3 flex flex-col gap-3"
    >
      <div className="flex w-full items-center justify-between gap-2">
        <Link href={`/write/${props.id}`}>
          <p className="title line-clamp-1 text-base">{title}</p>
        </Link>
        <div className="flex items-center gap-1">
          <SettingNoteDrawer.Attach note={{ ...props, title, updatedAt }} />
          <GoGear
            className="text-gray-500 cursor-pointer"
            onClick={onClickGear}
          />
        </div>
      </div>
      {content()}
      <div className="flex items-center gap-2 line-clamp-1">
        {props?.tags?.map((tag) => {
          const Icon = icons[tag.icon as keyof typeof icons];
          return <Icon size={15} key={tag.id} className="text-gray-700" />
        })}
      </div>
      <div className="flex w-full items-center justify-between">
        <span className="caption">{formatDate(updatedAt)}</span>
      </div>
    </motion.div>
  );
}
