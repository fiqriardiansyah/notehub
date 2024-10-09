"use client";

import { fireBridgeEvent, useBridgeEvent } from "@/hooks/use-bridge-event";
import SidePanelDesktop from "./desktop";
import SidePanelMobile from "./mobile";
import React from "react";
import { CommonContext, CommonContextType } from "@/context/common";

export const OPEN_SIDE_PANEL = "OPEN_SIDE_PANEL";
export const CLOSE_SIDE_PANEL = "CLOSE_SIDE_PANEL";

export default function SidePanel() {
    const { setCommon } = React.useContext(CommonContext) as CommonContextType;

    useBridgeEvent(OPEN_SIDE_PANEL, (payload: { groundOpen: string, payload: any }) => {
        setCommon((prev) => ({ ...prev, sidePageOpen: true, groundOpen: payload?.groundOpen }));
        setTimeout(() => {
            fireBridgeEvent(payload?.groundOpen, payload?.payload);
        }, 300);
    });

    useBridgeEvent(CLOSE_SIDE_PANEL, () => {
        setCommon((prev) => ({ ...prev, sidePageOpen: false, groundOpen: undefined }));
    });

    return null;
}

SidePanel.Mobile = SidePanelMobile;
SidePanel.Desktop = SidePanelDesktop;
