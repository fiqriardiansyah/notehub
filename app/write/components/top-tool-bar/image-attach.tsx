"use client";

import { WriteContext, WriteContextType } from "@/context/write";
import { useUploadFile } from "@/hooks/use-upload-file";
import React from "react";

export default function ImageAttach({
  children,
}: {
  children: (ctrl: { onClick: () => void }) => any;
}) {
  const { setDataNote } = React.useContext(WriteContext) as WriteContextType;
  const { triggerUpload } = useUploadFile({
    multiple: true,
    accept: "image/*",
    onChange(images) {
      setDataNote((prev) => ({
        ...prev,
        images: [...(prev?.images || []), ...images],
      }));
    },
  });

  const onClick = () => {
    triggerUpload();
  };

  return children({ onClick });
}
