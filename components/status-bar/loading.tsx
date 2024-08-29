"use client";

import { CommonState } from "@/context/common";
import { LoaderCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function LoadingStatusBar(props: CommonState["statusBar"]) {
  if (props?.show && props?.type === "loading") {
    return (
      <motion.div className="flex my-5 items-center gap-2 py-2 text-xs text-gray-700 font-medium capitalize line-clamp-1">
        {props?.icon ? props.icon : <LoaderCircle className="spinner text-sm" />}
        {props?.message}
      </motion.div>
    );
  }
  return null;
}
