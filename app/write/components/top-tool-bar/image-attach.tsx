"use client";

import { WriteContext, WriteContextType } from "@/context/write";
import useStatusBar from "@/hooks/use-status-bar";
import { useUploadFile } from "@/hooks/use-upload-file";
import React from "react";

export default function ImageAttach({ children }: { children: (ctrl: { onClick: () => void }) => any }) {
  const { setDataNote } = React.useContext(WriteContext) as WriteContextType;
  const [_, setStatusBar] = useStatusBar();
  const { triggerUpload } = useUploadFile({
    multiple: true,
    accept: "image/*",
    onChange(images) {
      setDataNote((prev) => ({
        ...prev,
        images: [...(prev?.images || []), ...images],
      }));
    },
    onError(error) {
      setStatusBar({ message: "Image Attach: " + error, type: "danger" });
    },
  });

  const onClick = () => {
    triggerUpload();
  };

  return children({ onClick });
}
