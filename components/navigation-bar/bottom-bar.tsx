"use client";

import { useMobileMediaQuery } from "@/hooks/responsive";
import habitsService from "@/service/habits";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import themeColor from "tailwindcss/colors";
import RenderNavigation from "./render-navigation";
import { navigation } from "./utils";

export default function BottomBar() {
  const isMobile = useMobileMediaQuery();

  const habitsToday = useQuery([habitsService.getUrgentHabit.name, "habitstoday"], async () => {
    return (await habitsService.getUrgentHabit()).data.data;
  });

  if (!isMobile) return null;
  return (
    <div className="fixed bottom-0 left-0 right-0 w-screen z-50 bg-white">
      <div className="w-full flex items-center justify-around py-3 container-custom ">
        <RenderNavigation item={navigation.home} />
        <RenderNavigation item={navigation.collaborate} />
        <RenderNavigation item={navigation.write} />
        <RenderNavigation item={navigation.habits}>
          {(Item) => (
            <Link style={{ color: Item.isActive(Item.pathname) ? themeColor.gray[700] : themeColor.gray[400] }} className="relative" href={Item.href}>
              {!habitsToday.isLoading && habitsToday.data?.length ? (
                <span className="absolute -top-[10px] -right-[10px] w-5 h-5 rounded-full bg-yellow-500 text-white text-xs font-semibold flex items-center justify-center">
                  {habitsToday.data?.length}
                </span>
              ) : null}
              <Item.icon />
            </Link>
          )}
        </RenderNavigation>
        <RenderNavigation item={navigation.insight} />
      </div>
    </div>
  );
}
