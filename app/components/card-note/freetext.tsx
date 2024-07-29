"use client";

import { convertEditorDataToText } from "@/lib/utils";
import { CardNoteType } from ".";
import parse from "html-react-parser";

export type FreeTextCardNoteType = Partial<CardNoteType>;

export default function FreeTextCardNote({ note }: FreeTextCardNoteType) {
  return (
    <div className="text-gray-500 text-sm line-clamp-6">
      {parse(convertEditorDataToText(note!))}
    </div>
  );
}
