"use client";

import { convertEditorDataToText } from "@/lib/utils";
import { Note } from "@/models/note";
import parse from "html-react-parser";
import React from "react";

export type FreeTextCardNoteType = React.HTMLProps<HTMLDivElement> & {
  note: Partial<Note>;
};

export default function FreeTextCardNote({ note, className, ...props }: FreeTextCardNoteType) {
  return (
    <div className={`text-gray-500 text-sm line-clamp-6 break-all ${className}`} {...props}>
      {parse(convertEditorDataToText(note.note!))}
    </div>
  );
}
