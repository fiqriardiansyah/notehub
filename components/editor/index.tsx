import Checklist from "@editorjs/checklist";
import EditorJS, { ToolConstructable, ToolSettings } from "@editorjs/editorjs";
import Header from "@editorjs/header";
import LinkTool from "@editorjs/link";
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import React, { useEffect, useState } from "react";

const tools = {
    header: {
        class: Header as any,
        inlineToolbar: true
    },
    list: {
        class: List,
        inlineToolbar: true
    },
    linkTool: {
        class: LinkTool,
    },
    checklist: {
        class: Checklist,
        inlineToolbar: true,
    },
    quote: {
        class: Quote,
        inlineToolbar: true
    }
}

export const useEditor = (
    toolsList: { [toolName: string]: ToolConstructable | ToolSettings<any> },
    { data, editorRef }: any,
    options: EditorJS.EditorConfig = {}
) => {
    const [editorInstance, setEditor] = useState<EditorJS>()
    const {
        data: ignoreData,
        tools: ignoreTools,
        holder: ignoreHolder,
        ...editorOptions
    } = options

    // initialize
    useEffect(() => {
        // create instance
        const editor = new EditorJS({
            placeholder: "Type anything here...",
            holder: "editor-js",
            tools: toolsList,
            data: data || {},
            initialBlock: "paragraph",
            ...editorOptions,
        })

        if (editorInstance) return;
        setEditor(editor);

    }, [toolsList])

    // set reference
    useEffect(() => {
        if (!editorInstance) {
            return
        }
        // Send instance to the parent
        if (editorRef) {
            editorRef(editorInstance)
        }
    }, [editorInstance, editorRef])

    return { editor: editorInstance }
}

export const Editor = ({ editorRef, children, data, options }: any) => {
    useEditor(tools, { data, editorRef }, options)

    return (
        <div className="relative">
            {!children && <div className="container" id="editor-js"></div>}
            {children}
        </div>
    )
}