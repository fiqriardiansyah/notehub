"use client";
import animationData from '@/asset/animation/star.json';
import { WriteContext, WriteContextType } from '@/context/write';
import { easeDefault } from '@/lib/utils';
import { Tag } from '@/models/note';
import CreateTag from '@/module/tags/create-tag';
import PickTags from '@/module/tags/pick-tags';
import noteService from '@/service/note';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import Lottie from 'react-lottie';

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

  const { setDataNote, dataNote } = React.useContext(WriteContext) as WriteContextType;

  const [createNewTag, setCreateNewTag] = React.useState(false);

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

  const onClickNewTagToggle = () => {
    setCreateNewTag((prev) => !prev);
  }

  return (
    <div className="h-screen overflow-y-hidden flex flex-col relative">
      <AnimatePresence mode='popLayout'>
        {!createNewTag && (
          <motion.div key="slider" exit={{ y: '-100vh' }} animate={{ y: 0 }} initial={{ y: '-100vh' }} transition={{ ease: easeDefault }} className="w-full h-full py-5 min-h-screen bg-white">
            <div className="px-5 md:px-15 lg:px-20 flex flex-col w-full h-full justify-between">
              <h1 className="font-semibold text-xl capitalize mb-5">Add tags to note {"🏷️"}</h1>
              <div className="overflow-y-auto mb-3 p-1 h-full">
                <PickTags tagPicks={dataNote?.tags || []} onClickTag={onClickTag} />
              </div>
              <div className="flex flex-col gap-2">
                <motion.button onClick={onClickNewTagToggle} animate={{ scale: 1, transition: { delay: 0.4 } }} initial={{ scale: 0.1 }} className='flex items-center gap-2 justify-center bg-transparent border-none cursor-pointer'>
                  <span className='font-semibold text-xs'>Create your own tag</span>
                  <Lottie options={defaultOptions}
                    height={40}
                    width={40}
                    style={{ margin: 0 }} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
        {createNewTag && (
          <motion.div key="slider-2" exit={{ y: '100vh' }} animate={{ y: 0 }} initial={{ y: '100vh' }} transition={{ ease: easeDefault }} className="w-full h-full pb-5 min-h-screen">
            <div className="px-5 md:px-15 lg:px-20 flex flex-col gap-4 w-full h-full">
              <div className='flex items-center gap-2'>
                <span className='font-semibold text-lg'>Create your own tag</span>
                <Lottie options={defaultOptions}
                  height={50}
                  width={50}
                  style={{ margin: 0 }} />
              </div>
              <CreateTag toggleCreateOpener={onClickNewTagToggle} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
