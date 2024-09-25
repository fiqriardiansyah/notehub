"use client";

import habitsService from "@/service/habits";
import { useQuery } from "@tanstack/react-query";
import { Blocks, House, PanelsTopLeft, Plus, Trophy } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import themeColor from 'tailwindcss/colors';

export default function BottomBar() {
    const pathname = usePathname();

    const habitsToday = useQuery([habitsService.getUrgentHabit.name, "habitstoday"], async () => {
        return (await habitsService.getUrgentHabit()).data.data;
    });

    return (
        <div className="fixed bottom-0 left-0 right-0 w-screen z-50 bg-white">
            <div className="w-full flex items-center justify-around py-3 container-custom ">
                <Link style={{ color: pathname === "/" ? themeColor.gray[700] : themeColor.gray[400] }} href="/"><House /></Link>
                <Link style={{ color: pathname.includes("/collaborate") ? themeColor.gray[700] : themeColor.gray[400] }} href="/collaborate"><Blocks /></Link>
                <Link style={{ color: pathname.includes("/write") ? themeColor.gray[700] : themeColor.gray[400] }} href="/write"><Plus /></Link>
                <Link style={{ color: pathname.includes("/habits") ? themeColor.gray[700] : themeColor.gray[400] }} className="relative" href="/habits">
                    {(!habitsToday.isLoading
                        && habitsToday.data?.length)
                        ? <span className="absolute -top-[10px] -right-[10px] w-5 h-5 rounded-full bg-yellow-500 text-white text-xs font-semibold flex items-center justify-center">
                            {habitsToday.data?.length}
                        </span> : null}
                    <Trophy />
                </Link>
                <Link style={{ color: themeColor.gray[400] }} href="#"><PanelsTopLeft /></Link>
            </div>
        </div>
    )
}