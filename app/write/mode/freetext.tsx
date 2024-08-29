"use client";

import { EditorProps, toolsDefault } from "@/components/editor/index";
import { WriteContext, WriteContextType } from "@/context/write";
import useStatusBar from "@/hooks/use-status-bar";
import { Note } from "@/models/note";
import dynamic from "next/dynamic";
import React from "react";

const Editor = dynamic(() => import("@/components/editor/index").then((mod) => mod.Editor),
    { ssr: false }
)

export type FreetextModeEditorProps = EditorProps & {
    children?: React.ReactElement
    onSave?: (data: Partial<Note>) => void;
}

export default function FreetextModeEditor({ onSave, children, ...props }: FreetextModeEditorProps) {
    const { dataNote } = React.useContext(WriteContext) as WriteContextType;
    const [_, setStatusBar, reset] = useStatusBar();
    const [freetextEditor, setFreetextEditor] = React.useState<any>(null);

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
            <Editor editorRef={setFreetextEditor} tools={toolsDefault} {...props} />
            <form onSubmit={onSubmit} className="h-0 w-0 opacity-0 hidden">
                {children}
            </form>
        </>
    )
}