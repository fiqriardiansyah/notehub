"use client";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { CollabAccount } from "@/models/collab";
import collabService from "@/service/collab";
import { useMutation } from "@tanstack/react-query";
import { Check, UserX } from "lucide-react";
import Image from "next/image";
import React from "react";

export type ListAccountCollabProps = {
    collabAccount?: CollabAccount[];
    refresh: () => void;
}

export default function ListAccountCollab({ collabAccount, refresh }: ListAccountCollabProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [pickedAcc, setPickedAcc] = React.useState<CollabAccount>();

    const removeCollab = useMutation(async (id: string) => {
        return (await collabService.removeCollab(id)).data.data;
    });

    const changeRole = useMutation(async (data: { id: string; role: string }) => {
        return (await collabService.changeRoleCollab(data.id, data.role)).data.data;
    })

    const onOpenChange = (val: boolean) => {
        setIsOpen(val);
        if (!val) {
            setPickedAcc(undefined);
        }
    }

    const onClickCard = (account: CollabAccount) => {
        return () => {
            setPickedAcc(account);
            setIsOpen(true);
        }
    }

    const onRemove = () => {
        if (!pickedAcc?.id) return;
        removeCollab.mutateAsync(pickedAcc.id).then(() => {
            refresh();
            onOpenChange(false);
        });
    }

    const onToggleRole = (role: string) => {
        return () => {
            if (!pickedAcc) return;
            setPickedAcc((prev) => ({ ...prev, role }));
            changeRole.mutateAsync({ id: pickedAcc.id as string, role }).then(() => {
                refresh();
            }).catch(() => {
                setPickedAcc((prev) => ({ ...prev, role: role === "editor" ? "viewer" : "editor" }))
            });
        }
    }

    const disableButton = !!removeCollab.isLoading || changeRole.isLoading;

    return (
        <>
            <div className="flex flex-col gap-3">
                {collabAccount?.length ? <p>Collaborators</p> : null}
                {collabAccount?.map((account) => (
                    <button onClick={onClickCard(account)} className="p-2 text-start hover:bg-gray-100 rounded-md flex gap-4" key={account.email}>
                        <Image height={40} width={40} alt={account?.image || ""} src={account?.image || ""} className="rounded-full object-cover bg-gray-200" />
                        <div className="flex flex-col">
                            <p className="m-0 leading-none font-semibold text-sm capitalize">{account?.name}</p>
                            <span className="m-0 leading-none text-xs text-gray-500 mt-[2px]">{account?.email} . {account?.role}</span>
                        </div>
                    </button>
                ))}
            </div>
            <Drawer open={isOpen} onOpenChange={onOpenChange}>
                <DrawerContent className="z-50">
                    <DrawerHeader>
                        <DrawerTitle className="capitalize flex items-center justify-center">
                            {pickedAcc?.name} . {pickedAcc?.role}
                        </DrawerTitle>
                    </DrawerHeader>
                    <div className="container-custom flex flex-col gap-3 p-4">
                        <div className="flex gap-4 w-full">
                            <Button disabled={disableButton} onClick={onToggleRole("editor")} className="flex-1" variant={pickedAcc?.role === "editor" ? "default" : "ghost"}>
                                {pickedAcc?.role === "editor" && <Check className="mr-2" />} Editor
                            </Button>
                            <Button disabled={disableButton} onClick={onToggleRole("viewer")} className="flex-1" variant={pickedAcc?.role === "viewer" ? "default" : "ghost"}>
                                {pickedAcc?.role === "viewer" && <Check className="mr-2" />} Viewer
                            </Button>
                        </div>
                        <Button loading={removeCollab.isLoading} disabled={disableButton} onClick={onRemove} variant="destructive" className="w-full" title="Resend Invitation">
                            <UserX className="mr-2" size={20} /> Remove Account
                        </Button>
                        {removeCollab.isError && <p className='text-red-400 text-xs my-4'>{(removeCollab.error as any)?.message}</p>}
                    </div>
                </DrawerContent>
            </Drawer>
        </>
    )
}