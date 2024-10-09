"use client"

import StateRender from "@/components/state-render";
import { Skeleton } from "@/components/ui/skeleton";
import { pause } from "@/lib/utils";
import { Tag } from "@/models/note";
import noteService from "@/service/note";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import Chip from "./chip";

export type PickTagsProps = {
    tagPicks: Tag[];
    onClickTag: (tag: Tag) => () => void;
}

export default function PickTags({ onClickTag, tagPicks }: PickTagsProps) {

    const getTagQuery = useQuery([noteService.getTag.name], async () => {
        return (await noteService.getTag()).data.data
    });

    return (
        <div className="flex flex-col gap-6 h-full">
            <StateRender data={true} isLoading={false}>
                <StateRender.Data>
                    <motion.div className="flex gap-1 w-full items-center" style={{ flexWrap: "wrap" }}>
                        <AnimatePresence>
                            {tagPicks.map((tag) => {
                                return (
                                    <motion.div key={tag.id} initial={{ scale: 0.3 }} animate={{ scale: 1 }} exit={{ scale: 0, width: 0 }}>
                                        <Chip onClick={onClickTag(tag)} tag={tag} pick />
                                    </motion.div>)
                            })}
                        </AnimatePresence>
                    </motion.div>
                </StateRender.Data>
                <StateRender.Loading>
                    <div className="flex flex-col gap-2">
                        <Skeleton className="w-full" style={{ height: '20px' }} />
                        <Skeleton className="w-[200px]" style={{ height: '20px' }} />
                    </div>
                </StateRender.Loading>
            </StateRender>
            <StateRender data={getTagQuery.data} isLoading={getTagQuery.isLoading} isError={getTagQuery.isError}>
                <StateRender.Data>
                    <motion.div className="flex gap-1 w-full items-center" style={{ flexWrap: "wrap" }}>
                        <AnimatePresence>
                            {getTagQuery.data?.map((tag) => {
                                if (tagPicks.find((t) => t.id === tag.id)) return null;
                                return (
                                    <motion.div key={tag.id} initial={{ scale: 0.3 }} animate={{ scale: 1 }} exit={{ scale: 0, width: 0 }}>
                                        <Chip onClick={onClickTag(tag)} tag={tag} />
                                    </motion.div>)
                            })}
                        </AnimatePresence>
                    </motion.div>
                </StateRender.Data>
                <StateRender.Loading>
                    <div className="flex flex-col gap-2">
                        <Skeleton className="w-full" style={{ height: '20px' }} />
                        <Skeleton className="w-[80%]" style={{ height: '20px' }} />
                        <Skeleton className="w-[200px]" style={{ height: '20px' }} />
                    </div>
                </StateRender.Loading>
            </StateRender>
        </div>
    )
}