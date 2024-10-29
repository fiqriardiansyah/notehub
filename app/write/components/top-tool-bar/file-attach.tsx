"use client";

import { WriteContext, WriteContextType } from "@/context/write";
import useStatusBar from "@/hooks/use-status-bar";
import { useUploadFile } from "@/hooks/use-upload-file";
import React from "react";

export default function FileAttach({ children }: { children: (ctrl: { onClick: () => void }) => any }) {
  const { setDataNote } = React.useContext(WriteContext) as WriteContextType;
  const [_, setStatusBar] = useStatusBar();
  const { triggerUpload } = useUploadFile({
    multiple: true,
    onChange(files) {
      setDataNote((prev) => ({
        ...prev,
        files: [...(prev?.files || []), ...files],
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
