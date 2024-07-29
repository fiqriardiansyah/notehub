"use client";

import { CommonState } from "@/context/common";
import useStatusBar from "@/hooks/use-status-bar";
import { motion } from "framer-motion";
import { CircleAlert, X } from "lucide-react";

export default function ErrorStatusBar(props: CommonState["statusBar"]) {
  const [_, setStatusBar] = useStatusBar();

  const onClose = () => {
    setStatusBar(undefined);
  };

  if (props?.show && props?.type === "danger") {
    return (
      <motion.div className="flex px-3 items-center justify-between gap-2 py-2 bg-red-100 text-sm text-red-500 font-medium capitalize line-clamp-1 rounded">
        <div className="flex items-center gap-2">
          <CircleAlert className="text-sm" />
          {props?.message}
        </div>
        <button
          onClick={onClose}
          className="bg-transparent border-none text-gray-700 text-xl cursor-pointer"
        >
          <X />
        </button>
      </motion.div>
    );
  }
  return null;
}
