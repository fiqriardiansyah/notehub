"use client";
import animationData from '@/asset/animation/star.json';
import { WriteContext, WriteContextType } from '@/context/write';
import { Tag } from '@/models/note';
import PickTags from '@/module/tags/pick-tags';
import noteService from '@/service/note';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import React from 'react';
import Lottie from 'react-lottie';
import CreateTagNoteDialog from './create';
import { CommonContext, CommonContextType } from '@/context/common';

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

export const TAG_NOTE_GROUND = "tagNoteGround";

export default function TagNote() {
    const queryClient = useQueryClient();

    const { common } = React.useContext(CommonContext) as CommonContextType;
    const { setDataNote, dataNote } = React.useContext(WriteContext) as WriteContextType;

    const removeTagNewFlagMutate = useMutation(async (id: string) => (await noteService.removeTagNewFlag(id)).data.data);

    const onClickTag = (tag: Tag) => {
        return () => {
            if (tag?.isNew) {
                removeTagNewFlagMutate.mutateAsync(tag.id).then(() => queryClient.refetchQueries({ queryKey: ["get-tag"], exact: true }))
            }
            setDataNote((prev) => {
                if (prev?.tags?.find((t) => t.id === tag.id)) {
                    return {
                        ...prev,
                        tags: prev.tags.filter((t) => t.id !== tag.id),
                    }
                };
                return {
                    ...prev,
                    tags: [...(prev?.tags || []), tag]
                }
            })

        }
    }

    if (common?.groundOpen !== TAG_NOTE_GROUND) return null;
    return (
        <CreateTagNoteDialog>
            {(ctrl) => (
                <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1, transition: { delay: .3 } }} className="w-full flex flex-col">
                    <h1 className="font-semibold text-xl capitalize mb-5">Tags note {"🏷️"}</h1>
                    <div className="overflow-y-auto mb-10 p-1">
                        <PickTags tagPicks={dataNote?.tags || []} onClickTag={onClickTag} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <motion.button onClick={ctrl.onToggleOpen} animate={{ scale: 1, transition: { delay: 0.4 } }} initial={{ scale: 0.1 }} className='flex items-center gap-2 justify-center bg-transparent border-none cursor-pointer'>
                            <span className='font-semibold text-xs'>Create your own tag</span>
                            <Lottie options={defaultOptions}
                                height={40}
                                width={40}
                                style={{ margin: 0 }} />
                        </motion.button>
                    </div>
                </motion.div>
            )}
        </CreateTagNoteDialog>
    )
}