"use client";

import { CommonState } from "@/context/common";
import { LoaderCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function LoadingStatusBar(props: CommonState["statusBar"]) {
  if (props?.show && props?.type === "loading") {
    return (
      <motion.div className="flex items-center gap-2 py-2 text-sm text-gray-700 font-medium capitalize line-clamp-1">
        <LoaderCircle className="spinner text-sm" />
        {props?.message}
      </motion.div>
    );
  }
  return null;
}
