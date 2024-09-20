"use client";

import { CollabAccount } from "@/models/collab";
import collabService from "@/service/collab";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React from "react";

export type CollabsListProps = {
    noteId?: string;
    children?: (account?: CollabAccount[]) => any;
    containerProps?: React.HTMLProps<HTMLDivElement>;
}

export default function CollabsList({ noteId, children, containerProps }: CollabsListProps) {
    const collabAcountQuery = useQuery([collabService.collabAccount.name, noteId], async () => {
        return (await collabService.collabAccount(noteId as string)).data.data
    }, {
        enabled: !!noteId
    });

    if (children && collabAcountQuery.data?.length) {
        return children(collabAcountQuery.data);
    }

    if (collabAcountQuery.data?.length) {
        return (
            <div {...containerProps} className={`flex gap-1 items-center w-fit ${containerProps?.className}`}>
                {collabAcountQuery.data?.map((account) => (
                    <Image
                        title={account?.name || ""}
                        key={account.email} height={25} width={25} alt={account?.image || ""}
                        src={account?.image || ""} className="rounded-full object-cover bg-gray-200" />
                ))}
            </div>
        )
    }
    return null
}