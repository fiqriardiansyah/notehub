"use client";

import CheckboxCustom from "@/components/ui/checkbox-custom";
import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import { Todo } from ".";

export type AsViewProps = {
    todos?: Todo[];
}

export default function AsView({
    todos = []
}: AsViewProps) {
    return (
        <div className="container-custom flex flex-col gap-3">
            <AnimatePresence>
                {todos?.map((item) => (
                    <motion.div animate={{ height: 'auto' }} initial={{ height: 0 }} exit={{ height: 0, opacity: 0 }} key={item.id} className="flex items-start overflow-hidden justify-between">
                        <CheckboxCustom key={item.id} disabled checked={item.isCheck} label={<div className="flex flex-col">
                            <span className="text-sm font-medium">{item.content}</span>
                            {item.checkedAt && <span className="text-xs font-medium text-gray-400 capitalize">done at {dayjs(item.checkedAt).format("DD MMM, HH:mm")}</span>}
                        </div>} />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    )
}