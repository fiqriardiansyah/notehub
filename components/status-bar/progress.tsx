"use client";

import { CommonState, Process } from "@/context/common";
import { useBridgeEvent } from "@/hooks/use-bridge-event";
import { motion } from "framer-motion";
import { LoaderCircle } from "lucide-react";
import React from "react";
import { Progress } from "../ui/progress";
import useProcess from "@/hooks/use-process";

export const UPDATE_PROGRESS_PROCESS = "updateProgressProcess";

const Component = ({ icon, message }: { icon?: any; message: any }) => {
  return (
    <motion.div className="flex items-center gap-2 py-1 text-xs text-gray-700 font-medium capitalize line-clamp-1">
      {icon ? icon : <LoaderCircle className="spinner text-sm" />}
      {message}
    </motion.div>
  );
};

export const ProgressStatusBarAsProcess = ({ process }: { process: Process }) => {
  const [progress, setProgress] = React.useState(0);

  //  USE FOR DEBUG
  // const { updateProcess } = useProcess();
  // React.useEffect(() => {
  //     const interval = setInterval(() => {
  //         setProgress((prev) => {
  //             const n = prev + 20;
  //             if (n === 100) {
  //                 clearInterval(interval);
  //             }
  //             return n;
  //         });
  //     }, 1000);

  //     const timeout = setTimeout(() => {
  //         updateProcess(process.id, { type: "success", nameOfProcess: "Success creating note" });
  //     }, 7000);

  //     return () => {
  //         clearInterval(interval);
  //     }
  // }, []);

  useBridgeEvent(UPDATE_PROGRESS_PROCESS + "_" + process.id, (payload: { val: number }) => {
    setProgress(payload.val);
  });

  return (
    <div className="w-full p-1 bg-gray-100 px-2">
      {progress !== 100 ? <span className="text-xs font-medium text-gray-400 m-0 capitalize">Uploading files</span> : null}
      {progress === 100 ? <Component message={`${process.nameOfProcess}...`} /> : <Progress className="h-[5px] mt-1 w-full" value={progress} />}
    </div>
  );
};

export default function ProgressStatusBar(props: CommonState["statusBar"]) {
  if (props?.show && props?.type === "progress") {
    return <Component message={props?.message} icon={props?.icon} />;
  }
  return null;
}
