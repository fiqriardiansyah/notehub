"use client";

import { Todo } from "@/app/write/mode/todolist";
import UnderDevelopBlocker from "@/components/common/under-develop-blocker";
import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import { NoteContext, NoteContextType } from "@/context/note";
import { fireBridgeEvent, useBridgeEvent } from "@/hooks/use-bridge-event";
import { Note } from "@/models/note";
import { Check, Paperclip, StickyNote, Timer } from "lucide-react";
import React from "react";
import { CLOSE_SIDE_PANEL, OPEN_SIDE_PANEL } from "../layout/side-panel";
import { PICK_NOTES, PICK_NOTES_RESET, PICK_NOTES_SUBMIT } from "../pick-notes";

export type HabitsTodoDrawerMenuProps = {
    todo?: Todo
    onClickTimer?: () => void;
    children: (ctrl: { open: () => void, isOpen: boolean }) => React.ReactNode;
    onAttachNote?: (notes: Note[], todo: Todo) => void;
}

export default function HabitsTodoDrawerMenu({ children, todo, onClickTimer, onAttachNote }: HabitsTodoDrawerMenuProps) {

    const noteContext = React.useContext(NoteContext) as NoteContextType;
    const [isOpen, setIsOpen] = React.useState(false);

    useBridgeEvent(PICK_NOTES_SUBMIT + "_" + todo!.id, (payload: { todo: Todo, notes: Note[] }) => {
        if (onAttachNote) onAttachNote(payload.notes, payload.todo);
        noteContext.resetPickedNotes();
        fireBridgeEvent(CLOSE_SIDE_PANEL, null);
    });

    useBridgeEvent(PICK_NOTES_RESET + "_" + todo!.id, (payload: { todo: Todo, notes: Note[] }) => {
        if (onAttachNote) onAttachNote(payload.notes, payload.todo);
        fireBridgeEvent(CLOSE_SIDE_PANEL, null);
    })

    const ctrl = {
        open: () => {
            setIsOpen(true);
        },
        isOpen,
    }

    const onOpenChange = (val: boolean) => {
        setIsOpen(val);
    }

    const onClickTimerHandler = () => {
        setIsOpen(false);
        if (onClickTimer) {
            onClickTimer();
        }
    }

    const onClickAttachNote = () => {
        setIsOpen(false);
        fireBridgeEvent(OPEN_SIDE_PANEL, {
            groundOpen: PICK_NOTES,
            payload: todo,
        });
        if (todo?.attach?.length) {
            noteContext.setPickedNotes(noteContext.notes?.filter((n) => todo?.attach?.find((t) => t.id === n.id)) || [])
            return;
        }
        noteContext.setPickedNotes([]);
    }

    return (
        <>
            <Drawer open={isOpen} onOpenChange={onOpenChange}>
                <DrawerContent className="z-50">
                    <DrawerHeader>
                        <DrawerTitle className="capitalize flex items-center justify-center">
                            {todo?.content} {todo?.isCheck && <Check className="ml-2" size={16} />}
                        </DrawerTitle>
                    </DrawerHeader>
                    <div className="container-custom flex flex-col gap-3 p-4">
                        {!todo?.isCheck && (
                            <Button onClick={onClickTimerHandler} variant="ghost" className="w-full" title="Set timer">
                                <Timer className="mr-2" /> Set timer
                            </Button>
                        )}
                        <Button onClick={onClickAttachNote} variant="ghost" className="w-full" title="Attach note">
                            <Paperclip className="mr-2" /> Attach note
                        </Button>
                        <UnderDevelopBlocker>
                            <Button variant="ghost" className="w-full" title="Scratch note">
                                <StickyNote className="mr-2" /> Scratch note
                            </Button>
                        </UnderDevelopBlocker>
                    </div>
                </DrawerContent>
            </Drawer>
            {children(ctrl)}
        </>
    );
}