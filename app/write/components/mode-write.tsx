"use client";

import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { WriteContext, WriteContextType } from "@/context/write";
import { ModeNote } from "@/models/note";
import { AnimatePresence, motion } from "framer-motion";
import { FileType, ListTodo, Trophy } from "lucide-react";
import React from "react";
import themeColor from "tailwindcss/colors";

export type ModeWriteType = {
    mode: ModeNote;
    icon: any;
    description: string;
    color?: string;
}

export const MODE_WRITE: ModeWriteType[] = [
    {
        mode: "freetext",
        icon: FileType,
        description: "Freetext note",
        color: themeColor.gray[300],
    },
    {
        mode: "todolist",
        icon: ListTodo,
        description: "Todo list",
        color: themeColor.gray[300],
    },
    {
        mode: "habits",
        icon: Trophy,
        description: "Build your habits",
        color: themeColor.yellow[300]
    }
]

export default function ModeWrite() {
    const { dataNote, setDataNote } = React.useContext(WriteContext) as WriteContextType
    const [show, setShow] = React.useState(false);

    const currentMode = MODE_WRITE.find((m) => m.mode === dataNote.modeWrite)!

    const restMode = MODE_WRITE.filter((m) => m.mode !== currentMode?.mode)!;

    const Icon = currentMode.icon;
    1
    const onClickChange = () => {
        setShow((prev) => !prev);
    }

    const onClickMode = (mode: ModeWriteType) => {
        return () => {
            onClickChange();
            setDataNote((prev) => ({ ...prev, modeWrite: mode.mode }));
        }
    }

    return (
        <div className="relative h-[45px] flex items-center justify-center">
            <AnimatePresence>
                {show && (
                    <motion.div animate={{ scale: 1 }} initial={{ scale: 0 }} exit={{ scale: 0 }} className="flex flex-col gap-2 absolute bottom-[55px] left-0">
                        {restMode?.map((M) => (
                            <Button onClick={onClickMode(M)} key={M.mode} size="icon" variant="outline">
                                <M.icon />
                            </Button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
            <Tooltip>
                <TooltipTrigger asChild>
                    <motion.div key={currentMode.mode}>
                        <Button onClick={onClickChange} size="icon" className="z-10">
                            <Icon />
                        </Button>
                    </motion.div>
                </TooltipTrigger>
                <TooltipContent>{currentMode?.description}</TooltipContent>
            </Tooltip>
        </div>
    )
}