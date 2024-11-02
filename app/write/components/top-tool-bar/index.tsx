import { Button } from "@/components/ui/button";
import { WriteContext, WriteContextType } from "@/context/write";
import { ImagePlus, Paperclip } from "lucide-react";
import React from "react";
import FileAttach from "./file-attach";
import ImageAttach from "./image-attach";

export default function TopToolBar() {
  const { dataNote } = React.useContext(WriteContext) as WriteContextType;

  return (
    <div className="flex items-center gap-2">
      {dataNote?.modeWrite !== "habits" && (
        <FileAttach>
          {({ onClick }) => (
            <Button onClick={onClick} size="icon" variant="ghost" className="!rounded" title="Attach File">
              <Paperclip size={16} />
            </Button>
          )}
        </FileAttach>
      )}
      {dataNote?.modeWrite !== "habits" && (
        <ImageAttach>
          {({ onClick }) => (
            <Button onClick={onClick} size="icon" variant="ghost" className="!rounded" title="Attach Image">
              <ImagePlus size={16} />
            </Button>
          )}
        </ImageAttach>
      )}
    </div>
  );
}
