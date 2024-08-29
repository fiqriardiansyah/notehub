"use client";

import { X } from "lucide-react";
import Image from "next/image";
import React from "react";
import { AnimatePresence, motion } from 'framer-motion';
import { useQuery } from "@tanstack/react-query";
import quoteService from "@/service/quote";

export default function Quotes() {
    const [show, setShow] = React.useState(false);

    const quoteQuery = useQuery([quoteService.getQuote.name], async () => {
        return (await quoteService.getQuote()).data.data
    }, {
        enabled: !show,
        onSuccess(data) {
            if (data) {
                setShow(true);
            }
        },
    });

    const onClose = () => {
        setShow(false);
    }

    return (
        <AnimatePresence>
            {show && (
                <motion.div exit={{ height: 0, opacity: 0, scale: 0 }} className="p-3 flex items-start justify-start gap-2 flex-col border-b border-solid border-gray-400">
                    <Image width={50} height={50} src="/quote.svg" alt="quote" />
                    <p className="font-medium">“{quoteQuery.data?.quote}”</p>
                    <div className="flex w-full items-center justify-between mt-5">
                        <span className="italic text-gray-500">- {quoteQuery.data?.author}</span>
                        <button onClick={onClose} title="close" className="m-0 w-[20px] h-[20px]">
                            <X />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}