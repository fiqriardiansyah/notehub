"use client";

import { cn, convertEditorDataToText } from "@/lib/utils";
import { Note } from "@/models/note";
import parse from "html-react-parser";
import Image from "next/image";
import React from "react";

export type FreeTextCardNoteType = React.HTMLProps<HTMLDivElement> & {
  note: Partial<Note>;
};

export default function FreeTextCardNote({
  note,
  className,
  ...props
}: FreeTextCardNoteType) {
  const length = note?.imagesUrl?.length;

  const textClass = cn(
    "text-gray-500 text-sm w-full break-all",
    className,
    length ? "line-clamp-3" : "line-clamp-6"
  );

  const inlineNote = convertEditorDataToText(note.note!);
  const restImagesLength = (note?.imagesUrl?.length || 1) - 1;

  return (
    <div className="flex w-full flex-col gap-3">
      {note?.imagesUrl?.length && !inlineNote.includes("image-thumbnail") ? (
        <div className="w-full relative h-[150px] bg-gray-200 rounded-lg">
          <Image
            src={note.imagesUrl[0].url!}
            alt={note.imagesUrl[0].name!}
            fill
            className="bg-gray-200 rounded-lg object-cover"
          />
          {restImagesLength ? (
            <div className="absolute bottom-0 right-0 bg-white rounded-tl p-1 text-xs font-semibold">
              + {restImagesLength}
            </div>
          ) : null}
        </div>
      ) : null}
      <div className={textClass} {...props}>
        {parse(inlineNote)}
      </div>
      {note?.filesUrl?.length && !note?.imagesUrl?.length ? (
        <div className="flex flex-col gap-1 w-full">
          {note?.filesUrl?.map((file, i) => {
            if (i !== 0) return null;
            return (
              <div
                key={file.url}
                className="rounded bg-gray-200 p-1 line-clamp-1 text-xs"
              >
                {file.name}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
