"use client";

import { NoteContext, NoteContextType } from "@/context/note";
import { formatDate } from "@/lib/utils";
import { Note } from "@/models/note";
import { motion } from "framer-motion";
import { Bookmark, icons } from "lucide-react";
import Link from "next/link";
import React from "react";
import { GoGear } from "react-icons/go";
import SettingNoteDrawer from "../setting-note-drawer";
import FreeTextCardNote from "./freetext";
import Secure from "./secure";
import TodolistCardNote from "./todolist";
import ResponsiveTagsListed from "@/components/common/tag-listed";
import collabService from "@/service/collab";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

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
    if (props.type === "freetext") return <FreeTextCardNote note={props} />
    if (props.type === "todolist") return <TodolistCardNote note={props} />
    return ""
  }

  const collabAcountQuery = useQuery([collabService.collabAccount.name, props.id], async () => {
    return (await collabService.collabAccount(props.id)).data.data
  }, {
    enabled: !!props.id
  });

  return (
    <motion.div
      exit={{ scale: 0.3, opacity: 0, transition: { delay: 0.3 } }}
      style={{ opacity: !note?.note ? 1 : note.note.id === props.id ? 1 : 0.3 }}
      className="bg-white rounded-xl p-3 flex flex-col gap-3 border border-solid border-gray-500"
    >
      <div className="flex w-full items-center justify-between gap-2">
        <Link href={`/write/${props.id}`}>
          <p className="title line-clamp-1 text-base">{title}</p>
        </Link>
        <div className="flex items-center gap-1">
          <SettingNoteDrawer.Attach note={{ ...props, title, updatedAt }} />
          <button onClick={onClickGear} className=" cursor-pointer bg-transparent border-none">
            <GoGear className="text-gray-500" />
          </button>
        </div>
      </div>
      {content()}
      <ResponsiveTagsListed tags={props?.tags} size={15} />
      <div className="flex w-full items-center justify-between">
        <span className="caption">{formatDate(updatedAt)}</span>
        {props?.isHang && <Bookmark className="text-black" size={16} />}
      </div>
      {collabAcountQuery.data?.length ? (
        <div className="flex w-full gap-1 items-center">
          {collabAcountQuery.data?.map((account) => (
            <Image
              title={account?.name || ""}
              key={account.email} height={25} width={25} alt={account?.image || ""}
              src={account?.image || ""} className="rounded-full object-cover bg-gray-200" />
          ))}
        </div>
      ) : null}
    </motion.div>
  );
}
