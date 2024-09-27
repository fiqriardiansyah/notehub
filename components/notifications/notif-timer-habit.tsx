"use client";

import { formatDate } from "@/lib/utils";
import { Notification } from "@/models/notification";
import HTMLReactParser from "html-react-parser";
import { useRouter } from "next-nprogress-bar";

type ContentNotifHabit = { title: string, description: string, noteId: string };

type NotifTimerHabitProps = {
    notif: Notification<ContentNotifHabit>;
    onClickNotif?: (notif: Notification<ContentNotifHabit>) => void;
}

export default function NotifTimerHabit({ notif, onClickNotif }: NotifTimerHabitProps) {
    const router = useRouter();

    const onClick = () => {
        if (onClickNotif) {
            onClickNotif(notif);
        }
        router.push(`/habits/${notif.content.noteId}`);
    }

    return <button onClick={onClick} className={`text-start flex flex-col w-full p-3`}>
        <p className="font-semibold flex items-center">
            {!notif.isRead && <div className="w-2 h-2 rounded-full bg-green-400 mr-2 pointer-events-none" />}
            {notif.content.title} ⏱️
        </p>
        <span className="text-[12px] text-gray-700">{formatDate(notif.createdAt)}</span>
        <span className="text-xs text-gray-500">{HTMLReactParser(notif.content.description)}</span>
    </button>
}