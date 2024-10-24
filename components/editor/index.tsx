"use client";

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

export const useEditor = ({
  tools,
  data,
  editorRef,
  options = {},
  asEdit,
  placeholder = "Type anything here...",
}: EditorProps) => {
  const [loading, setLoading] = React.useState(true);
  const [editorInstance, setEditorInstance] = React.useState<
    EditorJS | undefined
  >(undefined);

  const {
    data: ignoreData,
    tools: ignoreTools,
    holder: ignoreHolder,
    ...editorOptions
  } = options;

  // initialize EditorJS
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

    // Clean up editor instance on component unmount
    return () => {
      if (editor) {
        // editor.destroy().catch(() => { /* Handle any cleanup errors */ });
        setEditorInstance(undefined);
      }
    };
  }, [tools, data, asEdit, placeholder]);

  // Pass editor instance back via ref (if provided)
  React.useEffect(() => {
    if (editorInstance && editorRef) {
      editorRef(editorInstance);
    }
  }, [editorInstance, editorRef]);

  return { editorInstance, loading };
};

export const Editor = ({ tools, ...props }: EditorProps) => {
  const { editorInstance, loading } = useEditor({ ...props, tools });

  return (
    <div className="relative">
      {loading && <span>Wait a second ya...</span>}
      <div id="editor-js" className={loading ? "hidden" : ""}></div>
    </div>
  );
};
