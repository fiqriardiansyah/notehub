"use client";

import { CommonState, Process } from "@/context/common";
import { useBridgeEvent } from "@/hooks/use-bridge-event";
import useProcess from "@/hooks/use-process";
import useStatusBar from "@/hooks/use-status-bar";
import { motion } from "framer-motion";
import { CircleAlert, X } from "lucide-react";
import React from "react";

export const SET_ERROR_MESSAGE_ON_PROCESS = "setErrorMessageOnProcess";

const Component = ({
  icon,
  message,
  onClose,
}: {
  icon?: any;
  message: any;
  onClose?: () => void;
}) => {
  return (
    <motion.div className="flex px-3 items-center justify-between gap-4 py-2 bg-red-100 text-xs text-red-500 font-medium capitalize line-clamp-1 rounded">
      <div className="flex items-center gap-2 line-clamp-3">
        {icon ? icon : <CircleAlert className="text-sm" />}
        {message}
      </div>
      <button
        onClick={onClose}
        className="bg-transparent border-none text-gray-700 cursor-pointer"
      >
        <X size={15} />
      </button>
    </motion.div>
  );
};

export const ErrorStatusBarAsProcess = ({ process }: { process: Process }) => {
  const { finishProcess } = useProcess();

  const onClose = () => {
    finishProcess(process.id);
  };

  return <Component message={process.nameOfProcess} onClose={onClose} />;
};

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
      <Component
        message={props?.message}
        icon={props?.icon}
        onClose={onClose}
      />
    );
  }
  return null;
}
