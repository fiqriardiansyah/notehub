"use client";

import React from "react";
import Measure from "react-measure";
import Masonry from "react-responsive-masonry";

export type LayoutGridProps<T> = Omit<
  React.HTMLProps<HTMLDivElement>,
  "children"
> & {
  items?: T[];
  children?: (item: T, i: number) => React.ReactNode;
  minWidthItem?: number;
};

export default function LayoutGrid<T>({
  items,
  children,
  minWidthItem = 200,
  className,
  ...props
}: LayoutGridProps<T>) {
  const [columns, setColumns] = React.useState(3);

  return (
    <Measure
      client
      onResize={(contentRect) => {
        const width = contentRect.client?.width || 1;
        setColumns(Math.floor(width / minWidthItem));
      }}
    >
      {({ measureRef }) => (
        <div ref={measureRef} {...props} className={`w-full ${className}`}>
          <Masonry columnsCount={columns} gutter="10px">
            {items?.map((item, i) => (
              <Measure key={i}>
                {({ measureRef }) => (
                  <div ref={measureRef}>{children && children(item, i)}</div>
                )}
              </Measure>
            ))}
          </Masonry>
        </div>
      )}
    </Measure>
  );
}
