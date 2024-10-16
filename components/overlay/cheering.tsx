"use client";

import { fireBridgeEvent, useBridgeEvent } from "@/hooks/use-bridge-event";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { easeDefault } from "@/lib/utils";
import Lottie from "react-lottie";
import animationData from '@/asset/animation/mini-convetti.json';
import cupAnimation from "@/asset/animation/cup.json";

const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

export const CHEERING_OVERLAY = "cheeringOverlayOpen";

export default function CheeringOverlay() {
    const [open, setOpen] = React.useState(false);
    const [content, setContent] = React.useState<any>(null);
    const blockClick = React.useRef(false);

    useBridgeEvent(CHEERING_OVERLAY, (payload: { open?: boolean, content: any }) => {
        setOpen(!!payload?.open);
        setContent(payload?.content);
        if (payload?.open) {
            blockClick.current = true;
            const timeout = setTimeout(() => {
                blockClick.current = false;
                clearTimeout(timeout)
            }, 2000);
        }
    });

    const close = () => {
        if (blockClick.current) return;
        setOpen(false)
    }

    if (!open) return null;
    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: .8, transition: { duration: .6 } }}
                exit={{ opacity: 0 }}
                className="w-screen h-screen fixed top-0 left-0 bottom-0 right-0 z-40 bg-black">
            </motion.div>
            <div onClick={close} className="w-screen h-screen fixed top-0 left-0 bottom-0 right-0 z-50">
                <div className="w-full h-full flex relative items-center flex-col justify-center">
                    <motion.div
                        animate={{ width: '100%', transition: { ease: easeDefault, delay: 0.5, duration: 0.7 } }}
                        className="h-[20vh] w-0 relative bg-yellow-500 flex items-center justify-center">
                        <AnimatePresence>
                            {open && (
                                <motion.div
                                    initial={{ transform: 'translate(-50%, -40%) rotate(0deg) scale(0)' }}
                                    animate={{ transform: 'translate(-50%, -40%) rotate(-20deg) scale(1)' }}
                                    transition={{ delay: 1.5, duration: 0.2, type: "spring" }} className="absolute -top-full transform -translate-x-1/2 -translate-y-1/2">
                                    {content?.element}
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <div className="w-full overflow-hidden flex flex-col items-center gap-2">
                            {content?.message}
                            {content?.description}
                        </div>
                    </motion.div>
                    <AnimatePresence>
                        {open && (
                            <motion.div transition={{ delay: 0.7 }} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
                                <Lottie options={defaultOptions} height={400} width={400} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </>
    )
}

export const useCheeringOverlay = () => {

    const onPlay = (data: { message: any; element?: any, description?: any }) => {
        fireBridgeEvent(CHEERING_OVERLAY, {
            open: true,
            content: data,
        });
    }

    const onClose = () => {
        fireBridgeEvent(CHEERING_OVERLAY, { open: false, content: null });
    }

    return {
        play: onPlay,
        close: onClose,
    }
}