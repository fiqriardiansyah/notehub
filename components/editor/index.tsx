"use client";

import { cn } from "@/lib/utils";
import Checklist from "@editorjs/checklist";
import EditorJS, { ToolConstructable, ToolSettings } from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import InlineImage from "editorjs-inline-image";
import React from "react";

export type ToolsEditor = {
  [toolName: string]: ToolConstructable | ToolSettings<any>;
};

export const toolsDefault: ToolsEditor = {
  header: {
    class: Header as any,
    inlineToolbar: true,
  },
  list: {
    class: List,
    inlineToolbar: true,
  },
  checklist: {
    class: Checklist,
    inlineToolbar: true,
  },
  quote: {
    class: Quote,
    inlineToolbar: true,
  },
  image: {
    class: InlineImage,
    inlineToolbar: true,
    config: {
      embed: {
        display: true,
      },
      unsplash: {
        appName: process.env.UNSPLASH_APP_NAME,
        apiUrl: process.env.NEXT_PUBLIC_API + "/unsplash-proxy",
        maxResults: 30,
        imageParams: {
          q: 85,
          w: 1500,
        },
      },
    },
  },
};

export type EditorProps = {
  tools?: ToolsEditor;
  data?: any;
  editorRef?: (editor: EditorJS | undefined) => void;
  options?: EditorJS.EditorConfig;
  asEdit?: boolean;
  placeholder?: string;
};

export const useEditor = ({ tools, data, editorRef, options = {}, asEdit, placeholder = "Type anything here..." }: EditorProps) => {
  const [loading, setLoading] = React.useState(true);
  const [editorInstance, setEditorInstance] = React.useState<EditorJS | undefined>(undefined);

  const { data: ignoreData, tools: ignoreTools, holder: ignoreHolder, ...editorOptions } = options;

  React.useEffect(() => {
    if (asEdit && !data) return;

    let editor: EditorJS;

    const initializeEditor = async () => {
      editor = new EditorJS({
        placeholder,
        holder: "editor-js",
        tools,
        data: data || {},
        onReady: () => setLoading(false),
        initialBlock: "paragraph",
        ...editorOptions,
      });

      setEditorInstance(editor);
    };

    initializeEditor();

    return () => {
      if (editor) {
        setEditorInstance(undefined);
      }
    };
  }, [tools, data, asEdit, placeholder]);

  React.useEffect(() => {
    if (editorInstance && editorRef) {
      editorRef(editorInstance);
    }
  }, [editorInstance, editorRef]);

  return { editorInstance, loading };
};

export const Editor = ({ tools, ...props }: EditorProps) => {
  const { loading } = useEditor({ ...props, tools });

  React.useEffect(() => {
    if (props?.options?.readOnly) {
      const imgCaption = document.querySelectorAll('div[data-placeholder="Enter a caption"]');
      if (imgCaption) {
        imgCaption?.forEach((imgC) => imgC.classList.add("hidden"));
      }
    }
  }, [props?.options?.readOnly, props?.data, loading]);

  return (
    <div className="relative">
      {loading && <span>Wait a second ya...</span>}
      <div id="editor-js" className={cn(loading ? "hidden" : "")}></div>
    </div>
  );
};
