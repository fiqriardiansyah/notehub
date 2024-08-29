"use client";

import { CommonState } from "@/context/common";
import useStatusBar from "@/hooks/use-status-bar";
import { motion } from "framer-motion";
import { CircleAlert, X } from "lucide-react";
import React from "react";

export default function ErrorStatusBar(props: CommonState["statusBar"]) {
  const [_, setStatusBar] = useStatusBar();

  const onClose = () => {
    setStatusBar(undefined);
  };

  React.useEffect(() => {
    if (!props?.autoClose) return;

    setTimeout(() => {
      setStatusBar(undefined);
    }, props.autoClose * 1000);

  }, [props?.autoClose]);

  if (props?.show && props?.type === "danger") {
    return (
      <motion.div className="flex px-3 my-5 items-center justify-between gap-2 py-2 bg-red-100 text-xs text-red-500 font-medium capitalize line-clamp-1 rounded">
        <div className="flex items-center gap-2 line-clamp-3">
          {props?.icon ? props?.icon : <CircleAlert className="text-sm" />}
          {props?.message}
        </div>
        <button
          onClick={onClose}
          className="bg-transparent border-none text-gray-700 cursor-pointer"
        >
          <X />
        </button>
      </motion.div>
    );
  }
  return null;
}
