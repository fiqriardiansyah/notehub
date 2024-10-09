"use client";

import { OPEN_SIDE_PANEL } from "@/components/layout/side-panel";
import { NOTIFICATIONS } from "@/components/notifications";
import SearchGlobal from "@/components/search-global";
import { useMobileMediaQuery } from "@/hooks/responsive";
import { fireBridgeEvent } from "@/hooks/use-bridge-event";
import useToggleHideNav from "@/hooks/use-toggle-hide-nav";
import { easeDefault } from "@/lib/utils";
import notificationService from "@/service/notification";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { AlignJustify, Bell } from "lucide-react";
import Link from "next/link";

export default function TopBarMobile() {
    const isNavHide = useToggleHideNav();
    const isMobile = useMobileMediaQuery();

    const countUnreadNotifQuery = useQuery([notificationService.countUnreadNotif.name], async () => {
        return (await notificationService.countUnreadNotif()).data.data
    });

    const onClickNotifications = () => {
        fireBridgeEvent(OPEN_SIDE_PANEL, {
            groundOpen: NOTIFICATIONS
        })
    };

    if (!isMobile) return null;
    return (
        <>
            <motion.header
                animate={{ y: isNavHide ? "-100%" : 0 }}
                transition={{ ease: easeDefault }}
                style={{ pointerEvents: isNavHide ? "none" : "auto" }}
                className="fixed top-0 left-0 right-0 w-screen container-custom z-50 bg-white">
                <nav className="w-full flex items-center justify-between gap-3 py-2">
                    <div className="flex items-center gap-2">
                        <Link href="/" className="hidden md:block">
                            <h1 className="text-gray-700 font-semibold text-xl">NoteHub</h1>
                        </Link>
                        <div className="block md:hidden">
                            <SearchGlobal />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={onClickNotifications} title="notifications"
                            className="p-1 w-7 h-7 flex items-center justify-center rounded-full text-gray-500 relative">
                            {countUnreadNotifQuery.data ? <div className="absolute -top-1 -right-1 pointer-events-none w-4 h-4 rounded-full bg-gray-800 text-white flex items-center justify-center text-xs">
                                {countUnreadNotifQuery.data}
                            </div> : null}
                            <Bell size={20} />
                        </button>
                        <button className="p-1 w-7 h-7 flex items-center justify-center rounded-full text-gray-500">
                            <AlignJustify size={20} />
                        </button>
                    </div>
                </nav>
            </motion.header>
            <div className="h-[50px] pointer-events-none" />
        </>
    );
}
