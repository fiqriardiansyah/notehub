import { CommonContext, CommonContextType, Process } from "@/context/common";
import React from "react";

const useProcess = (id?: string) => {
  const { common, setCommon } = React.useContext(
    CommonContext
  ) as CommonContextType;

  const allProcess = common?.process;

  const setProcess = (process: Process) => {
    setCommon((prev) => {
      if (
        prev?.process?.find(
          (p) =>
            p.id === process.id && process.nameOfProcess === p.nameOfProcess
        )
      ) {
        return prev;
      }
      return {
        ...prev,
        process: [...(prev?.process || []), process],
      };
    });
  };

  const proceed = common?.process?.find((p) => p.id === id)?.nameOfProcess;

  const finishProcess = (id: string) => {
    setCommon((prev) => ({
      ...prev,
      process: prev?.process?.filter((p) => p.id !== id),
    }));
  };

  const updateProcess = (id: string, process: Omit<Process, "id">) => {
    setCommon((prev) => ({
      ...prev,
      process: prev?.process?.map((p) => {
        if (p.id !== id) return p;
        return {
          ...p,
          ...process,
        };
      }),
    }));
  };

  return {
    proceed,
    setProcess,
    finishProcess,
    allProcess,
    updateProcess,
  };
};

export default useProcess;
