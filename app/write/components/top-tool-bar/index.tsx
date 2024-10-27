import { Button } from "@/components/ui/button";
import { ImagePlus, Paperclip } from "lucide-react";
import FileAttach from "./file-attach";
import ImageAttach from "./image-attach";

export default function TopToolBar() {
  return (
    <div className="flex items-center gap-2">
      <FileAttach>
        {({ onClick }) => (
          <Button
            onClick={onClick}
            size="icon"
            variant="ghost"
            className="!rounded"
            title="Attach File"
          >
            <Paperclip size={16} />
          </Button>
        )}
      </FileAttach>
      <ImageAttach>
        {({ onClick }) => (
          <Button
            onClick={onClick}
            size="icon"
            variant="ghost"
            className="!rounded"
            title="Attach Image"
          >
            <ImagePlus size={16} />
          </Button>
        )}
      </ImageAttach>
    </div>
  );
}
