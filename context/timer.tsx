import { Todo } from "@/app/write/mode/todolist";
import Countdown from "@/components/common/countdown";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import habitsService from "@/service/habits";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import React from "react";
import timesupAnim from "@/asset/animation/timesup.json";
import Lottie from "react-lottie";
import { useSession } from "next-auth/react";
import { withoutSignPath } from "@/lib/utils";
import { usePathname } from "next/navigation";

const defaultOptions = {
    animationData: timesupAnim,
    loop: true,
    autoplay: true,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

export type TimerState = {
    isZenMode?: boolean;
    peakZenMode?: boolean;
    todo?: Partial<Todo>;
};

export type TimerContextType<T = any> = {
    timer: TimerState;
    open: (todo?: Partial<Todo>) => void;
    close: () => void;
    setTimer: React.Dispatch<React.SetStateAction<TimerState>>;
};

export const TimerContext = React.createContext({});

export const TimerProvider = ({ children }: { children: any }) => {
    const pathname = usePathname();
    const { toast } = useToast();
    const [timer, setTimer] = React.useState<TimerState>();
    const queryClient = useQueryClient();

    const timerZenMode = useQuery([habitsService.getTimerZenMode.name, timer], async () => {
        const response = (await habitsService.getTimerZenMode()).data.data;
        return response[0] || null;
    }, {
        enabled: !withoutSignPath.test(pathname),
        onSuccess(data) {
            if (!timer?.todo && data) {
                setTimer((prev) => ({
                    ...prev,
                    todo: {
                        id: data.itemId,
                        content: data.itemTitle,
                        timer: {
                            startTime: data.startTime,
                            endTime: data.endTime,
                        }
                    },
                    peakZenMode: true,
                }));
            }
        },
    });

    const setZenMode = useMutation([habitsService.setZenMode.name], async (data: { id?: any, val: boolean }) => {
        return (await habitsService.setZenMode(data?.id, data.val)).data.data;
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [habitsService.getRunningTimer.name] });
            queryClient.invalidateQueries({ queryKey: [habitsService.getTimerZenMode.name] });
        }
    });

    const open = (todo?: Partial<Todo>) => {
        if (!todo) {
            setTimer((prev) => ({ ...prev, isZenMode: true }));
            if (!document?.fullscreenElement) {
                document?.documentElement?.requestFullscreen();
            } else {
                toast({
                    description: "Fullscreen feature not found",
                    variant: "destructive"
                });
            }
            return;
        }

        if (!document?.fullscreenElement) {
            document?.documentElement?.requestFullscreen();
            setTimer({ isZenMode: true, todo });
            setZenMode.mutate({ id: todo?.id, val: true });
        } else {
            if (document?.exitFullscreen) {
                document?.exitFullscreen();
                setTimer({ isZenMode: false, todo: undefined });
                setZenMode.mutate({ id: todo?.id, val: false });
            }
        }
    }

    const close = () => {
        if (document?.exitFullscreen) {
            document?.exitFullscreen();
            setZenMode.mutate({ id: timer?.todo?.id, val: false });
            setTimer((prev) => ({
                ...prev,
                todo: undefined,
                isZenMode: false,
                peakZenMode: false,
            }));
        } else {
            toast({
                description: "Fullscreen feature not found",
                variant: "destructive"
            })
        }
    }

    const onCompleteCountdown = () => {
        setTimer((prev) => ({
            ...prev,
            todo: {
                ...prev?.todo,
                timer: {
                    ...prev?.todo?.timer,
                    isEnd: true
                }
            }
        }))
    }

    const value = {
        timer,
        setTimer,
        open,
        close,
    } as TimerContextType;

    return (
        <TimerContext.Provider value={value}>
            <AnimatePresence>
                {timer?.isZenMode && (
                    <motion.div
                        animate={{ opacity: 1, transition: { delay: 1 } }}
                        initial={{ opacity: 0 }}
                        exit={{ opacity: 0 }}
                        className="w-screen h-screen fixed top-0 bg-white left-0 flex-col" style={{ zIndex: 999 }}>
                        <div className="relative w-screen h-screen flex flex-col justify-between items-center">
                            <div className="flex w-full justify-end p-2">
                                <Button onClick={close} size="icon" variant="secondary" className="z-10">
                                    <X />
                                </Button>
                            </div>
                            <div className="flex-1 flex items-center justify-center">
                                <AnimatePresence>
                                    {timer?.todo?.timer?.isEnd ?
                                        <motion.div key="timesup" animate={{ height: 'auto', opacity: 1 }} initial={{ height: 0, opacity: 0 }}
                                            className="flex flex-col items-center justify-center w-full">
                                            <Lottie style={{ pointerEvents: 'none', zIndex: 10 }} options={defaultOptions} height={250} width={250} />
                                            <h1>Times up</h1>
                                        </motion.div> :
                                        <motion.div key="countdown" exit={{ height: 0, opacity: 0 }} initial={{ height: 'auto', opacity: 1 }}>
                                            <Countdown onCompleteRender={onCompleteCountdown} endTime={timer?.todo?.timer?.endTime} startTime={timer?.todo?.timer?.startTime}>
                                                {({ text, progress }) => <div className="flex flex-col gap-3 items-center w-[300px]">
                                                    <p className="font-semibold" style={{ fontSize: '40px' }}>{text}</p>
                                                    <Progress value={progress} />
                                                </div>}
                                            </Countdown>
                                        </motion.div>}
                                </AnimatePresence>
                            </div>
                            <p className="font-semibold text-xl my-10">💪 {timer?.todo?.content}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            {children}
        </TimerContext.Provider>
    );
};

export const useTimer = () => {
    const timer = React.useContext(TimerContext) as TimerContextType;
    return timer;
}