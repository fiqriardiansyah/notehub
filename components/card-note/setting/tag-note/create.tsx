"use client";

import animationData from '@/asset/animation/star.json';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import CreateTag from '@/module/tags/create-tag';
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

export type CreateTagNoteDialogProps = {
    children: (ctrl: { onToggleOpen: () => void }) => any;
}

export default function CreateTagNoteDialog({ children }: CreateTagNoteDialogProps) {
    const [open, setOpen] = React.useState(false);

    const onToggleOpen = () => {
        setOpen((prev) => !prev);
    }

    return (
        <>
            <Dialog open={open} onOpenChange={onToggleOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            Create your own tags <Lottie options={defaultOptions}
                                height={40}
                                width={40}
                                style={{ margin: 0, pointerEvents: 'none' }} />
                        </DialogTitle>
                    </DialogHeader>
                    <CreateTag />
                </DialogContent>
            </Dialog>
            {children({ onToggleOpen })}
        </>
    )
}