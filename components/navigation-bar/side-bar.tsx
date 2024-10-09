"use client";

import { cn } from "@/lib/utils";
import habitsService from "@/service/habits";
import { useQuery } from "@tanstack/react-query";
import { Codesandbox } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import RenderNavigation from "./render-navigation";
import { navigation } from "./utils";

export type SideBarProps = {
    isCollapsed?: boolean;
}

export default function SideBar({ isCollapsed }: SideBarProps) {

    const habitsToday = useQuery([habitsService.getUrgentHabit.name, "habitstoday"], async () => {
        return (await habitsService.getUrgentHabit()).data.data;
    });

    return (
        <header className="w-full h-screen overscroll-y-auto bg-primary-foreground flex flex-col sticky top-0 left-0">
            <div className="w-full !h-[50px] flex items-center justify-center gap-2 border-b border-solid border-gray-200">
                <Codesandbox />
                {!isCollapsed && <h1>Notehub</h1>}
            </div>
            <ScrollArea className="h-[90vh] flex flex-col gap-3 py-3">
                <div className="flex flex-col gap-1 px-2">
                    <RenderNavigation isCollapsed={isCollapsed} mode="desktop" item={navigation.home} />
                    <RenderNavigation isCollapsed={isCollapsed} mode="desktop" item={navigation.collaborate} />
                    <RenderNavigation isCollapsed={isCollapsed} mode="desktop" item={navigation.write} />
                    <RenderNavigation isCollapsed={isCollapsed} mode="desktop" item={navigation.habits} postfixComponent={(item) => {
                        if (habitsToday.isLoading || !habitsToday.data?.length) return null;
                        return (
                            <span className={cn(
                                'w-5 h-5 rounded-full text-xs font-semibold flex items-center justify-center',
                                isCollapsed ? "absolute -top-1 -right-1" : "absolute top-1/2 transform -translate-y-1/2 right-1",
                                item?.isActive(item.pathname) ? "bg-white text-black" : "bg-yellow-400 text-white"
                            )}>
                                {habitsToday.data?.length}
                            </span>
                        )
                    }} />
                    <RenderNavigation isCollapsed={isCollapsed} mode="desktop" item={navigation.xixi} />
                </div>
            </ScrollArea>
        </header>
    )
}