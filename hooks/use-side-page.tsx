import { CommonContext, CommonContextType } from "@/context/common";
import { pause } from "@/lib/utils";
import React from "react";

export default function useSidePage() {
    const { setCommon, common } = React.useContext(CommonContext) as CommonContextType;

    const setContent = (type: string) => {
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

    return [setContent, reset, isOpen] as [(type: string) => void, () => void, boolean]
}