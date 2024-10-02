"use client";

import { EditorProps, toolsDefault } from "@/components/editor";
import dynamic from "next/dynamic";
import React from "react";

const Editor = dynamic(() => import("@/components/editor/index").then((mod) => mod.Editor),
    { ssr: false }
)

type FreetextViewProps = EditorProps;

export default function FreetextView(props: FreetextViewProps) {
    const [freetextEditor, setFreetextEditor] = React.useState<any>(null);

    return <Editor editorRef={setFreetextEditor} tools={toolsDefault} options={{ readOnly: true }} {...props} />
}