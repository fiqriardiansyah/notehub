"use client";

import { AnimatePresence, motion } from "framer-motion";
import React from "react";

export type OverlayType = {
    show: { show: boolean; element: any };
    setOverlay: React.Dispatch<React.SetStateAction<{ show: boolean; element: any }>>;
}

const OverlayContext = React.createContext({});

export const useOverlay = () => {
    const overlay = React.useContext(OverlayContext) as OverlayType;

    const showContent = (element: React.ReactElement | React.ReactNode) => {
        overlay.setOverlay({ show: true, element });
    }

    const close = () => {
        overlay.setOverlay({ show: false, element: undefined })
    }

    return {
        ...overlay,
        showContent,
        close,
    }
}

export default function Overlay({ children }: { children?: any }) {
    const [overlay, setOverlay] = React.useState({
        show: false,
        element: undefined
    });

    const value = {
        overlay,
        setOverlay,
    }

    return (
        <OverlayContext.Provider value={value}>
            <AnimatePresence>
                {overlay.show && (
                    <motion.div
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-screen h-screen fixed top-0 left-0 bottom-0 right-0 z-50 bg-white">
                        <AnimatePresence>
                            {overlay.show && <motion.div
                                animate={{ scale: 1, transition: { delay: 0.7 } }} exit={{ scale: 0 }} className="w-full h-full flex items-center justify-center">
                                {overlay.element}
                            </motion.div>}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>
            {children}
        </OverlayContext.Provider>
    )
}