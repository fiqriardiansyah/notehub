"use client";

import { Button } from "@/components/ui/button";
import FolderNote from "./folder-note";
import SecureNote from "./secure-note";
import TagNote from "./tag-note";

export type ToolsBarType = {
    save: () => void;
    isLoading?: boolean;
};

export default function ToolsBar({ save, isLoading }: ToolsBarType) {

    return (
        <div className="shadow-[-1px_2px_7px_rgb(139_139_139_/_50%)] p-1 bg-white rounded-full">
            <div className="w-full h-full flex items-center justify-between gap-2">
                <TagNote />
                <FolderNote />
                <SecureNote />
                <Button
                    disabled={isLoading}
                    onClick={save}
                    size="sm"
                    className="rounded-full px-5"
                >
                    Save
                </Button>
            </div>
        </div>
    );
}
