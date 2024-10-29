"use client";

import { WriteContext, WriteContextType } from "@/context/write";
import { FileInfo } from "@/hooks/use-upload-file";
import React from "react";
import { CardImage } from "./card-image";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useMobileMediaQuery } from "@/hooks/responsive";

export type ListImageProps = {
  canEdit?: boolean;
  defaultList?: FileInfo[];
  children?: (ctrl: { canEdit?: boolean; onRemove?: (file: FileInfo) => void; list?: FileInfo[]; length?: number }) => React.ReactElement;
};

export default function ListImage({ canEdit, defaultList = [], children }: ListImageProps) {
  const isMobile = useMobileMediaQuery();
  const { dataNote, setDataNote } = React.useContext(WriteContext) as WriteContextType;

  const onRemove = (image: FileInfo) => {
    if (!canEdit) return;
    setDataNote((prev) => ({
      ...prev,
      images: prev?.images?.filter((img) => {
        if (image?.id) return img.id !== image.id;
        return img.url !== image.url;
      }),
    }));
  };

  const length = defaultList.length ? defaultList?.length : dataNote?.images?.length;
  const images = defaultList.length ? defaultList : dataNote?.images;

  const calculateSpan = (index: number) => {
    let className;
    if (isMobile) {
      className = cn(
        index === 0 && length === 1 ? "h-[300px] col-span-2" : null,
        length === 2 ? "col-span-1 h-[200px]" : null,
        length === 3 ? (index === 0 ? "row-span-2 h-[300px]" : "col-span-1") : null
      );
    } else {
      className = cn(
        index === 0 && length === 1 ? "h-[400px] col-span-4" : null,
        length === 2 ? "col-span-2 h-[200px]" : null,
        length === 3 ? (index === 0 ? "col-span-2 row-span-2" : "col-span-2") : null,
        length === 4 ? "col-span-2 h-[200px]" : null,
        length === 5 ? (index === 0 ? "col-span-2 row-span-2" : "") : null,
        length === 6 ? (index === 0 || index === 1 ? "row-span-2" : "") : null,
        length === 7 ? (index === 0 ? "row-span-2" : "") : null,
        (length || 1) >= 9 ? (index === 0 ? "row-span-2 col-span-2" : null) : null
      );
    }

    return className;
  };

  if (children) {
    return children({ canEdit, onRemove, list: images, length });
  }

  return (
    <div className={cn("grid gap-2 grid-flow-row", isMobile ? "grid-cols-2" : "grid-cols-4")}>
      <AnimatePresence>
        {images?.map((file, i) => (
          <motion.div exit={{ scale: 0, width: 0, height: 0 }} animate={{ scale: 1 }} className={calculateSpan(i)} key={file.id}>
            <CardImage canEdit={canEdit} onRemove={onRemove} file={file} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
