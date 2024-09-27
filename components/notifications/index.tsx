"use client";

import notificationService from "@/service/notification";
import { useQuery } from "@tanstack/react-query";
import StateRender from "../state-render";
import CardNotif from "./card-notif";
import themeColor from "tailwindcss/colors";
import emptyAnim from "@/asset/animation/empty.json"
import Lottie from "react-lottie";

const defaultOptions = {
    animationData: emptyAnim,
    loop: true,
    autoplay: true,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

export const NOTIFICATIONS = "notifications";

export const NOTIFICATION_TIMER_HABITS = "notification-timer-habits";
export const NOTIFICATION_INVITE_TO_PROJECT = "notification-invite-to-project";

export const NOTIFICATIONS_TYPE = [
    {
        type: NOTIFICATION_TIMER_HABITS,
        color: themeColor.green[400],
    },
    {
        type: NOTIFICATION_INVITE_TO_PROJECT,
        color: themeColor.blue[400],
    }
]

export const getNotificationType = (type: string) => {
    return NOTIFICATIONS_TYPE.find((n) => n.type === type);
}

export default function Notifications() {
    const notificationQuery = useQuery([notificationService.getAllNotif.name], async () => {
        return (await notificationService.getAllNotif(1)).data.data;
    });

    return (
        <div className="w-full h-full flex flex-col gap-6 p-3">
            <h1 className="font-semibold">Notifications</h1>
            <StateRender data={notificationQuery.data} isLoading={notificationQuery.isLoading} isError={notificationQuery.isError}>
                <StateRender.Loading>
                    <p>Getting Notif...</p>
                </StateRender.Loading>
                <StateRender.Error>
                    <p className="m-0 text-red-400">{(notificationQuery.error as any)?.message}</p>
                </StateRender.Error>
                <StateRender.Data>
                    <div className="flex flex-col gap-2">
                        {notificationQuery.data?.map((notif) => (
                            <CardNotif key={notif.id} notif={notif} />
                        ))}
                        {!notificationQuery.data?.length ? <div className="flex flex-col gap-2 items-center h-[400px] justify-center">
                            <Lottie
                                style={{ pointerEvents: 'none' }}
                                options={defaultOptions}
                                height={200} width={200} />
                            <p>There is no notif :(</p>
                        </div> : null}
                    </div>
                </StateRender.Data>
            </StateRender>
        </div>
    );
}