import { CommonContext, CommonContextType } from "@/context/common";
import { pause } from "@/lib/utils";
import React from "react";

export default function useSidePage<T = any>() {
    const { setCommon, common, triggerCallbackPayload } = React.useContext(CommonContext) as CommonContextType<T>;

    const setContent = (type: string, payload?: T) => {
        if (payload) {
            triggerCallbackPayload(type, payload);
            return;
        }
        setCommon((prev) => ({
            ...prev,
            sidePageOpen: true,
            groundOpen: type,
        }));
    }

    const reset = async () => {
        setCommon((prev) => ({ ...prev, sidePageOpen: false }));
        await pause(0.3);
        setCommon((prev) => ({ ...prev, groundOpen: undefined }));
    }

    const isOpen = common?.sidePageOpen;

    return [setContent, reset, isOpen] as [(type: string, payload?: any) => void, () => void, boolean]
}