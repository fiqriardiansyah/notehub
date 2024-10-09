"use client";

import { EditorProps, toolsDefault } from "@/components/editor/index";
import { WriteContext, WriteContextType } from "@/context/write";
import { useMobileMediaQuery } from "@/hooks/responsive";
import useStatusBar from "@/hooks/use-status-bar";
import { Note } from "@/models/note";
import { Info } from "lucide-react";
import dynamic from "next/dynamic";
import React from "react";

const Editor = dynamic(() => import("@/components/editor/index").then((mod) => mod.Editor),
    { ssr: false }
)

export type FreetextModeEditorProps = EditorProps & {
    children?: React.ReactElement
    onSave?: (data: Partial<Note>) => void;
    showInfoDefault?: boolean;
}

export default function FreetextModeEditor({ onSave, children, showInfoDefault = true, ...props }: FreetextModeEditorProps) {
    const { dataNote } = React.useContext(WriteContext) as WriteContextType;
    const [_, setStatusBar, reset] = useStatusBar();
    const [freetextEditor, setFreetextEditor] = React.useState<any>(null);
    const [showInfo, setShowInfo] = React.useState(true);
    const isMobile = useMobileMediaQuery();

    const onSubmit = async (e: any) => {
        e.preventDefault();

        reset();

        if (!freetextEditor) return;
        const note = await freetextEditor?.save() as Note["note"]

        if (!note?.blocks.length) {
            setStatusBar({
                type: "danger",
                show: true,
                message: "At least type anything you want!",
            });
            return;
        }

        if (onSave) {
            onSave({
                note,
                folderId: dataNote?.folder?.id,
                newFolder: {
                    title: dataNote?.folder?.name,
                },
            });
        }
    }

    return (
        <>
            <h1 className="text-2xl font-light underline mb-2 w-fit">Content</h1>
            <Editor editorRef={setFreetextEditor} tools={toolsDefault} {...props} />
            <form onSubmit={onSubmit} className="h-0 w-0 opacity-0 hidden">
                {children}
            </form>
            {showInfoDefault && isMobile && (
                <div className="w-full flex justify-center my-10">
                    {showInfo && (
                        <p onClick={() => setShowInfo(false)} className="bg-primary rounded-full p-1 pr-2 text-white w-fit flex items-center text-xs text-center">
                            <Info className="mr-2" size={14} />
                            Freetext mode
                        </p>
                    )}
                </div>
            )}
        </>
    )
}