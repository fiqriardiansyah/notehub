import { REMOVE_NOTE_EVENT } from "@/app/components/card-note/setting/delete";
import { Note } from "@/models/note";
import { Bookmark, BookmarkX, FolderOutput, FolderPlus, LockKeyhole, Blocks, Trash, Link2 } from "lucide-react";
import Lottie from "react-lottie";
import starAnim from "@/asset/animation/star.json";

const defaultOptions = {
    loop: true,
    autoplay: true,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

export type NoteSetting = {
    icon: any;
    text: string;
    func: (val?: any) => void;
    danger?: boolean;
    type: "hang_note" | "unhang_note" | "secure_note" | "add_folder" | "remove_folder" | "delete" | "collabs" | "link"
    rightElement?: any;
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

const collabsSetting: NoteSetting = {
    icon: Blocks,
    text: "Collabs",
    func: () => { },
    type: "collabs",
    rightElement: (
        <Lottie
            style={{ pointerEvents: 'none' }}
            options={{ ...defaultOptions, animationData: starAnim }}
            height={40}
            width={40} />
    )
}

const linkSetting: NoteSetting = {
    icon: Link2,
    text: "Get Link",
    func: () => { },
    type: "link",
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

export default function useMenuNoteList(note?: Note | null) {
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

    if (!settings.find((s) => s.type === "link") && !note?.isSecure) {
        settings.push(linkSetting);
    }

    if (!settings.find((s) => s.type === "collabs") && !note?.isSecure) {
        settings.push(collabsSetting);
    }

    if (!settings.find((s) => s.type === "delete") && !note?.isSecure) {
        settings.push(deleteSetting);
    }

    return settings
}