"use client";

import { Todo } from "@/app/write/mode/todolist";
import StateRender from "@/components/state-render";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import useHabitComplete from "@/hooks/use-habit-complete";
import useSkipFirstRender from "@/hooks/use-skip-first-render";
import { convertEditorDataToText, easeDefault, progressCheer } from "@/lib/utils";
import habitsService from "@/service/habits";
import noteService from "@/service/note";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import parse from 'html-react-parser';
import { Check, ChevronLeft, icons, PencilRuler } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import { useParams } from "next/navigation";
import React from "react";
import 'react-circular-progressbar/dist/styles.css';
import HistoryCalendar from "./components/history-calendar";
import ListCardHabit from "./components/list-card-habit";
import Lottie from "react-lottie";
import fireAnim from '@/asset/animation/fire.json';
import useToggleHideNav from "@/hooks/use-toggle-hide-nav";

const defaultOptions = {
    loop: true,
    autoplay: true,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};


export default function HabitDetail() {
    const router = useRouter();
    const { id } = useParams();

    const [todos, setTodos] = React.useState<Todo[]>([]);
    const prevProgressDoneCheer = React.useRef<number>();
    const [progressDoneCheer, setProgressDoneCheer] = React.useState<{ progress: number; todoId: string }>();
    const habitComplete = useHabitComplete();
    const isNavHide = useToggleHideNav();

    const noteDetailQuery = useQuery(["get-note", id], async () => {
        return (await noteService.getOneNote(id as string)).data.data
    }, {
        refetchInterval: false,
        refetchOnWindowFocus: false,
        onSuccess(data) {
            setTodos(data?.todos || []);
        }
    });

    const noteDetailForCalenderView = useQuery(["get-note(calendar only)", id], async () => {
        return (await noteService.getOneNote(id as string)).data.data
    }, {
        refetchInterval: false,
        refetchOnWindowFocus: false,
    });

    const historyQuery = useQuery(["get-history", id], async () => {
        return (await habitsService.getHabitHistory(id as string)).data.data;
    }, {
        refetchInterval: false,
        refetchOnWindowFocus: false,
    })

    const changeTodosMutate = useMutation(async (todos: Todo[]) => {
        return (await noteService.changeTodos({ noteId: id as string, todos })).data.data;
    });

    const finishHabits = useMutation(async (id: string) => {
        return (await habitsService.finishHabits(id)).data.data
    });

    useSkipFirstRender(() => {
        const update = setTimeout(() => {
            if (!id) return;
            changeTodosMutate.mutateAsync(todos).catch(() => {
                // why in catch ? only when error refetch the detail
                noteDetailQuery.refetch()
            }).finally(noteDetailForCalenderView.refetch);
        }, 1000);

        return () => clearTimeout(update);
    }, [todos]);

    useSkipFirstRender(() => {
        const update = setTimeout(() => {
            setProgressDoneCheer(undefined);
        }, 3000);

        return () => clearTimeout(update);
    }, [progressDoneCheer]);

    const progressCheerUpdate = (currentTodos: Todo[], changedTodo: Todo) => {
        const progress = Math.round(currentTodos?.filter((t) => t.isCheck).length! / todos?.length! * 100);
        const messagePoint = Math.round(progress / (100 / progressCheer.length));
        if (messagePoint === prevProgressDoneCheer.current) return;
        setProgressDoneCheer({ progress: messagePoint, todoId: changedTodo.id });
        prevProgressDoneCheer.current = messagePoint === 100 ? undefined : messagePoint;
    }

    const onUpdateCheck = (todo: Todo) => {
        const currentTodos = todos?.map((td) => {
            if (td.id !== todo.id) return td;
            return {
                ...td,
                isCheck: !td.isCheck,
                checkedAt: !td.isCheck ? new Date().getTime() : null,
            }
        });
        const isDoneIncrease = currentTodos?.filter((t) => t.isCheck).length! > todos?.filter((t) => t.isCheck).length!
        setTodos(currentTodos);
        if (isDoneIncrease) {
            progressCheerUpdate(currentTodos!, todo);
        }
    }

    const onFinishClick = () => {
        finishHabits.mutateAsync(id as string).then(() => {
            habitComplete.show();
            noteDetailQuery.refetch();
            historyQuery.refetch();
        });
    }

    const taskDone = todos?.filter((td) => td.isCheck).length;
    const progress = Math.round(taskDone! / (todos!.length || 1) * 100);
    const clickToFinish = progress === 100 && noteDetailQuery.data?.reschedule;

    const habitCompleted = !noteDetailQuery.data?.reschedule && !noteDetailQuery.isLoading;

    return (
        <div className="w-screen bg-white min-h-screen pb-20">
            <motion.div animate={{ y: isNavHide ? "-100%" : 0 }} transition={{ ease: easeDefault }} className="sticky top-0 left-0 py-1 bg-white z-50">
                <div className="container-custom flex flex-row items-center justify-between">
                    <div className="flex gap-2 items-center">
                        <Button onClick={() => router.back()} size="icon" variant="ghost" className="!w-10 flex-1">
                            <ChevronLeft />
                        </Button>
                        <div className="m-0 font-semibold line-clamp-1 capitalize flex items-center">
                            {noteDetailQuery.isLoading ? "Getting Habit..." : noteDetailQuery?.data?.title}
                            {noteDetailQuery.data?.tags?.length ? (
                                <div className="flex items-center gap-2 line-clamp-1 ml-2">
                                    {noteDetailQuery.data?.tags?.map((tag) => {
                                        const Icon = icons[tag.icon as keyof typeof icons];
                                        return <Icon size={13} key={tag.id} className="text-gray-700" />
                                    })}
                                </div>
                            ) : null}
                        </div>
                    </div>
                    <div className="w-fit">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button size="icon" variant="ghost" className="!w-10 flex-1 text-gray-700">
                                    <PencilRuler size={18} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                Edit
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </div>
            </motion.div>
            <AnimatePresence>
                {clickToFinish && (
                    <motion.div
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        initial={{ height: 0 }}
                        className="w-full container-custom overflow-hidden flex items-center justify-between border-solid border-b border-gray-200">
                        <p className="m-0 text-xs">Congrats!, Click finish to finish?</p>
                        <button
                            disabled={finishHabits.isLoading}
                            onClick={onFinishClick}
                            className="flex text-xs font-light items-center gap-2 my-2 bg-yellow-500 text-white border-none rounded-md px-2 py-1">
                            Check as Done <Check />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
            <StateRender data={noteDetailQuery.data} isLoading={noteDetailQuery.isLoading}>
                <StateRender.Data>
                    <div className="container-custom flex flex-col">
                        <div className="flex items-center justify-between gap-3 mt-4 mb-2">
                            {!habitCompleted ? <span className="text-gray-400 text-xs ">Need to do</span> :
                                <span className="text-green-600 text-xs flex items-center">Complete!
                                    <Lottie style={{ pointerEvents: 'none' }} options={{ ...defaultOptions, animationData: fireAnim }} height={30} width={30} />
                                </span>}
                            <div className="flex-1 flex gap-2 items-center max-w-[400px]">
                                <Progress className="h-[5px]" value={progress} />
                                <p className="m-0 text-xs text-gray-500 text-end">{`${taskDone}/${todos?.length}`}</p>
                            </div>
                        </div>
                        <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
                            {todos?.map((todo) => <ListCardHabit
                                completedHabit={!noteDetailQuery.data?.reschedule}
                                progressDoneCheer={progressDoneCheer}
                                onCheck={onUpdateCheck}
                                key={todo.id}
                                todo={todo} />)}
                        </div>
                        <span className="text-gray-400 text-xs mt-8 mb-2">Description</span>
                        <div className="text-gray-700 capitalize">{noteDetailQuery.data?.description ? parse(convertEditorDataToText(noteDetailQuery.data.description!)) : "-"}</div>
                        <span className="text-gray-400 text-xs mt-8 mb-2">History streak</span>
                        <StateRender data={historyQuery.data} isLoading={historyQuery.isLoading}>
                            <StateRender.Data>
                                <HistoryCalendar histories={historyQuery.data} currentHabit={noteDetailForCalenderView.data} />
                            </StateRender.Data>
                            <StateRender.Loading>
                                <p>Getting history</p>
                            </StateRender.Loading>
                        </StateRender>
                    </div>
                </StateRender.Data>
                <StateRender.Loading>
                    <p className="my-5 container-custom">Loading...</p>
                </StateRender.Loading>
            </StateRender>
        </div>
    )
};