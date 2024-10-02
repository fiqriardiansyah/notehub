import Checklist from "@editorjs/checklist";
import EditorJS, { ToolConstructable, ToolSettings } from "@editorjs/editorjs";
import Header from "@editorjs/header";
import LinkTool from "@editorjs/link";
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import React, { useEffect, useState } from "react";

export const toolsDefault = {
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

export type EditorProps = {
    tools?: { [toolName: string]: ToolConstructable | ToolSettings<any> },
    data?: any;
    editorRef?: any;
    options?: EditorJS.EditorConfig,
    asEdit?: boolean;
    placeholder?: string;
}

export const useEditor = ({ tools, data, editorRef, options = {}, asEdit, placeholder = "Type anything here..." }: EditorProps) => {
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
        if (!data && asEdit) return;
        const editor = new EditorJS({
            placeholder,
            holder: "editor-js",
            tools,
            data: data || {},
            initialBlock: "paragraph",
            ...editorOptions,
        })

        if (editorInstance) return;
        setEditor(editor);

    }, [tools, data, asEdit, placeholder])

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

export const Editor = ({ tools = undefined, ...props }: EditorProps) => {
    useEditor({ ...props, tools })

    return (
        <div className="relative">
            <div id="editor-js"></div>
        </div>
    )
}