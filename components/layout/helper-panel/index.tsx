"use client";

import { ResizableHandle, ResizablePanel } from "@/components/ui/resizable";
import { CommonContext, CommonContextType } from "@/context/common";
import { fireBridgeEvent, useBridgeEvent } from "@/hooks/use-bridge-event";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import React from "react";
import NoteViewPanel from "./note-view";

export const HELPER_PANEL = "helperPanel";
export const HELPER_PANEL_SET_CONTENT = "helperPanelSetContent";
export const HELPER_PANEL_EXIT = "helperPanelExit";
// contents available
export const HELPER_PANEL_NOTE_VIEW = "helperPanelNoteView";

const MIN_SIZE_PANEL = 40;

export default function HelperPanel() {
    const { common } = React.useContext(CommonContext) as CommonContextType;

    useBridgeEvent(HELPER_PANEL_SET_CONTENT, (payload: { data: any; content: string }) => {
        fireBridgeEvent(payload.content, payload.data);
    })

    if (!common?.helperPanel?.open) return null;
    return (
        <>
            <ResizableHandle withHandle />
            <ResizablePanel minSize={MIN_SIZE_PANEL} order={2} id="resizable-panel-side">
                <ScrollArea className="h-screen">
                    {common?.helperPanel?.content === HELPER_PANEL_NOTE_VIEW && <NoteViewPanel />}
                </ScrollArea>
            </ResizablePanel>
        </>
    )
}