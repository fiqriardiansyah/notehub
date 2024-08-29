"use client";

import StateRender from '@/components/state-render';
import { Button } from '@/components/ui/button';
import { CommonContext, CommonContextType } from '@/context/common';
import { NoteContext, NoteContextType } from '@/context/note';
import { Note } from '@/models/note';
import EventEmitter from 'events';
import { motion } from 'framer-motion';
import Link from 'next/link';
import React from 'react';
import LayoutGrid from '../layout-grid';
import CardNotePick from './card-note';

export const emitterPickNotes = new EventEmitter();

export const PICK_NOTES = "pickNotes";
export const PICK_NOTES_SUBMIT = "pickNotesSubmit"

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
    const { notesQuery, toggleNote, pickedNotes, notes, isOpen, hideNotes } = usePickNotes();

    React.useEffect(() => {
        notesQuery.refetch();
    }, [isOpen])

    const renderNote = (item: any) => {
        const isPicked = pickedNotes.find((n) => n.id === item.id);
        return <CardNotePick isPicked={!!isPicked} onClick={() => toggleNote(item as Note)} note={item as Note} key={item.id} />
    }

    const onClickPick = () => {
        emitterPickNotes.emit(PICK_NOTES_SUBMIT, pickedNotes);
    }

    return (
        <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1, transition: { delay: .3 } }}
            className="w-full h-full flex flex-col p-5 gap-3">
            <h1 className="font-medium">Select note you want to move 📒</h1>
            <StateRender data={notesQuery.data} isLoading={notesQuery.isLoading}>
                <StateRender.Data>
                    <div className="w-full flex-1 h-full overflow-y-auto mt-5">
                        <LayoutGrid notes={notes} render={renderNote} />
                        {!notes?.length && (
                            <div className='font-medium text-center self-center flex w-full flex-col items-center justify-center h-full'>There is no note available <br />
                                <Link href='/write' className='text-blue-500'>Make one +</Link> </div>
                        )}
                    </div>
                    {notes && (
                        <Button onClick={onClickPick} disabled={!pickedNotes.length}>
                            Pick notes
                        </Button>
                    )}
                </StateRender.Data>
                <StateRender.Loading>
                    <p className='my-4'>Getting notes...</p>
                </StateRender.Loading>
            </StateRender>
        </motion.div>
    )
}

export default PickNotes;