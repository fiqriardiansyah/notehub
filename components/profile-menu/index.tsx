"use client";

import { CommonContext, CommonContextType } from "@/context/common";
import { motion } from "framer-motion";
import React from "react";

export const PROFILE_MENU = "profileMenu";

export default function ProfileMenu() {
  const { common } = React.useContext(CommonContext) as CommonContextType;

  if (common?.groundOpen !== PROFILE_MENU) return null;
  return (
    <motion.div
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1, transition: { delay: 0.3 } }}
      className="w-full h-full flex flex-col gap-6"
    ></motion.div>
  );
}
