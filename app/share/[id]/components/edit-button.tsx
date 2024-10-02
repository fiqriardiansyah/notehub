"use client";

import { Button } from "@/components/ui/button";
import { NoteShared } from "@/models/share";
import noteService from "@/service/note";
import { useMutation } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next-nprogress-bar";
import { useParams } from "next/navigation";

type EditButtonProps = {
    note?: NoteShared
}

export default function EditButton({ note }: EditButtonProps) {
    const param = useParams();
    const session = useSession();
    const router = useRouter();

    const link = param.id;

    const getIdNoteFromLink = useMutation(async (lnk: string) => {
        return (await noteService.getIdNoteFromLink(lnk)).data.data
    })

    const onClickEdit = () => {
        getIdNoteFromLink.mutateAsync(link as string).then((id) => {
            router.push(`/write/${id}`);
        })
    }

    if (session?.data?.user?.id !== note?.ownerId) return null;
    return (
        <>
            <Button loading={getIdNoteFromLink.isLoading} onClick={onClickEdit} variant="secondary" size="sm" className="flex items-center gap-2 my-5">
                <ExternalLink size={16} />
                Edit this note
            </Button>
            {getIdNoteFromLink.isError && <span className="text-red-500 text-sm my-2">{(getIdNoteFromLink.error as Error)?.message}</span>}
        </>
    )
}