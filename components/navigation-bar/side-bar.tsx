"use client";

import { cn } from "@/lib/utils";
import habitsService from "@/service/habits";
import { useQuery } from "@tanstack/react-query";
import { Codesandbox, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import RenderNavigation from "./render-navigation";
import { navigation } from "./utils";
import React from "react";
import { Separator } from "../ui/separator";
import NotespacehubIcon from "@/asset/svg/notespacehub-icon.svg";

export type SideBarProps = {
  isCollapsed?: boolean;
};

export default function SideBar({ isCollapsed }: SideBarProps) {
  const session = useSession();
  const [loading, setLoading] = React.useState(false);

  const onLogout = () => {
    signOut();
    setLoading(true);
  };

  const habitsToday = useQuery([habitsService.getUrgentHabit.name, "habitstoday"], async () => {
    return (await habitsService.getUrgentHabit()).data.data;
  });

  return (
    <header className="w-full h-screen overscroll-y-auto bg-primary-foreground flex flex-col sticky top-0 left-0">
      <div className="w-full !h-[50px] flex items-center justify-center gap-2 border-b border-solid border-gray-200">
        <Image width={20} height={20} src={NotespacehubIcon} alt="notespacehub" />
        {!isCollapsed && <h1>Notespacehub</h1>}
      </div>
      <ScrollArea className="flex flex-1 flex-col gap-3 py-3">
        <div className="flex flex-col gap-1 px-2">
          <RenderNavigation isCollapsed={isCollapsed} mode="desktop" item={navigation.home} />
          <RenderNavigation isCollapsed={isCollapsed} mode="desktop" item={navigation.collaborate} />
          <RenderNavigation isCollapsed={isCollapsed} mode="desktop" item={navigation.write} />
          <RenderNavigation
            isCollapsed={isCollapsed}
            mode="desktop"
            item={navigation.habits}
            postfixComponent={(item) => {
              if (habitsToday.isLoading || !habitsToday.data?.length) return null;
              return (
                <span
                  className={cn(
                    "w-5 h-5 rounded-full text-xs font-semibold flex items-center justify-center",
                    isCollapsed ? "absolute -top-1 -right-1" : "absolute top-1/2 transform -translate-y-1/2 right-1",
                    item?.isActive(item.pathname) ? "bg-white text-black" : "bg-yellow-400 text-white"
                  )}
                >
                  {habitsToday.data?.length}
                </span>
              );
            }}
          />
          <Separator />
          <RenderNavigation isCollapsed={isCollapsed} mode="desktop" item={navigation.insight} />
        </div>
      </ScrollArea>
      <div className="w-full flex flex-col gap-2 border-t border-solid border-gray-200 p-2">
        <div className="flex items-center gap-2">
          <Image
            title={session?.data?.user?.name || ""}
            src={session?.data?.user?.image || ""}
            alt={session?.data?.user?.name || ""}
            width={40}
            height={40}
            className="rounded-full bg-gray-100 bg-cover"
          />
          {!isCollapsed && <p className="m-0 text-xs text-gray-700">{session?.data?.user?.name}</p>}
        </div>
        <Button
          loading={loading}
          onClick={onLogout}
          size={isCollapsed ? "icon" : "sm"}
          variant="secondary"
          title="Logout from account"
          className="flex gap-3 text-red-400"
        >
          <LogOut />
          {!isCollapsed && "Logout"}
        </Button>
      </div>
    </header>
  );
}
