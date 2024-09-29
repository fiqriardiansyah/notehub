"use client";

import { formatDate } from "@/lib/utils";
import { Notification } from "@/models/notification";
import HTMLReactParser from "html-react-parser";
import Image from "next/image";

type ContentNotifHabit = {
    title: string;
    profileImage: string;
};

type NotifJoinStatusProjectProps = {
    notif: Notification<ContentNotifHabit>;
    onClickNotif?: (notif: Notification<ContentNotifHabit>) => void;
}

export default function NotifJoinStatusProject({ notif, onClickNotif }: NotifJoinStatusProjectProps) {

    const onClick = () => {
        return () => {
            if (onClickNotif) {
                onClickNotif(notif);
            }
        }
    }

    return <button onClick={onClick} className={`text-start flex gap-3 items-start w-full p-3`}>
        <Image src={notif.content.profileImage} alt={notif.content.profileImage} width={30} height={30} className="bg-gray-400 rounded-full object-cover" />
        <div className="flex flex-col">
            <div className="text-xs">{HTMLReactParser(notif.content.title)}</div>
            <span className="text-gray-500 text-xs">{formatDate(notif.createdAt)}</span>
        </div>
    </button>
}