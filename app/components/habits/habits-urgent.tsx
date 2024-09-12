"use client";

import { Todo } from "@/app/write/mode/todolist";
import Countdown from "@/components/common/countdown";
import { Checkbox } from "@/components/ui/checkbox";
import useHabitComplete, { JSON_ANIMATIONS } from "@/hooks/use-habit-complete";
import useSkipFirstRender from "@/hooks/use-skip-first-render";
import { easeDefault, hexToRgba, progressCheer } from "@/lib/utils";
import habitsService from "@/service/habits";
import noteService from "@/service/note";
import { useMutation, useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import { Blocks, Check, Timer } from "lucide-react";
import Link from "next/link";
import React from "react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import themeColor from "tailwindcss/colors";
import HabitsCountdown from "./habits-countdown";
import HabitsTimer from "./habits-timer";

export type HabitsUrgentProps = React.HTMLProps<HTMLDivElement> & {
    onChangeHabit?: () => void;
    inPageHabits?: boolean;
    renderWhenComplete?: (randomAnim: any) => any;
}

export default function HabitsUrgent({ onChangeHabit, renderWhenComplete, inPageHabits, className, ...props }: HabitsUrgentProps) {
    const [todos, setTodos] = React.useState<Todo[]>([]);
    const prevProgressDoneCheer = React.useRef<number>();
    const [progressDoneCheer, setProgressDoneCheer] = React.useState<number>();
    const habitComplete = useHabitComplete();

    const getHabitsUrgent = useQuery([habitsService.getUrgentHabit.name], async () => {
        const list = (await habitsService.getUrgentHabit(1)).data.data;
        return list;
    }, {
        onSuccess(data) {
            if (data.length) {
                setTodos(data[0].todos || []);
                return;
            }
            setTodos([]);
        },
    });

    const habit = getHabitsUrgent?.data?.length ? getHabitsUrgent.data[0] : null;

    const changeTodosMutate = useMutation(async (todos: Todo[]) => {
        return (await noteService.changeTodos({ noteId: habit!.id, todos })).data.data;
    });

    useSkipFirstRender(() => {
        const update = setTimeout(() => {
            if (!habit?.id) return;
            changeTodosMutate.mutateAsync(todos).finally(() => {
                if (onChangeHabit) onChangeHabit();
            });
        }, 1000);

        return () => clearTimeout(update);
    }, [todos]);

    const finishHabits = useMutation(async (id: string) => {
        return (await habitsService.finishHabits(id)).data.data
    });

    useSkipFirstRender(() => {
        const update = setTimeout(() => {
            setProgressDoneCheer(undefined);
        }, 3000);

        return () => clearTimeout(update);
    }, [progressDoneCheer]);

    const progressCheerUpdate = (currentTodos: Todo[]) => {
        const progress = Math.round(currentTodos?.filter((t) => t.isCheck).length! / todos?.length! * 100);

        const messagePoint = Math.round(progress / (100 / progressCheer.length));
        if (messagePoint === prevProgressDoneCheer.current) return;
        setProgressDoneCheer(messagePoint);
        prevProgressDoneCheer.current = messagePoint === 100 ? undefined : messagePoint;
    }

    const onUpdateCheck = (todo: Todo) => {
        return (isCheck: boolean) => {
            const currentTodos = todos?.map((td) => {
                if (td.id !== todo.id) return td;
                return {
                    ...td,
                    isCheck,
                    checkedAt: isCheck ? new Date().getTime() : null,
                    timer: null,
                }
            });
            const isDoneIncrease = currentTodos?.filter((t) => t.isCheck).length! > todos?.filter((t) => t.isCheck).length!
            setTodos(currentTodos);
            if (isDoneIncrease) {
                progressCheerUpdate(currentTodos!);
            }
        }
    }

    const onClickDone = () => {
        finishHabits.mutateAsync(habit?.id as string).then(() => {
            habitComplete.show();
            getHabitsUrgent.refetch();
            if (onChangeHabit) onChangeHabit();
        });
    }

    const taskDone = todos?.filter((td) => td.isCheck).length
    const progress = Math.round(taskDone! / todos!.length * 100);
    const isDone = taskDone === todos.length;
    const nameOftheDay = () => {
        if (habit?.schedulerType === "day") {
            const day = dayjs().format('dddd');
            const date = dayjs().format('DD MMM YYYY');
            return {
                name: inPageHabits ? "Today" : day,
                date,
            }
        }
        if (habit?.schedulerType === "weekly") return { name: inPageHabits ? "This Week" : "Weeks" };
        if (habit?.schedulerType === "monthly") return { name: inPageHabits ? "This Month" : "Months" };
    }

    const onSetTimer = (todo: Todo) => {
        setTodos((prev) => {
            return prev.map((td) => {
                if (td.id !== todo.id) return td;
                return todo;
            })
        })
    }

    const onCompleteTimer = (todo: Todo) => {
        if (todo?.timer?.autoComplete) {
            onSetTimer({
                ...todo,
                isCheck: true,
                checkedAt: new Date().getTime(),
                timer: {
                    ...todo?.timer,
                    isEnd: true,
                },
            } as Todo);
            return;
        }
        onSetTimer({ ...todo, timer: null });
    };

    return (
        <div className="flex flex-col gap-1 overflow-hidden" >
            {habit && <div className="flex w-full justify-end">
                <Link href={`/habits/${habit?.id}`} passHref> <a className="text-gray-400 text-xs font-light">View Details</a> </Link>
            </div>}
            <div
                className={`${className} rounded-md p-3 flex flex-col gap-3 w-full relative overflow-hidden`}
                key={habit?.id}
                {...props} >
                <div className="font-semibold z-10 leading-none">
                    {!inPageHabits && <p className="text-sm z-10 m-0">Habits on this <span className="text-xs font-light">{nameOftheDay()?.date}</span> </p>}
                    {inPageHabits && <p className="text-sm z-10 m-0 line-clamp-1 flex flex-row">
                        <Blocks className="mr-2 text-gray-500" size={18} />
                        {habit?.title}
                    </p>}
                    <div className="overflow-y-hidden h-[36px] flex-1 relative">
                        <AnimatePresence mode="wait">
                            {progressCheer.map((pc) => {
                                if (pc.donepoint === progressDoneCheer) {
                                    return (
                                        <motion.p
                                            key={pc.donepoint}
                                            initial={{ y: '40px' }}
                                            animate={{ y: 0 }}
                                            exit={{ y: '-40px' }}
                                            style={{ background: pc.bgColor }}
                                            className="font-semibold p-1 px-2 rounded w-fit text-xl text-white capitalize">
                                            {pc.content}
                                        </motion.p>
                                    )
                                }
                                return null
                            })}
                            {(progressDoneCheer === null || progressDoneCheer === undefined) &&
                                <motion.div
                                    key="day"
                                    initial={{ y: '40px' }}
                                    animate={{ y: 0 }}
                                    exit={{ y: '-40px' }}
                                    className={`font-semibold text-xl capitalize flex items-center gap-4`}>
                                    {nameOftheDay()?.name}
                                    <AnimatePresence>
                                        {isDone && <motion.button
                                            onClick={onClickDone}
                                            exit={{ opacity: 0 }}
                                            className="flex text-xs font-light items-center gap-2 bg-yellow-500 text-white border-none rounded-md px-2 py-1">
                                            Check as Done <Check />
                                        </motion.button>}
                                    </AnimatePresence>
                                </motion.div>
                            }
                        </AnimatePresence>
                    </div>
                </div>
                <div className="flex flex-col gap-2 p-1 w-full max-h-[250px] overflow-y-auto z-10">
                    {todos.map((todo) => (
                        <div key={todo.id} className="w-full flex items-center justify-between">
                            <div className="flex gap-2 items-center h-[40px]">
                                <HabitsTimer setTimer={onSetTimer} todo={todo}>
                                    {(ctrl) => {
                                        if (todo?.timer && !todo?.timer?.isEnd) {
                                            return (
                                                <Countdown
                                                    onCompleteRender={ctrl.isOpen ? () => { } : () => onCompleteTimer(todo)}
                                                    endTime={todo?.timer?.endTime}
                                                    startTime={todo?.timer?.startTime}>
                                                    {({ text, progress }) => (
                                                        <button onClick={todo?.isCheck ? () => { } : ctrl.open} className="w-10 h-10 rounded-full relative">
                                                            <CircularProgressbar text="" value={progress} styles={buildStyles({
                                                                textSize: '10px',
                                                                textColor: hexToRgba("#000000", 0.7),
                                                                backgroundColor: "#00000000",
                                                                pathColor: themeColor.gray[500],
                                                            })} />
                                                            <Timer size={16} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                                                        </button>)}
                                                </Countdown>
                                            )
                                        }
                                        return (
                                            <button
                                                onClick={todo?.isCheck ? () => { } : ctrl.open}
                                                className={`w-10 h-10 rounded-full flex items-center justify-center ${todo?.isCheck ? "text-gray-400 pointer-events-none" : ""}`}>
                                                <Timer />
                                            </button>
                                        )
                                    }}
                                </HabitsTimer>
                                <div className="">
                                    <p className="text-sm m-0 capitalize leading-none line-clamp-1">{todo.content}</p>
                                    {todo.isCheck && (
                                        <span className="text-xs font-light m-0 leading-none">done at {dayjs(todo.checkedAt).format("DD MMM, HH:mm")}</span>
                                    )}
                                </div>
                            </div>
                            <Checkbox checked={todo.isCheck} onCheckedChange={onUpdateCheck(todo)} />
                        </div>
                    ))}
                </div>
                <div className="absolute bottom-0 left-0 w-full h-full flex flex-col justify-end">
                    <svg className="waves" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                        viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
                        <defs>
                            <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
                        </defs>
                        <g className="parallax">
                            <use xlinkHref="#gentle-wave" x="48" y="0" fill="rgb(172 176 255)" />
                            <use xlinkHref="#gentle-wave" x="48" y="3" fill="#c5c5ff" />
                            <use xlinkHref="#gentle-wave" x="48" y="5" fill="#d3d3ff" />
                        </g>
                    </svg>
                    <motion.div animate={{ height: `${progress}%` }}
                        transition={{ ease: easeDefault, delay: 0.4, duration: 0.8 }} className="transition duration-200 bg-[#d3d3ff] w-full"></motion.div>
                </div>
            </div>
            {!habit && renderWhenComplete && renderWhenComplete(JSON_ANIMATIONS[Math.floor(Math.random() * JSON_ANIMATIONS.length)])}
            {habit?.id && <HabitsCountdown noteHabits={habit || undefined} />}
        </div>
    )
}