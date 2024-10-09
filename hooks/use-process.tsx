import { CommonContext, CommonContextType } from "@/context/common";
import React from "react";

const useProcess = (id?: string) => {
    const { common, setCommon } = React.useContext(CommonContext) as CommonContextType;

    const setProcess = (process: { id: string, nameOfProcess: string }) => {
        setCommon((prev) => {
            if (prev.process?.find((p) => p.id === process.id && process.nameOfProcess === p.nameOfProcess)) {
                return prev;
            }
            return {
                ...prev,
                process: [...(prev?.process || []), process],
            }
        });
    }

    const proceed = common?.process?.find((p) => p.id === id)?.nameOfProcess;

    const finishProcess = (id: string) => {
        setCommon((prev) => ({ ...prev, process: prev?.process?.filter((p) => p.id !== id) }));
    }

    return {
        proceed,
        setProcess,
        finishProcess,
    }
}

export default useProcess