"use client";

import { SECURE_NOTE_GROUND } from "@/app/components/setting-note-ground/secure-note";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { WriteContext, WriteContextType } from "@/context/write";
import { pause } from "@/lib/utils";
import noteService from "@/service/note";
import { useMutation } from "@tanstack/react-query";
import { LockKeyhole, LockKeyholeOpen } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";
import useSidePage from "@/hooks/use-side-page";

export default function SecureNote() {
  const { dataNote, setDataNote } = React.useContext(
    WriteContext
  ) as WriteContextType;
  const [setSidePage] = useSidePage();

  const checkHasPassNote = useMutation(["has-password"], async () => {
    await pause(0.4);
    return (await noteService.hasPasswordNote()).data.data;
  });

  const onClickLock = () => {
    if (dataNote?.isSecure) {
      setDataNote((prev) => ({
        ...prev,
        isSecure: false,
      }));
      return;
    }
    checkHasPassNote.mutateAsync().then((isHasPassword) => {
      if (!isHasPassword) {
        setSidePage(SECURE_NOTE_GROUND);
        return;
      }
      setDataNote((prev) => ({
        ...prev,
        isSecure: !prev?.isSecure,
      }));
    });
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          loading={checkHasPassNote.isLoading}
          onClick={onClickLock}
          size="icon"
          variant={dataNote?.isSecure ? "default" : "ghost"}
        >
          {dataNote?.isSecure ? (
            <motion.div animate={{ scale: 1 }} initial={{ scale: 0 }}>
              <LockKeyhole />
            </motion.div>
          ) : (
            <LockKeyholeOpen />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {dataNote?.isSecure ? "Open note" : "Secure your note"}
      </TooltipContent>
    </Tooltip>
  );
}
