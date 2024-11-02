"use client";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Invitation, InvitationData } from "@/models/collab";
import collabService from "@/service/collab";
import { useMutation } from "@tanstack/react-query";
import { RotateCw, UserX } from "lucide-react";
import moment from "moment";
import React from "react";

export type ListAccountInvitedProps = {
  invitations?: Invitation[];
  refresh: () => void;
};

export default function ListAccountInvited({ invitations, refresh }: ListAccountInvitedProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [pickedInv, setPickedInv] = React.useState<Invitation>();

  const sendInviteMutate = useMutation(async (data: InvitationData) => {
    return (await collabService.invite(data)).data.data;
  });

  const cancelInvitationMutate = useMutation(async (id: string) => {
    return (await collabService.cancelInvitation(id)).data.data;
  });

  const onOpenChange = (val: boolean) => {
    setIsOpen(val);
    if (!val) {
      setPickedInv(undefined);
    }
  };

  const onClickCard = (inv: Invitation) => {
    return () => {
      setPickedInv(inv);
      setIsOpen(true);
    };
  };

  const onResend = () => {
    if (!pickedInv) return;
    sendInviteMutate
      .mutateAsync({
        email: pickedInv!.invitedEmail,
        role: pickedInv!.role as any,
        noteId: pickedInv!.noteId,
        noteTitle: pickedInv!.noteTitle,
      })
      .then(() => {
        // [important] notif succes resend email
      });
  };

  const onCancel = () => {
    if (!pickedInv) return;
    cancelInvitationMutate.mutateAsync(pickedInv?.id).finally(() => {
      refresh();
      onOpenChange(false);
    });
  };

  const disable = !!sendInviteMutate.isLoading || !!cancelInvitationMutate.isLoading;

  return (
    <>
      <div className="flex flex-col gap-3">
        {invitations?.map((invitation) => (
          <button key={invitation.id} onClick={onClickCard(invitation)} className="p-2 hover:bg-gray-100 rounded-md text-start">
            <p className="text-sm font-semibold m-0 leading-none">{invitation.invitedEmail}</p>
            <span className="text-xs text-gray-500">
              {invitation.status} . {invitation.role} . {moment(invitation.cretedAt).format("DD MMM YYYY, HH:mm")}
            </span>
          </button>
        ))}
      </div>
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent className="z-50">
          <DrawerHeader>
            <DrawerTitle className="capitalize flex items-center justify-center">
              {pickedInv?.invitedEmail} . {pickedInv?.role}
            </DrawerTitle>
          </DrawerHeader>
          <div className="container-custom flex flex-col gap-3 p-4">
            <Button
              disabled={disable}
              loading={sendInviteMutate.isLoading}
              onClick={onResend}
              variant="ghost"
              className="w-full"
              title="Resend Invitation"
            >
              <RotateCw className="mr-2" size={20} /> Resend Invitation
            </Button>
            <Button
              disabled={disable}
              loading={cancelInvitationMutate.isLoading}
              onClick={onCancel}
              variant="destructive"
              className="w-full"
              title="Cancel Invitation"
            >
              <UserX className="mr-2" size={20} /> Cancel Invitation
            </Button>
            {sendInviteMutate.isError && <p className="text-red-400 text-xs my-4">{(sendInviteMutate.error as any)?.message}</p>}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
