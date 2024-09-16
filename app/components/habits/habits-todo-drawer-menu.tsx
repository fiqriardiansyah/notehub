"use client";

import { Todo } from "@/app/write/mode/todolist";
import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import { NoteContext, NoteContextType } from "@/context/note";
import useSidePage from "@/hooks/use-side-page";
import { Note } from "@/models/note";
import { Check, Paperclip, StickyNote, Timer } from "lucide-react";
import React from "react";
import { PICK_NOTES } from "../pick-notes";
import UnderDevelopBlocker from "@/components/common/under-develop-blocker";

export type HabitsTodoDrawerMenuProps = {
    todo?: Todo
    onClickTimer?: () => void;
    children: (ctrl: { open: () => void, isOpen: boolean }) => React.ReactNode;
    onAttachNote?: (notes: Note[], todo: Todo) => void;
}

export default function HabitsTodoDrawerMenu({ children, todo, onClickTimer, onAttachNote }: HabitsTodoDrawerMenuProps) {

    const noteContext = React.useContext(NoteContext) as NoteContextType;
    const [isOpen, setIsOpen] = React.useState(false);
    const [setSidePage, resetSidePage] = useSidePage();

    noteContext.onClickPick(({ notes, resetPickedNotes, payload }) => {
        const todoPayload = payload as Todo;
        if (onAttachNote) onAttachNote(notes, todoPayload);
        resetPickedNotes();
        resetSidePage();
    });

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
        setSidePage(PICK_NOTES, todo);
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