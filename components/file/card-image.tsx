/* eslint-disable @next/next/no-img-element */
"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FileInfo } from "@/hooks/use-upload-file";
import { downloadFileFromLink } from "@/lib/utils";
import { DialogTitle } from "@radix-ui/react-dialog";
import { ArrowDownToLine, X } from "lucide-react";
import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";

export type CardImageProps = {
  file: FileInfo;
  onRemove?: (file: FileInfo) => void;
  canEdit?: boolean;
};

export function CardImage({ file, onRemove, canEdit }: CardImageProps) {
  const [open, setOpen] = React.useState(false);

  const onClickRemove = () => {
    if (onRemove) {
      onRemove(file);
    }
  };

  const onOpenChange = () => {
    setOpen((prev) => !prev);
  };

  const onClickDownload = () => {
    downloadFileFromLink(file.url!, file.name!);
  };

  return (
    <>
      <div className="rounded-lg relative overflow-hidden h-full min-h-[100px] min-w-[100px]">
        <div className="flex items-center gap-1 absolute z-10 top-1 right-1">
          {file?.url && (
            <Button
              onClick={onClickDownload}
              size="icon-small"
              title="download image"
              variant="outline"
            >
              <ArrowDownToLine size={14} />
            </Button>
          )}
          {canEdit && (
            <Button
              onClick={onClickRemove}
              size="icon-small"
              title="remove"
              variant="outline"
            >
              <X size={14} />
            </Button>
          )}
        </div>
        <button
          tabIndex={0}
          onClick={onOpenChange}
          className="block border-none h-full w-full group"
        >
          <Image
            src={file?.previewUri || file?.url}
            alt={file?.previewUri || file?.url}
            fill
            className="bg-gray-200 group-active:scale-110 group-hover:scale-110 transition duration-150 rounded-lg object-cover cursor-pointer"
          />
        </button>
      </div>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="!p-0 !border-none">
          <DialogTitle className="hidden" />
          <img
            src={file?.previewUri || file?.url}
            alt={file?.previewUri || file?.url}
            className="bg-gray-200 rounded-lg w-full h-full object-cover"
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
