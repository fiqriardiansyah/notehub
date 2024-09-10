"use client"

import { WriteContext, WriteContextType } from "@/context/write"
import { AnimatePresence, motion } from "framer-motion";
import React from "react"
import Chip from "./chip";
import { Tag } from "@/models/note";

export type ShowedTagsProps = React.HTMLProps<HTMLDivElement>;

export default function ShowedTags({ className, ...props }: ShowedTagsProps) {
    const { dataNote, setDataNote } = React.useContext(WriteContext) as WriteContextType;

    const onClickDeleteTag = (tag: Tag) => {
        setDataNote((prev) => ({
            ...prev,
            tags: prev?.tags?.filter((t) => t.id !== tag.id),
        }))
    }

    return (
        <div {...props} className={`${className} flex items-center flex-nowrap overflow-x-auto gap-1`}>
            <AnimatePresence>
                {dataNote?.tags?.map((tag) => (
                    <motion.div key={tag.id} initial={{ scale: 0.3 }} animate={{ scale: 1 }} exit={{ scale: 0, width: 0 }}>
                        <Chip tag={tag} pick deleteable onClickDelete={onClickDeleteTag} />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    )
}