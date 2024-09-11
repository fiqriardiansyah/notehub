"use client";

import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import { HabitHistory } from "@/models/habits";
import moment from "moment";
import React from "react";
import ListCardHabit from "./list-card-habit";
import { Progress } from "@/components/ui/progress";
import Lottie from "react-lottie";
import fireAnim from '@/asset/animation/fire.json';
import { Note } from "@/models/note";

const defaultOptions = {
    loop: true,
    autoplay: true,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

export type HistoryDetailDrawerProps = {
    schedulerType: Note["schedulerType"];
    history?: HabitHistory;
    children: (ctrl: { open: () => void }) => React.ReactNode;
}

export default function HistoryDetailDrawer({ children, history, schedulerType }: HistoryDetailDrawerProps) {
    const [isOpen, setIsOpen] = React.useState(false);

    const onOpenChange = (val: boolean) => {
        setIsOpen(val);
    }

    const ctrl = {
        open: () => {
            if (history) setIsOpen(true);
        },
    }

    const taskDone = history?.todos?.filter((td) => td.isCheck).length;
    const progress = Math.round(taskDone! / (history?.todos!.length || 1) * 100);

    return (
        <>
            <Drawer open={isOpen} onOpenChange={onOpenChange}>
                <DrawerContent className="z-50">
                    <DrawerHeader>
                        <DrawerTitle className="capitalize">
                            {schedulerType === "day" && moment.utc(history?.completedTime).format("dddd, DD MMMM YYYY")}
                            {schedulerType === "weekly" && `${moment.utc(history?.completedTime).startOf("week").format("dddd DD")} - ${moment.utc(history?.completedTime).endOf("week").format("dddd, DD MMM YYYY")}`}
                        </DrawerTitle>
                    </DrawerHeader>
                    <div className="container-custom flex flex-col gap-4">
                        <div className="flex items-center justify-between gap-3 mt-4 mb-2">
                            {progress !== 100 ? <span className="text-gray-400 text-xs ">Not Completed</span> :
                                <span className="text-green-600 text-xs flex items-center">Complete!
                                    <Lottie style={{ pointerEvents: 'none' }} options={{ ...defaultOptions, animationData: fireAnim }} height={30} width={30} />
                                </span>}
                            <div className="flex-1 flex gap-2 items-center max-w-[400px]">
                                <Progress className="h-[5px]" value={progress} />
                                <p className="m-0 text-xs text-gray-500 text-end">{`${taskDone}/${history?.todos?.length}`}</p>
                            </div>
                        </div>
                        <div className="w-full mb-20 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
                            {history?.todos?.map((todo) => <ListCardHabit completedHabit={true} key={todo.id} todo={todo} />)}
                        </div>
                    </div>
                </DrawerContent>
            </Drawer>
            {children(ctrl)}
        </>
    );
}