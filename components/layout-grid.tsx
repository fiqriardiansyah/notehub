"use client"

import { useDesktopMediaQuery, useTabletMediaQuery } from "@/hooks/responsive";
import React from "react";

export type LayoutGridProps<T> = {
    items?: T[];
    children?: (item: T) => React.ReactNode;
}

export default function LayoutGrid<T>({ items, children }: LayoutGridProps<T>) {
    const isDesktop = useDesktopMediaQuery();
    const isTablet = useTabletMediaQuery();

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
        let tempCol: T[][] = new Array(column).fill(null);

        items?.forEach((note) => {
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
                        if (children) return children(item);
                        // if (item.type === "folder") return <CardFolder {...item} key={item.id} />
                        // return <CardNote note={item} key={item.id} />
                    })}
                </div>
            )
            )}
        </div>
    )
}