"use client";

import { ArrowDownToLine, X } from "lucide-react";
import { Button } from "../ui/button";
import { FileInfo } from "@/hooks/use-upload-file";
import { downloadFileFromLink } from "@/lib/utils";

export type CardFileProps = {
  file: FileInfo;
  onRemove?: (file: FileInfo) => void;
  canEdit?: boolean;
};

export function CardFile({ file, onRemove, canEdit }: CardFileProps) {
  const onClickRemove = () => {
    if (onRemove) {
      onRemove(file);
    }
  };

  const onClickDownload = () => {
    downloadFileFromLink(file.url!, file.name!);
  };

  return (
    <div className="bg-gray-100 p-3 rounded-lg">
      <div className="w-full flex items-start justify-between gap-3">
        <p className="text-gray-600 line-clamp-2">{file?.name}</p>
        <div className="flex items-center gap-1">
          {file?.url && (
            <Button
              onClick={onClickDownload}
              size="icon-small"
              title="download file"
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
      </div>
      {file?.sizeInMb && (
        <span className="text-gray-400 font-light">{file?.sizeInMb} MB</span>
      )}
    </div>
  );
}
