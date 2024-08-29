"use client";

import { NoteContext, NoteContextType } from "@/context/note";
import { formatDate } from "@/lib/utils";
import { Folder } from "@/models/note";
import { motion } from 'framer-motion'
import { Folder as FolderIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

export type CardFolderProps = Folder;

export default function CardFolder(props: CardFolderProps) {
    const { note } = React.useContext(NoteContext) as NoteContextType;

    return (
        <motion.div
            exit={{ scale: 0.3, opacity: 0, transition: { delay: 0.3 } }}
            style={{ opacity: !note?.note ? 1 : note.note.id === props.id ? 1 : 0.3 }}
            className="bg-white rounded-xl p-3 flex flex-col gap-3 border border-solid border-gray-500"
        >
            <div className="flex w-full items-center justify-between gap-2">
                <Link href={`/folder/${props.id}`}>
                    <p className="title line-clamp-1 text-base">{props.title}</p>
                </Link>
            </div>
            <div className="w-full items-center flex justify-center">
                <FolderIcon size={60} className="text-gray-500" />
            </div>
            <div className="flex w-full items-center justify-between">
                <span className="caption">{formatDate(props.updatedAt)}</span>
            </div>
        </motion.div>
    )
}