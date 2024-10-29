"use client";

import { CardFile } from "@/components/file/card-file";
import { WriteContext, WriteContextType } from "@/context/write";
import { FileInfo } from "@/hooks/use-upload-file";
import React from "react";

export type ListFileProps = {
  canEdit?: boolean;
  defaultList?: FileInfo[];
  children?: (ctrl: { canEdit?: boolean; onRemove?: (file: FileInfo) => void; list?: FileInfo[]; length?: number }) => React.ReactElement;
};

export default function ListFile({ canEdit, defaultList = [], children }: ListFileProps) {
  const { dataNote, setDataNote } = React.useContext(WriteContext) as WriteContextType;

  const files = defaultList.length ? defaultList : dataNote?.files;
  const length = defaultList.length ? defaultList?.length : dataNote?.files?.length;

  const onRemove = (file: FileInfo) => {
    if (!canEdit) return;
    setDataNote((prev) => ({
      ...prev,
      files: prev?.files?.filter((fl) => {
        if (file?.id) return fl.id !== file.id;
        return fl.url !== file.url;
      }),
    }));
  };

  if (children) {
    return children({ canEdit, onRemove, list: files, length });
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {files?.map((file, i) => (
        <CardFile canEdit={canEdit} onRemove={onRemove} key={file.id} file={file} />
      ))}
    </div>
  );
}
