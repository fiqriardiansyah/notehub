"use client";

import { OPEN_SIDE_PANEL } from "@/components/layout/side-panel";
import { NOTIFICATIONS } from "@/components/notifications";
import SearchGlobal from "@/components/search-global";
import { fireBridgeEvent } from "@/hooks/use-bridge-event";
import notificationService from "@/service/notification";
import { useQuery } from "@tanstack/react-query";
import { AlignJustify, Bell } from "lucide-react";

export default function TopBarDesktop() {

    const countUnreadNotifQuery = useQuery([notificationService.countUnreadNotif.name], async () => {
        return (await notificationService.countUnreadNotif()).data.data
    });

    const onClickNotifications = () => {
        fireBridgeEvent(OPEN_SIDE_PANEL, {
            groundOpen: NOTIFICATIONS,
        })
    };

    const onClickMenu = () => {

    }

    return (
        <>
            <header className="w-full h-[50px] container-custom z-50 bg-white border-b border-gray-200 border-solid">
                <nav className="w-full h-full flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <SearchGlobal />
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={onClickNotifications} title="notifications"
                            className="p-1 w-7 h-7 flex items-center justify-center rounded-full text-gray-500 relative">
                            {countUnreadNotifQuery.data ? <div className="absolute -top-1 -right-1 pointer-events-none w-4 h-4 rounded-full bg-gray-800 text-white flex items-center justify-center text-xs">
                                {countUnreadNotifQuery.data}
                            </div> : null}
                            <Bell size={20} />
                        </button>
                        <button onClick={onClickMenu} className="p-1 w-7 h-7 flex items-center justify-center rounded-full text-gray-500">
                            <AlignJustify size={20} />
                        </button>
                    </div>
                </nav>
            </header>
        </>
    );
}
