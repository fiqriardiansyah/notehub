import { REMOVE_NOTE_EVENT } from "@/app/components/setting-note-ground/delete";
import { Note } from "@/models/note";
import { FolderPlus, LockKeyhole, Paperclip, Trash } from "lucide-react";

export type NoteSetting = {
    icon: any;
    text: string;
    func: (val?: any) => void;
    danger?: boolean;
    type: "hang_note" | "secure_note" | "add_folder" | "delete";
};

const hangNoteSetting: NoteSetting = {
    icon: Paperclip,
    text: "Hang Note",
    func: () => { },
    type: "hang_note",
};

const secureNoteSetting: NoteSetting = {
    icon: LockKeyhole,
    text: "Secure Note",
    func: () => { },
    type: "secure_note",
};

const addToFolderSetting: NoteSetting = {
    icon: FolderPlus,
    text: "Add to Folder",
    func: () => { },
    type: "add_folder",
};

const deleteSetting: NoteSetting = {
    icon: Trash,
    text: "Delete",
    danger: true,
    func: (note?: Note) => {
        window.dispatchEvent(
            new CustomEvent(REMOVE_NOTE_EVENT, { detail: { note } })
        );
    },
    type: "delete",
};

export default function useSettingList(note?: Note | null) {
    if (!note) return [];

    const settings: NoteSetting[] = [];

    if (!settings.find((s) => s.type === "hang_note")) {
        settings.push(hangNoteSetting);
    }

    if (!settings.find((s) => s.type === "add_folder")) {
        settings.push(addToFolderSetting);
    }

    if (!settings.find((s) => s.type === "secure_note") && !note?.isSecure) {
        settings.push(secureNoteSetting);
    }

    if (!settings.find((s) => s.type === "delete") && !note?.isSecure) {
        settings.push(deleteSetting);
    }

    return settings
}