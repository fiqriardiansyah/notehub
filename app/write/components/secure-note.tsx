"use client";

import { INITIATE_SECURE_NOTE } from "@/app/components/setting-note-ground/initiate-secure-note";
import { SECURE_NOTE } from "@/app/components/setting-note-ground/secure-note";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { WriteContext, WriteContextType } from "@/context/write";
import useSecureNote from "@/hooks/use-secure-note";
import useSidePage from "@/hooks/use-side-page";
import { motion } from "framer-motion";
import { LockKeyhole, LockKeyholeOpen } from "lucide-react";
import React from "react";

export default function SecureNote() {
  const { dataNote, setDataNote } = React.useContext(
    WriteContext
  ) as WriteContextType;
  const [setSidePage, resetSidePage] = useSidePage();

  const { checkHasPassNote } = useSecureNote({
    onInitiateSecure() {
      setDataNote((prev) => ({ ...(prev || {}), isSecure: true }));
      resetSidePage();
    },
    onSecure(isPasswordCorrect) {
      if (isPasswordCorrect) {
        setDataNote((prev) => ({ ...(prev || {}), isSecure: true }));
        resetSidePage();
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
        setSidePage(INITIATE_SECURE_NOTE);
        return;
      }

      setSidePage(SECURE_NOTE);
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
