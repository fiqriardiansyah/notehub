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
    const { notesQuery, toggleNote, pickedNotes, notes, isOpen, triggerClickPick, setPickedNotes } = usePickNotes();
    const { common, callbackPayload } = React.useContext(CommonContext) as CommonContextType;
    const [tempPayload, setTempPayload] = React.useState<any>();

    React.useEffect(() => {
        notesQuery.refetch();
    }, [isOpen]);

    const renderNote = (item: any) => {
        const isPicked = pickedNotes.find((n) => n.id === item.id);
        return <CardNotePick isPicked={!!isPicked} onClick={() => toggleNote(item as Note)} note={item as Note} key={item.id} />
    }

    const onClickPickHandler = () => {
        emitterPickNotes.emit(PICK_NOTES_SUBMIT, pickedNotes);
        triggerClickPick({ payload: tempPayload });
    }

    callbackPayload((nameground, payload) => {
        if (nameground === PICK_NOTES) {
            setTempPayload(payload);
            return;
        }
    });

    const onClickReset = () => {
        setPickedNotes([]);
        triggerClickPick({ notes: [], payload: tempPayload });
    }

    if (!common?.groundOpen) return null;
    if (common?.groundOpen !== PICK_NOTES) return null;

    return (
        <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1, transition: { delay: .3 } }}
            className="w-full h-full flex flex-col p-5 gap-3">
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
                    <a onClick={onClickReset} className="cursor-pointer text-xs font-semibold">Reset</a>
                    {notes && (
                        <Button onClick={onClickPickHandler} disabled={!pickedNotes.length}>
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