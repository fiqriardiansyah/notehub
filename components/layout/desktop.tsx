"use client";

import { CommonContext, CommonContextType } from "@/context/common";
import { fireBridgeEvent, useBridgeEvent } from "@/hooks/use-bridge-event";
import { cn } from "@/lib/utils";
import React from "react";
import SideBar from "../navigation-bar/side-bar";
import TopBarDesktop from "../navigation-bar/top-bar/desktop";
import StatusBar from "../status-bar";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../ui/resizable";
import { ScrollArea } from "../ui/scroll-area";
import HelperPanel, { HELPER_PANEL, HELPER_PANEL_EXIT, HELPER_PANEL_SET_CONTENT } from "./helper-panel";
import SidePanel from "./side-panel";

const navCollapsedSize = 4;

export default function DesktopLayout({ children }: { children: any }) {
    const { defaultLayoutResizable, setIsDesktopSidebarCollapsed, isDesktopSidebarCollapsed, setCommon } = React.useContext(CommonContext) as CommonContextType;

    useBridgeEvent(HELPER_PANEL, (payload: { data: any, content: string }) => {
        setCommon((prev) => ({ ...prev, helperPanel: { open: true, content: payload.content } }));
        const timeout = setTimeout(() => {
            fireBridgeEvent(HELPER_PANEL_SET_CONTENT, payload);
            clearTimeout(timeout);
        }, 100);
    });

    useBridgeEvent(HELPER_PANEL_EXIT, () => {
        setCommon((prev) => ({ ...prev, helperPanel: undefined }));
    })

    return (
        <ResizablePanelGroup
            direction="horizontal"
            onLayout={(sizes: number[]) => {
                document.cookie = `react-resizable-panels:layout:mail=${JSON.stringify(
                    sizes
                )}`
            }}
            className="!h-screen items-stretch sticky top-0 left-0"
        >
            <ResizablePanel
                defaultSize={defaultLayoutResizable[0]}
                collapsedSize={navCollapsedSize}
                collapsible={true}
                minSize={13}
                maxSize={17}
                onCollapse={() => {
                    setIsDesktopSidebarCollapsed(true)
                    document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
                        true
                    )}`
                }}
                onResize={() => {
                    setIsDesktopSidebarCollapsed(false)
                    document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
                        false
                    )}`
                }}
                className={cn(
                    isDesktopSidebarCollapsed &&
                    "min-w-[55px] transition-all duration-300 ease-in-out"
                )}
            >
                <ScrollArea className="h-screen">
                    <SideBar isCollapsed={isDesktopSidebarCollapsed} />
                </ScrollArea>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={defaultLayoutResizable[1]} minSize={50} className="flex flex-col" >
                <TopBarDesktop />
                <ResizablePanelGroup direction="horizontal" className="flex-1">
                    <ResizablePanel defaultSize={defaultLayoutResizable[1]} minSize={40} >
                        <ScrollArea className="!h-full relative">
                            <StatusBar />
                            {children}
                        </ScrollArea>
                    </ResizablePanel>
                    <SidePanel.Desktop />
                    <HelperPanel />
                </ResizablePanelGroup>
            </ResizablePanel>
        </ResizablePanelGroup>
    );
}