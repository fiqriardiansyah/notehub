"use client";

import { formatDate } from '@/lib/utils';
import { Note } from "@/models/note";
import { Check, icons } from 'lucide-react';
import React from 'react';
import FreeTextCardNote from '../card-note/freetext';
import Secure from '../card-note/secure';
import TodolistCardNote from '../card-note/todolist';

export type CardNotePickProps = React.HTMLProps<HTMLButtonElement> & {
    note: Note;
    isPicked?: boolean;
}

export default function CardNotePick({ note, isPicked, className, ...props }: CardNotePickProps) {

    const content = () => {
        if (note?.isSecure) return <Secure size={40} />
        if (note.type === "freetext") return <FreeTextCardNote note={note} className='!text-xs' />
        if (note.type === "todolist") return <TodolistCardNote canInteract={false} maxItemShow={3} note={note} />
        return ""
    }

    return (
        <button className={`rounded-xl border border-solid ${isPicked ? "border-gray-700" : "border-gray-400"} overflow-hidden relative text-start ${className}`} {...props as any}>
            {isPicked && <Check className='bg-gray-700 text-white absolute top-0 right-0 rounded-bl p-1' size={24} />}
            <div className="bg-white p-3 flex flex-col gap-3">
                <div className="flex w-full items-center justify-between gap-2">
                    <p className="title line-clamp-1 text-base">{note?.title}</p>
                </div>
                {content()}
                <div className="flex items-center gap-2 line-clamp-1">
                    {note?.tags?.map((tag) => {
                        const Icon = icons[tag.icon as keyof typeof icons];
                        return <Icon size={15} key={tag.id} className="text-gray-700" />
                    })}
                </div>
                <div className="flex w-full items-center justify-between">
                    <span className="caption">{formatDate(note.updatedAt)}</span>
                </div>
            </div>
        </button>
    )
}