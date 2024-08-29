"use client"

import { Folder, Note } from "@/models/note"
import { useMediaQuery } from "react-responsive"
import CardFolder from "./card-folder"
import CardNote from "./card-note"
import React from "react"

export type LayoutGridProps = {
    notes?: (Note | Folder)[];
    render?: (item: Note | Folder) => React.ReactNode;
}

export default function LayoutGrid({ notes, render }: LayoutGridProps) {
    const isDesktop = useMediaQuery({ minWidth: 992 })
    const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 })

    let column;

    if (isDesktop) {
        column = 4;
    } else if (isTablet) {
        column = 3;
    } else {
        column = 2
    }

    const generateNoteColumn = () => {
        let tempCurrentCol = 0;
        let tempCol: (Note | Folder)[][] = new Array(column).fill(null);

        notes?.forEach((note) => {
            if (tempCurrentCol >= column) {
                tempCurrentCol = 0;
            }

            tempCol[tempCurrentCol] = tempCol[tempCurrentCol] ? [...tempCol[tempCurrentCol], note] : [note]

            tempCurrentCol = tempCurrentCol + 1;
        });
        return tempCol;
    }

    return (
        <div className="w-full flex gap-3">
            {generateNoteColumn()?.map((columns, i) =>
            (
                <div className="flex flex-1 flex-col gap-3" key={i}>
                    {columns?.map((item) => {
                        if (render) return render(item);
                        if (item.type === "folder") return <CardFolder {...item} key={item.id} />
                        return <CardNote {...item} key={item.id} />
                    })}
                </div>
            )
            )}
        </div>
    )
}