import { CollaborateProject } from "@/models/collab";
import { LogOut } from "lucide-react";
import { NoteSetting } from "./use-menu-note-list";

export type CollaborateSetting = Omit<NoteSetting, "type"> & {
    type: "leave_project"
};

const leaveProjectSetting: CollaborateSetting = {
    icon: LogOut,
    text: "Leave Project",
    func: () => { },
    type: "leave_project",
    danger: true,
};

export default function useMenuNoteCollabList(project?: CollaborateProject | null) {
    if (!project) return [];

    let settings: CollaborateSetting[] = [];

    if (!settings.find((s) => s.type === "leave_project")) {
        settings.push(leaveProjectSetting);
    }

    return settings
}