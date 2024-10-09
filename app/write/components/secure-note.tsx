"use client";

import { INITIATE_SECURE_NOTE } from "@/components/card-note/setting/initiate-secure-note";
import { SECURE_NOTE } from "@/components/card-note/setting/secure-note";
import { CLOSE_SIDE_PANEL, OPEN_SIDE_PANEL } from "@/components/layout/side-panel";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { WriteContext, WriteContextType } from "@/context/write";
import { fireBridgeEvent } from "@/hooks/use-bridge-event";
import useSecureNote from "@/hooks/use-secure-note";
import { Note } from "@/models/note";
import { motion } from "framer-motion";
import { LockKeyhole, LockKeyholeOpen } from "lucide-react";
import React from "react";

export type SecureNoteProps = {
  note?: Note;
}

export default function SecureNote({ note }: SecureNoteProps) {
  const { dataNote, setDataNote } = React.useContext(
    WriteContext
  ) as WriteContextType;

  const { checkHasPassNote } = useSecureNote({
    onInitiateSecure() {
      setDataNote((prev) => ({ ...(prev || {}), isSecure: true }));
      fireBridgeEvent(CLOSE_SIDE_PANEL, null);
    },
    onSecure(isPasswordCorrect) {
      if (isPasswordCorrect) {
        setDataNote((prev) => ({ ...(prev || {}), isSecure: true }));
        fireBridgeEvent(CLOSE_SIDE_PANEL, null);
      }
    },
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
        fireBridgeEvent(OPEN_SIDE_PANEL, {
          groundOpen: INITIATE_SECURE_NOTE
        });
        return;
      }
      fireBridgeEvent(OPEN_SIDE_PANEL, {
        groundOpen: SECURE_NOTE
      });
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
