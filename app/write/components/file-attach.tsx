"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { WriteContext, WriteContextType } from "@/context/write";
import { useUploadFile } from "@/hooks/use-upload-file";
import { File } from "lucide-react";
import React from "react";

export default function FileAttach() {
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

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button onClick={onClick} size="sm" variant="secondary">
          <File className="mr-2" size={15} />
          Attach File
        </Button>
      </TooltipTrigger>
      <TooltipContent>Attach File</TooltipContent>
    </Tooltip>
  );
}
