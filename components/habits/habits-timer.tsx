"use client";

import { Todo } from "@/app/write/mode/todolist";
import Countdown from "@/components/common/countdown";
import Timer, { Time } from "@/components/common/timer";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { useTimer } from "@/context/timer";
import { FORMAT_DATE_SAVE, hexToRgba } from "@/lib/utils";
import { Timer as TimerType } from "@/models/habits";
import habitsService from "@/service/habits";
import { useMutation } from "@tanstack/react-query";
import { Info, Play, RotateCw, Scan } from "lucide-react";
import moment from "moment";
import React from "react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import themeColor from "tailwindcss/colors";
import CheckboxCustom from "../ui/checkbox-custom";

export type HabitsTimerProps = {
    anyId?: string;
    todo?: Todo;
    setTimer: (todo: Todo) => void;
    children: (ctrl: { open: () => void, isOpen: boolean }) => React.ReactNode;
}

const defaultTime = { hours: 0, minutes: 0, seconds: 0 };

export default function HabitsTimer({ children, todo, setTimer, anyId }: HabitsTimerProps) {
    const timerContext = useTimer();

    const [isOpen, setIsOpen] = React.useState(false);
    const [time, setTime] = React.useState<Time | undefined>(defaultTime);
    const [autoComplete, setAutoComplete] = React.useState<boolean>(false);
    const [isTimesUp, setIsTimesUp] = React.useState(false);

    const setTimerMutate = useMutation([habitsService.setTimerTask.name], async (timer: TimerType) => {
        return (await habitsService.setTimerTask(timer)).data.data;
    });

    React.useEffect(() => {
        setAutoComplete(Boolean(todo?.timer?.autoComplete));
    }, [todo]);

    const onOpenChange = (val: boolean) => {
        setIsOpen(val);
        if (!val) {
            setIsTimesUp(false);
        }
    }

    const ctrl = {
        open: () => {
            setIsOpen(true);
        },
        isOpen,
    }

    const disablePlay = !time?.hours && !time?.minutes && !time?.seconds;

    const onReset = () => {
        setTimer({
            ...todo,
            timer: null,
        } as Todo);
        setIsTimesUp(false);
        setTime(defaultTime);
    }

    const onPlay = () => {
        if (disablePlay) return;

        const timer = {
            autoComplete,
            type: "todo",
            itemId: todo?.id,
            noteId: anyId,
            startTime: moment(moment.now()).toISOString(),
            endTime: moment(moment.now()).add(time).toISOString(),
        } as TimerType;

        setTimerMutate.mutateAsync(timer);
        setTimer({ ...todo, timer } as Todo);
    }

    const onTimesUp = () => {
        if (!todo?.timer?.isEnd) {
            setIsTimesUp(true);
        }
        if (autoComplete) {
            setTimer({
                ...todo,
                isCheck: true,
                checkedAt: todo?.checkedAt || new Date(todo?.timer?.endTime || Date.now()).getTime(),
                timer: {
                    ...todo?.timer,
                    isEnd: true,
                },
            } as Todo);
        }
    }

    const onCompleteRender = () => {
        if (!todo?.timer?.isEnd) {
            onTimesUp();
        }
        return <h1>Times Up!</h1>
    }

    const onClickZenMode = () => {
        setIsOpen(false);
        timerContext.open(todo);
    }

    return (
        <>
            <Drawer open={isOpen} onOpenChange={onOpenChange}>
                <DrawerContent className="z-50">
                    <DrawerHeader>
                        <DrawerTitle className="capitalize">
                            <div className="flex items-start gap-4 justify-between">
                                <p className="flex items-center w-full text-sm font-light">
                                    <Info size={14} className="mr-2" />
                                    Set timer for <span className="font-semibold ml-2">{todo?.content}</span>
                                </p>
                                {todo?.timer && !isTimesUp && (
                                    <button onClick={onClickZenMode} className="" title="Zen Mode">
                                        <Scan />
                                    </button>
                                )}
                            </div>
                        </DrawerTitle>
                    </DrawerHeader>
                    <div className="container-custom flex flex-col gap-4">
                        <div className="h-[250px] flex items-center justify-center overflow-hidden">
                            {todo?.timer && <Countdown endTime={todo?.timer?.endTime} startTime={todo?.timer?.startTime} onCompleteRender={onCompleteRender}>
                                {({ text, progress }) => (<div className="w-[250px] h-[250px]">
                                    <CircularProgressbar text={text} value={progress} styles={buildStyles({
                                        textSize: '14px',
                                        textColor: hexToRgba("#000000", 0.7),
                                        backgroundColor: "#00000000",
                                        pathColor: themeColor.gray[700]
                                    })} />
                                </div>)}
                            </Countdown>}
                            {!todo?.timer && <Timer onChange={(t) => setTime(t)} />}
                        </div>
                        <div className="flex items-center justify-between w-full my-10 h-[40px]">
                            {todo?.timer?.isEnd && (<div>
                                Task mark done at {moment(todo?.checkedAt).format("DD MMM, HH:mm")} 🎉
                            </div>)}
                            {!todo?.timer?.isEnd && (
                                <CheckboxCustom disabled={!!todo?.timer} checked={autoComplete} onChecked={setAutoComplete} label="Auto complete task when time end" />
                            )}
                            {isTimesUp && !todo?.timer?.isEnd && (
                                <Button onClick={onReset} size="icon">
                                    <RotateCw />
                                </Button>
                            )}
                            {!isTimesUp && !todo?.timer && (
                                <Button disabled={disablePlay} onClick={onPlay} size="icon">
                                    <Play />
                                </Button>
                            )}
                        </div>
                    </div>
                </DrawerContent>
            </Drawer>
            {children(ctrl)}
        </>
    );
}