import starAnim from "@/asset/animation/star.json";
import { Note } from "@/models/note";
import { Blocks, Bookmark, BookmarkX, FolderOutput, FolderPlus, Link2, LockKeyhole, Trash } from "lucide-react";
import React from "react";
import Lottie from "react-lottie";

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
    func: () => { },
    type: "delete",
};

export default function useMenuNoteList(note?: Note | null) {
    const [settings, setSettings] = React.useState<NoteSetting[]>([]);

    React.useEffect(() => {
        // the delay will return empty list after 0.7 sec, so the attach dropdown will not suddenly disappear
        if (!note) {
            const timeout = setTimeout(() => {
                setSettings([]);
            }, 700);

            return () => clearTimeout(timeout);
        }

        let newSettings: NoteSetting[] = [];

        if (!newSettings.find((s) => s.type === "hang_note")) {
            newSettings.push(hangNoteSetting);
        }

        if (!newSettings.find((s) => s.type === "unhang_note") && note?.isHang) {
            newSettings = newSettings.filter((s) => s.type !== "hang_note");
            newSettings.push(unHangNoteSetting);
        }

        if (!newSettings.find((s) => s.type === "add_folder")) {
            newSettings.push(addToFolderSetting);
        }

        if (!newSettings.find((s) => s.type === "remove_folder") && note?.folderId) {
            newSettings = newSettings.filter((s) => s.type !== "add_folder");
            newSettings.push(removeFromFolderSetting);
        }

        if (!newSettings.find((s) => s.type === "secure_note") && !note?.isSecure) {
            newSettings.push(secureNoteSetting);
        }

        if (!newSettings.find((s) => s.type === "link") && !note?.isSecure) {
            newSettings.push(linkSetting);
        }

        if (!newSettings.find((s) => s.type === "collabs") && !note?.isSecure) {
            newSettings.push(collabsSetting);
        }

        if (!newSettings.find((s) => s.type === "delete") && !note?.isSecure) {
            newSettings.push(deleteSetting);
        }

        setSettings(newSettings);

    }, [note]);

    return settings;
}