"use client";

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
    return (
        <div className="rounded-xl ">
            <Lottie style={{ pointerEvents: 'none' }} options={{ ...defaultOptions, animationData: anim }} height={100} width={100} />
        </div>
    )
}