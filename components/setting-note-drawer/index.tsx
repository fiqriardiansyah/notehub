"use client";

import { COLLABS_NOTE_GROUND } from "@/components/card-note/setting/collabs";
import { FOLDER_NOTE_GROUND } from "@/components/card-note/setting/folder-note";
import { INITIATE_SECURE_NOTE } from "@/components/card-note/setting/initiate-secure-note";
import { SECURE_NOTE } from "@/components/card-note/setting/secure-note";
import { CommonContext, CommonContextType } from "@/context/common";
import { NoteContext, NoteContextType } from "@/context/note";
import { WriteStateType } from "@/context/write";
import { fireBridgeEvent } from "@/hooks/use-bridge-event";
import useMenuNoteList, { NoteSetting } from "@/hooks/use-menu-note-list";
import useProcess from "@/hooks/use-process";
import useSecureNote from "@/hooks/use-secure-note";
import useStatusBar from "@/hooks/use-status-bar";
import { pause } from "@/lib/utils";
import { CreateNote, Note } from "@/models/note";
import noteService from "@/service/note";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bookmark, LockKeyhole } from "lucide-react";
import React from "react";
import { REMOVE_NOTE_EVENT_DIALOG } from "../card-note/setting/delete";
import { GET_LINK_EVENT_DIALOG } from "../card-note/setting/get-link";
import { CLOSE_SIDE_PANEL, OPEN_SIDE_PANEL } from "../layout/side-panel";
import Attach from "./attach";
import BottomSheet from "./bottom-sheet";
import CollabBottomSheet from "./collab-bottom-sheet";

export type WithFunctionalityHOCProps = {
    settings: NoteSetting[];
    onOpenChange: (val: boolean) => void;
    handleClickSetting: (setting: NoteSetting) => () => void;
    isLoading: (setting?: NoteSetting) => boolean;
    isOpen: boolean;
    currentNote?: Note;
}

export default function SettingNoteDrawer() { }

