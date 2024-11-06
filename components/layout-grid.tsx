"use client";

import { useMobileMediaQuery } from "@/hooks/responsive";
import React from "react";
import Measure from "react-measure";
import Masonry from "react-responsive-masonry";

export type LayoutGridProps<T> = Omit<React.HTMLProps<HTMLDivElement>, "children"> & {
  items?: T[];
  children?: (item: T, i: number) => React.ReactNode;
  minWidthItem?: number;
};

export default function LayoutGrid<T>({ items, children, minWidthItem = 200, className, ...props }: LayoutGridProps<T>) {
  const [columns, setColumns] = React.useState(3);
  const isMobile = useMobileMediaQuery();

  const minWidthItemFinal = isMobile ? 150 : minWidthItem;

  return (
    <Measure
      client
      onResize={(contentRect) => {
        const width = contentRect.client?.width || 1;
        setColumns(Math.floor(width / minWidthItemFinal));
      }}
    >
      {({ measureRef }) => (
        <div ref={measureRef} {...props} className={`w-full ${className}`}>
          <Masonry columnsCount={columns || 1} gutter="10px">
            {items?.map((item, i) => (
              <Measure key={i}>{({ measureRef }) => <div ref={measureRef}>{children && children(item, i)}</div>}</Measure>
            ))}
          </Masonry>
        </div>
      )}
    </Measure>
  );
}
