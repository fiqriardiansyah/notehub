"use client";

import { formatDate } from "@/lib/utils";
import { Notification } from "@/models/notification";
import collabService from "@/service/collab";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import HTMLReactParser from "html-react-parser";
import Image from "next/image";
import { Button } from "../ui/button";
import themeColor from "tailwindcss/colors";

type ContentNotifHabit = {
    title: string;
    profileImage: string;
    role: string;
    projectTitle: string;
    invitationId: string;
    message?: string;
};

type NotifInvitationProjectProps = {
    notif: Notification<ContentNotifHabit>;
    onClickNotif?: (notif: Notification<ContentNotifHabit>) => void;
}

export default function NotifInvitationProject({ notif, onClickNotif }: NotifInvitationProjectProps) {
    const queryClient = useQueryClient();

    const invitateValidate = useMutation(async (status: string) => {
        return (await collabService.validateInvitationFromNotif({ status, notifId: notif.id, invitationId: notif.content.invitationId })).data.data as Notification<ContentNotifHabit>;
    });

    const onClick = (status: string) => {
        return () => {
            invitateValidate.mutateAsync(status).then(() => {
                queryClient.invalidateQueries({ queryKey: [collabService.getMyCollaborateProject.name], exact: false })
                if (onClickNotif) {
                    onClickNotif(notif);
                }
            });
        }
    }

    const message = notif.content?.message || invitateValidate.data?.content?.message;

    const color = (() => {
        if (message === "accepted") return themeColor.green[200];
        if (message === "rejected") return themeColor.red[200];
        return themeColor.gray[200];
    })()
    return <div className={`text-start flex gap-3 items-start w-full p-3`}>
        <Image src={notif.content.profileImage} alt={notif.content.profileImage} width={30} height={30} className="bg-gray-400 rounded-full object-cover" />
        <div className="flex flex-col">
            <div className="text-xs">{HTMLReactParser(notif.content.title)}</div>
            <span className="text-gray-500 text-xs">{formatDate(notif.createdAt)}</span>
            {message ? (
                <p style={{ background: color }} className="mt-2 px-2 py-1 rounded-md capitalize w-fit text-xs">{message}</p>
            ) : (
                <div className="flex items-center gap-3 mt-3">
                    <Button disabled={invitateValidate.isLoading} onClick={onClick("rejected")} size="sm" variant="ghost">
                        Reject
                    </Button>
                    <Button disabled={invitateValidate.isLoading} onClick={onClick("accepted")} size="sm" variant="default">
                        Accept
                    </Button>
                </div>
            )}
        </div>
    </div>
}