"use client";

import React from "react";
import Lottie from "react-lottie";

const defaultOptions = {
    loop: true,
    autoplay: true,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

export type CompleteAllHabitProps = {
    anim?: string;
}

export default function CompleteAllHabit({ anim }: CompleteAllHabitProps) {
    const [animJson] = React.useState(() => anim);

    return (
        <div className="rounded-xl flex gap-3 relative p-2 overflow-hidden">
            <Lottie style={{ pointerEvents: 'none', zIndex: 1 }} options={{ ...defaultOptions, animationData: animJson }} height={100} width={100} />
            <div className="absolute top-1/2 transform -translate-y-1/2 -right-1/4 z-[1] opacity-30 blur-sm">
                <Lottie
                    style={{ pointerEvents: 'none' }}
                    options={{ ...defaultOptions, loop: false, animationData: animJson }}
                    height={300} width={300} />
            </div>
            <div className="flex flex-col gap-2 flex-1 z-10">
                <h1 className="text-xl font-medium">Todays Habit is <br /> Complete 👍</h1>
            </div>
        </div>
    )
}