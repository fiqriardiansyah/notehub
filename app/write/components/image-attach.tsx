"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { WriteContext, WriteContextType } from "@/context/write";
import { useUploadFile } from "@/hooks/use-upload-file";
import { ImagePlus } from "lucide-react";
import React from "react";

export default function ImageAttach() {
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

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button onClick={onClick} size="sm" variant="secondary">
          <ImagePlus className="mr-2" size={15} />
          Image
        </Button>
      </TooltipTrigger>
      <TooltipContent>Add Image</TooltipContent>
    </Tooltip>
  );
}
