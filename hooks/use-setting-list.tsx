import { REMOVE_NOTE_EVENT } from "@/app/components/setting-note-ground/delete";
import { Note } from "@/models/note";
import { Bookmark, BookmarkX, FolderOutput, FolderPlus, LockKeyhole, Paperclip, Trash } from "lucide-react";

export type NoteSetting = {
    icon: any;
    text: string;
    func: (val?: any) => void;
    danger?: boolean;
    type: "hang_note" | "unhang_note" | "secure_note" | "add_folder" | "remove_folder" | "delete";
};

const hangNoteSetting: NoteSetting = {
    icon: Bookmark,
    text: "Hang Note",
    func: () => { },
    type: "hang_note",
};

const unHangNoteSetting: NoteSetting = {
    icon: BookmarkX,
    text: "UnHang Note",
    func: () => { },
    type: "unhang_note",
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

const removeFromFolderSetting: NoteSetting = {
    icon: FolderOutput,
    text: "Remove from folder",
    func: () => { },
    type: "remove_folder"
}

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

    let settings: NoteSetting[] = [];

    if (!settings.find((s) => s.type === "hang_note")) {
        settings.push(hangNoteSetting);
    }

    if (!settings.find((s) => s.type === "unhang_note") && note?.isHang) {
        settings = settings.filter((s) => s.type !== "hang_note");
        settings.push(unHangNoteSetting);
    }

    if (!settings.find((s) => s.type === "add_folder")) {
        settings.push(addToFolderSetting);
    }

    if (!settings.find((s) => s.type === "remove_folder") && note?.folderId) {
        settings = settings.filter((s) => s.type !== "add_folder");
        settings.push(removeFromFolderSetting);
    }

    if (!settings.find((s) => s.type === "secure_note") && !note?.isSecure) {
        settings.push(secureNoteSetting);
    }

    if (!settings.find((s) => s.type === "delete") && !note?.isSecure) {
        settings.push(deleteSetting);
    }

    return settings
}