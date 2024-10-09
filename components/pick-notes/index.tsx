"use client";

import StateRender from '@/components/state-render';
import { Button } from '@/components/ui/button';
import { CommonContext, CommonContextType } from '@/context/common';
import { NoteContext, NoteContextType } from '@/context/note';
import { fireBridgeEvent, useBridgeEvent } from '@/hooks/use-bridge-event';
import { Note } from '@/models/note';
import { motion } from 'framer-motion';
import Link from 'next/link';
import React from 'react';
import LayoutGrid from '../layout-grid';
import CardNotePick from './card-note';
import { Todo } from '@/app/write/mode/todolist';

export const PICK_NOTES = "pickNotes";
export const PICK_NOTES_SUBMIT = "pickNotesSubmit"
export const PICK_NOTES_RESET = "pickNotesReset";

export const usePickNotes = () => {
    const noteContext = React.useContext(NoteContext) as NoteContextType;
    const { common } = React.useContext(CommonContext) as CommonContextType;

    const isOpen = common?.groundOpen === PICK_NOTES && common?.sidePageOpen;

    return {
        ...noteContext,
        isOpen,
    };
}

export const PickNotes = () => {
    const { notesQuery, toggleNote, pickedNotes, notes, isOpen, setPickedNotes } = usePickNotes();
    const { common } = React.useContext(CommonContext) as CommonContextType;
    const [attachTodo, setAttachTodo] = React.useState<Todo>();

    React.useEffect(() => {
        notesQuery.refetch();
    }, [isOpen]);

    const renderNote = (item: any) => {
        const isPicked = pickedNotes.find((n) => n.id === item.id);
        return <CardNotePick isPicked={!!isPicked} onClick={() => toggleNote(item as Note)} note={item as Note} key={item.id} />
    }

    const onClickPickHandler = () => {
        if (attachTodo) {
            fireBridgeEvent(PICK_NOTES_SUBMIT + "_" + attachTodo.id, {
                todo: attachTodo,
                notes: pickedNotes,
            });
            return;
        }
        fireBridgeEvent(PICK_NOTES_SUBMIT, pickedNotes);
    }

    useBridgeEvent(PICK_NOTES, (payload) => {
        setAttachTodo(payload);
    });

    const onClickReset = () => {
        setPickedNotes([]);
        if (attachTodo) {
            fireBridgeEvent(PICK_NOTES_RESET + "_" + attachTodo.id, {
                todo: attachTodo,
                notes: [],
            });
        }
    }

    if (!common?.groundOpen) return null;
    if (common?.groundOpen !== PICK_NOTES) return null;

    return (
        <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1, transition: { delay: .3 } }}
            className="w-full h-full flex flex-col gap-3 relative">
            <h1 className="font-medium">Select note you want 📒</h1>
            <StateRender data={notesQuery.data} isLoading={notesQuery.isLoading}>
                <StateRender.Data>
                    <div className="w-full flex-1 h-full overflow-y-auto mt-5">
                        <LayoutGrid items={notes}>
                            {renderNote}
                        </LayoutGrid>
                        {!notes?.length && (
                            <div className='font-medium text-center self-center flex w-full flex-col items-center justify-center h-full'>There is no note available <br />
                                <Link href='/write' className='text-blue-500'>Make one +</Link> </div>
                        )}
                    </div>
                    <div className="sticky bottom-0 left-0 z-10 right-0 flex flex-col gap-3">
                        <a onClick={onClickReset} className="cursor-pointer text-xs font-semibold">Reset</a>
                        {notes && (
                            <Button onClick={onClickPickHandler} disabled={!pickedNotes.length}>
                                Pick notes
                            </Button>
                        )}
                    </div>
                </StateRender.Data>
                <StateRender.Loading>
                    <p className='my-4'>Getting notes...</p>
                </StateRender.Loading>
            </StateRender>
        </motion.div>
    )
}

export default PickNotes;