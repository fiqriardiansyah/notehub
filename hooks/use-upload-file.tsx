import { getContentType, toBase64 } from "@/lib/utils";
import React from "react";
import { v4 as uuid } from "uuid";

export type FileInfo = {
  id?: string;
  name?: string;
  size?: number;
  extension?: string;
  previewUri?: any;
  sizeInMb?: string;
  base64?: string;
  contentType?: string;
  url?: string;
};

export type UseUploadFileProps = {
  accept?: string;
  multiple?: boolean;
  onChange?: (files: FileInfo[]) => void;
};

export const useUploadFile = ({
  accept,
  multiple,
  onChange,
}: UseUploadFileProps) => {
  const [files, setFiles] = React.useState<FileInfo[]>([]);

  const handleFileChange = async (event: any) => {
    try {
      const files = event.target.files;

      if (files.length > 0) {
        const listBase64 = await Promise.all(
          Array.from(files).map((file: any) => toBase64(file))
        );
        const fileDetails = Array.from(files).map((file: any, i) => ({
          id: uuid(),
          name: file.name,
          size: file.size,
          extension: file.name.split(".").pop(),
          previewUri: file.type.startsWith("image/")
            ? URL.createObjectURL(file)
            : null,
          sizeInMb: (file.size / (1024 * 1024)).toFixed(2),
          base64: listBase64[i] as string,
          contentType: getContentType(listBase64[i] as string) as string,
        }));

        if (onChange) {
          onChange(fileDetails);
          return;
        }
        setFiles(fileDetails);
      }
    } catch (e: any) {
      console.log(e);
    }
  };

  const triggerUpload = () => {
    setFiles([]);

    const findForm = document.querySelector("#upload-file");
    findForm?.remove();

    const form = document.createElement("form");
    form.setAttribute("id", "upload-file");
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", accept || "*");
    if (multiple) {
      input.setAttribute("multiple", "");
    }
    input.click();
    input.onchange = handleFileChange;
  };

  return {
    triggerUpload,
    files,
  };
};