export function withFunctionality(WrappedComponent: React.ComponentType<any>) {
    const Component = (props: any) => {

        const { common } = React.useContext(CommonContext) as CommonContextType;
        const { note, setNote, generateChangesId } = React.useContext(NoteContext) as NoteContextType;

        const currentNote = note?.note;

        const { setProcess, finishProcess } = useProcess();

        const settings = useMenuNoteList(currentNote);
        const queryClient = useQueryClient();
        const [_, setStatusBar] = useStatusBar();

        const isOpen = !!currentNote && !common?.sidePageOpen;

        const updateNoteMutate = useMutation(
            [noteService.updateNote.name],
            async (data: Partial<CreateNote> & { typeProcess: NoteSetting["type"] }) => {
                setProcess({ id: data.id!, nameOfProcess: "Updating " + data.title + "..." });
                await pause(1);
                const res = (await noteService.updateNote(data, currentNote!.id)).data.data;
                finishProcess(data.id!);
                return res;
            }
        );

        const deleteMutate = useMutation(async (note: Note) => {
            setProcess({ id: note.id, nameOfProcess: "Deleting " + note.title + "..." });
            await pause(1);
            const res = (await noteService.deleteNote(note.id)).data.data;
            finishProcess(note.id);
            return res;
        });

        const { checkHasPassNote } = useSecureNote({
            onInitiateSecure() {
                fireBridgeEvent(OPEN_SIDE_PANEL, {
                    groundOpen: SECURE_NOTE
                })
            },
            onSecure(isPasswordCorrect) {
                if (isPasswordCorrect) {
                    updateNoteMutate.mutateAsync({ isSecure: true, typeProcess: "secure_note" }).then(async () => {
                        await queryClient.refetchQueries({ queryKey: [noteService.getNote.name] });
                        fireBridgeEvent(CLOSE_SIDE_PANEL, null);
                        setNote((prev) => ({ ...prev, note: null }));
                        setStatusBar({
                            autoClose: 5,
                            show: true,
                            icon: <LockKeyhole className="text-sm" />,
                            message: "Your note now secured! 😎",
                            type: "success"
                        });
                        generateChangesId();
                    });
                }
            },
        });

        const onOpenChange = (val: boolean) => {
            if (common?.sidePageOpen) return;
            if (!val) {
                setNote((prev) => ({
                    ...prev,
                    note: null,
                }));
            }
        };

        const onAddToFolder = (payload: { folder: WriteStateType["folder"] }) => {
            const folder = payload?.folder;
            fireBridgeEvent(CLOSE_SIDE_PANEL, null);
            setStatusBar({ show: true, message: "Moving note to folder...", type: "loading" });
            updateNoteMutate.mutateAsync({ typeProcess: "add_folder", folderId: folder?.id, newFolder: { title: folder?.name } }).then(async () => {
                generateChangesId();
                setNote((prev) => ({ ...prev, note: null }));
                setStatusBar({
                    autoClose: 5,
                    show: true,
                    message: "Note moved!",
                    type: "success"
                });
            }).catch((e) => {
                setStatusBar({
                    show: true,
                    message: e?.message,
                    type: "danger"
                });
            })
        }

        const onDelete = async (note: Note) => {
            setNote((prev) => ({ ...prev, note: undefined }));
            try {
                setStatusBar({
                    type: "loading",
                    show: true,
                    message: `Deleting ${note?.title} note...`,
                });
                await deleteMutate.mutateAsync(note);
                generateChangesId();
                setStatusBar({
                    type: "success",
                    show: true,
                    message: `${note?.title} Deleted`,
                    autoClose: 5,
                });
                queryClient.invalidateQueries();
            } catch (e: any) {
                setStatusBar({
                    type: "danger",
                    show: true,
                    message: e?.message,
                });
            }
        }

        const handleClickSetting = (setting: NoteSetting) => {
            return () => {
                if (setting.type === "link") {
                    fireBridgeEvent(GET_LINK_EVENT_DIALOG, currentNote);
                    setNote((prev) => ({ ...prev, note: undefined }));
                    return;
                }
                if (setting.type === "delete") {
                    fireBridgeEvent(REMOVE_NOTE_EVENT_DIALOG, {
                        note: currentNote,
                        callback: onDelete,
                    });
                    return;
                }
                if (setting.type === "secure_note") {
                    checkHasPassNote.mutateAsync().then((isHasPassword) => {
                        if (!isHasPassword) {
                            fireBridgeEvent(OPEN_SIDE_PANEL, {
                                groundOpen: INITIATE_SECURE_NOTE,
                            });
                            return;
                        }
                        generateChangesId();
                        fireBridgeEvent(OPEN_SIDE_PANEL, {
                            groundOpen: SECURE_NOTE,
                        });
                    });
                    return;
                }
                if (setting.type === "hang_note" || setting.type === "unhang_note") {
                    const currentHang = currentNote?.isHang;
                    updateNoteMutate.mutateAsync({ isHang: !currentHang, typeProcess: "hang_note" }).then(async () => {
                        if (!currentHang) {
                            setStatusBar({
                                autoClose: 5,
                                show: true,
                                icon: <Bookmark className="text-sm" />,
                                message: "Hang Note 📒",
                                type: "success"
                            });
                        }
                        generateChangesId();
                        setNote((prev) => ({ ...prev, note: null }));
                    });
                    return;
                }
                if (setting.type === "add_folder") {
                    fireBridgeEvent(OPEN_SIDE_PANEL, {
                        groundOpen: FOLDER_NOTE_GROUND,
                        payload: {
                            openAddButton: true,
                            callback: onAddToFolder
                        }
                    });
                }
                if (setting.type === "remove_folder") {
                    updateNoteMutate.mutateAsync({ folderId: "remove", typeProcess: "remove_folder" }).then(async () => {
                        setNote((prev) => ({ ...prev, note: null }));
                        generateChangesId();
                    });
                }
                if (setting.type === "collabs") {
                    fireBridgeEvent(OPEN_SIDE_PANEL, {
                        groundOpen: COLLABS_NOTE_GROUND,
                        payload: currentNote,
                    });
                    generateChangesId();
                }

                setting.func();
            };
        };

        const isLoading = (setting?: NoteSetting) => {
            if (!setting) {
                return checkHasPassNote.isLoading || updateNoteMutate.isLoading || deleteMutate.isLoading;
            }
            if (setting.type === "delete") return deleteMutate.isLoading;
            if (setting.type === "secure_note") return checkHasPassNote.isLoading;
            if (setting.type === "hang_note" || setting.type === "unhang_note") return updateNoteMutate.isLoading && updateNoteMutate.variables?.typeProcess === "hang_note";
            if (setting.type === "add_folder") return updateNoteMutate.isLoading && updateNoteMutate.variables?.typeProcess === "add_folder";
            if (setting.type === "remove_folder") return updateNoteMutate.isLoading && updateNoteMutate.variables?.typeProcess === "remove_folder";
            return false;
        }

        const allProps = {
            ...props,
            settings,
            handleClickSetting,
            isLoading,
            onOpenChange,
            isOpen,
            currentNote
        }

        return <WrappedComponent {...allProps} />
    }

    return Component;
};
SettingNoteDrawer.Attach = withFunctionality(Attach);
SettingNoteDrawer.BottomSheet = withFunctionality(BottomSheet);
SettingNoteDrawer.CollabBottomSheet = withFunctionality(CollabBottomSheet)