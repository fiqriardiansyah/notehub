"use client";

import Countdown from "@/components/common/countdown";
import { easeDefault, hexToRgba } from "@/lib/utils";
import { RunningTimer } from "@/models/habits";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import themeColor from "tailwindcss/colors";

type RunningTimerCardProps = {
    item: RunningTimer;
}

export default function RunningTimerCard({ item }: RunningTimerCardProps) {
    const [isComplete, setIsComplete] = React.useState(false);
    const [show, setShow] = React.useState(true);

    React.useEffect(() => {
        if (!isComplete) return;
        setTimeout(() => {
            setShow(false);
        }, 2000);
    }, [isComplete]);

    const onComplete = () => {
        setIsComplete(true);
    }

    if (!show) return null;

    return <div className="flex gap-3 justify-between items-center p-2 hover:bg-slate-100 rounded-md relative overflow-hidden">
        <Countdown
            onCompleteRender={onComplete}
            endTime={item?.endTime}
            startTime={item?.startTime}>
            {({ text, progress }) => (
                <div className="w-8 h-8 rounded-full relative">
                    <CircularProgressbar text="" value={progress} styles={buildStyles({
                        textSize: '10px',
                        textColor: hexToRgba("#000000", 0.7),
                        backgroundColor: "#00000000",
                        pathColor: themeColor.gray[500],
                    })} />
                </div>)}
        </Countdown>
        <div className="flex-1">
            <p className="leading-none m-0 font-semibold text-sm line-clamp-1">{item?.itemTitle}</p>
            <span className="leading-none text-xs text-gray-500 line-clamp-1 mt-1">{item?.title}</span>
        </div>
        <Countdown
            endTime={item?.endTime}
            startTime={item?.startTime}>
            {({ text, progress }) => <p className="font-semibold text-xs">{text}</p>}
        </Countdown>
        <AnimatePresence mode="wait">
            {isComplete && (
                <motion.div initial={{ y: '100%' }} animate={{ y: 0, transition: { ease: easeDefault } }}
                    className="bg-orange-400 text-white text-center h-full w-full absolute left-0 flex items-center justify-center">
                    Times Up!
                </motion.div>
            )}
        </AnimatePresence>
    </div>
}