"use client";

import { CommonContext, CommonContextType } from "@/context/common";
import { cn } from "@/lib/utils";
import React from "react";
import SideBar from "../navigation-bar/side-bar";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../ui/resizable";
import { ScrollArea } from "../ui/scroll-area";
import SidePanel from "./side-panel";
import TopBarDesktop from "../navigation-bar/top-bar/desktop";
import StatusBar from "../status-bar";

const navCollapsedSize = 4;

export default function DesktopLayout({ children }: { children: any }) {
    const { defaultLayoutResizable, setIsDesktopSidebarCollapsed, isDesktopSidebarCollapsed } = React.useContext(CommonContext) as CommonContextType;

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
            <ResizablePanel defaultSize={defaultLayoutResizable[1]} minSize={50} >
                <TopBarDesktop />
                <ResizablePanelGroup direction="horizontal" className="!h-[92%]">
                    <ResizablePanel defaultSize={defaultLayoutResizable[1]} minSize={60} >
                        <ScrollArea className="!h-full relative">
                            <StatusBar />
                            {children}
                        </ScrollArea>
                    </ResizablePanel>
                    <SidePanel.Desktop />
                </ResizablePanelGroup>
            </ResizablePanel>
        </ResizablePanelGroup>
    );
}