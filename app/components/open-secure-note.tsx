"use client";

import { WriteContext, WriteContextType } from "@/context/write";
import { LockKeyhole } from "lucide-react";
import React from "react";
import ConfirmSecure from "../secure-password/confirm-secure";

export type OpenSecureNoteProps = {
    refetch?: () => void;
}

export default function OpenSecureNote({ refetch }: OpenSecureNoteProps) {
    const { setDataNote } = React.useContext(WriteContext) as WriteContextType;

    const onFinish = async (val: boolean) => {
        if (val) {
            if (refetch) refetch();
            setDataNote((prev) => ({
                ...prev,
                authorized: true,
            }));
        }
    }

    return (
        <div className="w-full h-full fixed top-0 left-0 right-0 bottom-0 z-10 bg-white flex flex-col items-center justify-center gap-5 container-custom">
            <LockKeyhole className="" size={100} />
            <div className="w-[300px]">
                <ConfirmSecure onFinish={onFinish} />
            </div>
        </div>
    )
}