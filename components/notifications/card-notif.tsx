"use client";

import { Notification } from "@/models/notification";
import notificationService from "@/service/notification";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import React from "react";
import { getNotificationType, NOTIFICATION_INVITE_TO_PROJECT, NOTIFICATION_TIMER_HABITS } from ".";
import { Card } from "../ui/card";
import NotifTimerHabit from "./notif-timer-habit";
import NotifInvitationProject from "./notif-invitation-project";

export type CardNotifProps = {
    notif: Notification;
}

export default function CardNotif({ notif }: CardNotifProps) {
    const [isDeleted, setIsDeleted] = React.useState(false);
    const [isRead, setIsRead] = React.useState(false);
    const queryClient = useQueryClient();

    const readNotifMutate = useMutation(async () => {
        return (await notificationService.readNotif(notif.id)).data.data;
    });

    const deleteNotifMutate = useMutation(async () => {
        return (await notificationService.deleteNotif(notif.id)).data.data;
    })

    const onClickNotif = (nt: Notification) => {
        readNotifMutate.mutateAsync().then(() => {
            queryClient.invalidateQueries({ queryKey: [notificationService.getAllNotif.name] });
            queryClient.invalidateQueries({ queryKey: [notificationService.countUnreadNotif.name] });
        });
        setIsRead(true);
    }

    const onClickDelete = (e: any) => {
        e.stopPropagation();
        deleteNotifMutate.mutateAsync().then(() => queryClient.invalidateQueries({ queryKey: [notificationService.getAllNotif.name] }))
        setIsDeleted(true);
    }

    const typeNotif = getNotificationType(notif.type);

    if (isDeleted) return null;
    return (
        <Card className="flex gap-1">
            {notif.type === NOTIFICATION_TIMER_HABITS && <NotifTimerHabit onClickNotif={onClickNotif} notif={{ ...notif, isRead: notif.isRead ?? isRead }} />}
            {notif.type === NOTIFICATION_INVITE_TO_PROJECT && <NotifInvitationProject onClickNotif={onClickNotif} notif={{ ...notif, isRead: notif.isRead ?? isRead }} />}
            <div className="h-full p-2">
                <button onClick={onClickDelete} className="text-gray-600">
                    <X size={16} />
                </button>
            </div>
        </Card>
    )
}