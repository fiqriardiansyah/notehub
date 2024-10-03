"use client";

import StateRender from "@/components/state-render";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { NoteContext, NoteContextType } from "@/context/note";
import noteService from "@/service/note";
import { CheckedState } from "@radix-ui/react-checkbox";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Copy, ExternalLink, Trash } from "lucide-react";
import React from "react";

export default function GetLink() {
    const { note } = React.useContext(NoteContext) as NoteContextType;
    const [checked, setChecked] = React.useState<CheckedState>(false);
    const { toast } = useToast();

    const generateLink = useMutation(async (noteId: string) => {
        return (await noteService.generateShareLink(noteId)).data.data;
    });

    const getShareLink = useQuery([noteService.getShareLink.name, note?.note?.id], async () => {
        return (await noteService.getShareLink(note!.note!.id)).data.data;
    }, {
        enabled: !!note?.note?.id,
    });

    const deleteShareLink = useMutation(async (id: string) => {
        return (await noteService.deleteShareLink(id)).data.data;
    })

    const shareLink = !getShareLink.data?.link ? null : process.env.NEXT_PUBLIC_DOMAIN + "/share/" + getShareLink.data?.link;

    const onCheckedChange = (val: CheckedState) => {
        setChecked(val);
    }

    const onClickGenerate = () => {
        if (generateLink.isLoading) return;
        if (!note?.note?.id) {
            toast({ description: "Corresponding note not found", variant: "destructive" });
            return;
        }
        generateLink.mutateAsync(note?.note?.id).then(() => getShareLink.refetch())
    }

    const onClickDelete = () => {
        deleteShareLink.mutateAsync(getShareLink.data?.id as string).then(() => getShareLink.refetch());
    }

    const onClickCopyToClipboard = () => {
        if (!shareLink) return;
        if ("clipboard" in navigator) {
            navigator.clipboard.writeText(shareLink).then(function () {
                toast({
                    description: "Link copied to clipboard!",
                    variant: "default"
                })
            }, function (err) {
                console.error('Async: Could not copy text: ', err);
            });
        } else {
            console.error("navigator clipboard not supported in this browser");
        }
    }

    return <div className="flex flex-col gap-5">
        <StateRender data={getShareLink.data} isLoading={getShareLink.isLoading} isError={getShareLink.isError}>
            <StateRender.Data>
                <Card className="">
                    <CardHeader>
                        <div className="w-full flex justify-end gap-4">
                            <a href={shareLink || ""} target="_blank" className="text-gray-600" title="open link">
                                <ExternalLink size={16} />
                            </a>
                            <button onClick={onClickCopyToClipboard} className="text-gray-600" title="copy">
                                <Copy size={16} />
                            </button>
                            <button disabled={deleteShareLink.isLoading} onClick={onClickDelete} className="text-red-500" title="delete">
                                <Trash size={16} />
                            </button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <span className="text-xs text-gray-500 mt-4 break-all">
                            {shareLink}
                        </span>
                    </CardContent>
                </Card>
            </StateRender.Data>
            <StateRender.Loading>
                <Card className="pt-2">
                    <CardContent>
                        <Skeleton className="w-[250px] h-[20px] mb-2" />
                        <Skeleton className="w-[300px] h-[20px] mb-2" />
                        <Skeleton className="w-[200px] h-[20px]" />
                    </CardContent>
                </Card>
            </StateRender.Loading>
            <StateRender.Error>
                <p className="m-0 text-red-400 text-xs">{(getShareLink.error as any)?.message}</p>
            </StateRender.Error>
        </StateRender>
        {!getShareLink.data && (
            <div className="flex flex-col gap-2">
                <label htmlFor="share" className="text-sm">
                    <Checkbox checked={checked} onCheckedChange={onCheckedChange} id="share" className="mr-2" />
                    Anybody with this link can access (Read)
                </label>
                <Button loading={generateLink.isLoading} onClick={onClickGenerate} disabled={!checked || getShareLink.isLoading}>
                    Generate link
                </Button>
            </div>
        )}
    </div>
}