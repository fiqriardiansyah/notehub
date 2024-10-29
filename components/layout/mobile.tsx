"use client";

import { CommonContext, CommonContextType } from "@/context/common";
import { easeDefault } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import StatusBar from "../status-bar";
import SidePanel from "./side-panel";
import { Button } from "../ui/button";
import { X } from "lucide-react";

export default function MobileLayout({ children }: { children: any }) {
  const { common, setCommon } = React.useContext(CommonContext) as CommonContextType;

  const onCloseSidePanel = () => {
    setCommon((prev) => ({ ...prev, sidePageOpen: false }));
  };

  return (
    <>
      <motion.div
        animate={common?.sidePageOpen ? { left: "-90vw", scale: 0.9 } : { left: 0, scale: 1 }}
        className="!w-screen min-h-screen z-[1] relative bg-white"
        transition={{ ease: easeDefault }}
      >
        <div className="w-full sticky top-0 left-0 z-50 pointer-events-none" id="top-nav"></div>
        <StatusBar />
        {children}
      </motion.div>
      <AnimatePresence>
        {common?.sidePageOpen && (
          <motion.div
            onClick={onCloseSidePanel}
            animate={{ opacity: 1, transition: { delay: 2 } }}
            exit={{ opacity: 0 }}
            className="w-screen h-screen fixed flex cursor-pointer top-0 left-0 z-[2]"
          >
            <motion.div className="w-[10vw] h-full bg-white flex items-center justify-center">
              <X size={23} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        animate={common?.sidePageOpen ? { x: "10vw" } : { x: "100vw" }}
        initial={{ x: "100vw" }}
        className="z-[3] fixed top-0 left-0 border-l border-solid border-gray-300"
        transition={{ ease: easeDefault }}
      >
        <SidePanel.Mobile />
      </motion.div>
    </>
  );
}
