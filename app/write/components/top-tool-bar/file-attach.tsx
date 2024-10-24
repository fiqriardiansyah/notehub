"use client";

import { WriteContext, WriteContextType } from "@/context/write";
import { useUploadFile } from "@/hooks/use-upload-file";
import React from "react";

export default function FileAttach({
  children,
}: {
  children: (ctrl: { onClick: () => void }) => any;
}) {
  const { setDataNote } = React.useContext(WriteContext) as WriteContextType;
  const { triggerUpload } = useUploadFile({
    multiple: true,
    onChange(files) {
      setDataNote((prev) => ({
        ...prev,
        files: [...(prev?.files || []), ...files],
      }));
    },
  });

  const onClick = () => {
    triggerUpload();
  };

  return children({ onClick });
}
