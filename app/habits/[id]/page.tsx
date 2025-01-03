/* eslint-disable @next/next/no-img-element */
"use client";

import { Todo } from "@/app/write/mode/todolist";
import enjoyAnim from "@/asset/animation/enjoy.json";
import fireAnim from "@/asset/animation/fire.json";
import ResponsiveTagsListed from "@/components/common/tag-listed";
import HabitsCountdown from "@/components/habits/habits-countdown";
import LayoutGrid from "@/components/layout-grid";
import StateRender from "@/components/state-render";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useHabitComplete from "@/hooks/use-habit-complete";
import useSkipFirstRender from "@/hooks/use-skip-first-render";
import useToggleHideNav from "@/hooks/use-toggle-hide-nav";
import {
  calculateShowProgress,
  convertEditorDataToText,
  easeDefault,
  progressCheer,
} from "@/lib/utils";
import habitsService from "@/service/habits";
import noteService from "@/service/note";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import parse from "html-react-parser";
import {
  Check,
  CheckCheck,
  ChevronLeft,
  PencilRuler,
  TimerReset,
} from "lucide-react";
import moment from "moment";
import { useRouter } from "next-nprogress-bar";
import { useParams } from "next/navigation";
import React from "react";
import "react-circular-progressbar/dist/styles.css";
import Lottie from "react-lottie";
import CardContinueZenMode from "./components/card-continue-zen-mode";
import HistoryCalendar from "./components/history-calendar";
import ListCardHabit from "./components/list-card-habit";
import { useCheeringOverlay } from "@/components/overlay/cheering";

const defaultOptions = {
  loop: true,
  autoplay: true,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

export default function HabitDetail() {
  const router = useRouter();
  const { id } = useParams();

  const [todos, setTodos] = React.useState<Todo[]>([]);
  const prevProgressDoneCheer = React.useRef<number>();
  const [progressDoneCheer, setProgressDoneCheer] = React.useState<{
    progress: number;
    todoId: string;
  }>();
  const habitComplete = useHabitComplete();
  const isNavHide = useToggleHideNav();
  const queryClient = useQueryClient();
  const cheeringOverlay = useCheeringOverlay();

  const noteDetailQuery = useQuery(
    [noteService.getOneNote.name, id],
    async () => {
      return (await noteService.getOneNote(id as string)).data.data;
    },
    {
      refetchInterval: false,
      refetchOnWindowFocus: false,
      onSuccess(data) {
        if (!data) {
          router.back();
          return;
        }
        setTodos(data?.todos || []);
      },
    }
  );

  const noteDetailForCalenderView = useQuery(
    ["get-note(calendar only)", id],
    async () => {
      return (await noteService.getOneNote(id as string)).data.data;
    },
    {
      refetchInterval: false,
      refetchOnWindowFocus: false,
    }
  );

  const historyQuery = useQuery(
    ["get-history", id],
    async () => {
      return (await habitsService.getHabitHistory(id as string)).data.data;
    },
    {
      refetchInterval: false,
      refetchOnWindowFocus: false,
    }
  );

  const changeTodosMutate = useMutation(async (todos: Todo[]) => {
    return (await noteService.changeTodos({ noteId: id as string, todos })).data
      .data;
  });

  const finishHabits = useMutation(async (id: string) => {
    return (await habitsService.finishHabits(id)).data.data;
  });

  const deleteTimerTask = useMutation(
    [habitsService.deleteTimerTask.name],
    async (data: { noteId: string; itemId: string }) => {
      return (await habitsService.deleteTimerTask(data)).data.data;
    }
  );

  useSkipFirstRender(() => {
    const update = setTimeout(() => {
      if (!id) return;
      changeTodosMutate
        .mutateAsync(todos)
        .catch(() => {
          // why in catch ? only when error refetch the detail
          noteDetailQuery.refetch();
        })
        .finally(() => {
          noteDetailForCalenderView.refetch();
          queryClient.refetchQueries({
            queryKey: [habitsService.getUrgentHabit.name],
            exact: true,
          });
        });
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
    const stepPoint = calculateShowProgress({
      taskDone: currentTodos?.filter((t) => t.isCheck).length!,
      taskLength: todos?.length!,
    });
    if (stepPoint === prevProgressDoneCheer.current) return;
    setProgressDoneCheer({ progress: stepPoint, todoId: changedTodo.id });
    prevProgressDoneCheer.current = progress === 100 ? undefined : stepPoint;
  };

  const onUpdateCheck = (todo: Todo) => {
    const currentTodos = todos?.map((td) => {
      if (td.id !== todo.id) return td;
      deleteTimerTask.mutate({
        itemId: td.id,
        noteId: noteDetailQuery.data?.id as string,
      });
      return {
        ...td,
        isCheck: !td.isCheck,
        checkedAt: !td.isCheck ? new Date().getTime() : null,
        timer: null,
      };
    });
    const isDoneIncrease =
      currentTodos?.filter((t) => t.isCheck).length! >
      todos?.filter((t) => t.isCheck).length!;
    setTodos(currentTodos);
    if (isDoneIncrease) {
      progressCheerUpdate(currentTodos!, todo);
    }
  };

  const onFinishClick = () => {
    finishHabits.mutateAsync(id as string).then(() => {
      const { wordCongrat, randomAnimate, affirmation } =
        habitComplete.generateRandom();
      cheeringOverlay.play({
        message: (
          <h1 className="text-white text-5xl whitespace-nowrap text-center">
            {wordCongrat}
          </h1>
        ),
        element: (
          <Lottie
            options={{
              ...defaultOptions,
              animationData: randomAnimate,
              loop: true,
            }}
            height={250}
            width={250}
          />
        ),
        description: (
          <span className="text-white text-sm capitalize whitespace-nowrap">
            {affirmation}
          </span>
        ),
      });
      noteDetailQuery.refetch();
      historyQuery.refetch();
    });
  };

  const taskDone = todos?.filter((td) => td.isCheck).length;
  const progress = Math.round((taskDone! / (todos!.length || 1)) * 100);
  const clickToFinish = progress === 100 && noteDetailQuery.data?.reschedule;

  const habitCompleted =
    !noteDetailQuery.data?.reschedule && !noteDetailQuery.isLoading;

  const isFreeToday =
    noteDetailQuery.data?.schedulerType === "day" &&
    !noteDetailQuery.data?.schedulerDays?.includes(
      moment().format("dddd").toLocaleLowerCase()
    );

  const calenderViewMemo = React.useMemo(
    () => (
      <HistoryCalendar
        histories={historyQuery.data}
        currentHabit={noteDetailForCalenderView.data}
      />
    ),
    [noteDetailForCalenderView.data, historyQuery.data]
  );

  const resetTodoTimer = useMutation(async (id: string) => {
    return (await noteService.resetTodosTimer(id)).data.data;
  });

  const resetChecklist = () => {
    changeTodosMutate
      .mutateAsync(
        todos.map((t) => ({ ...t, checkedAt: null, isCheck: false }))
      )
      .then(() => {
        noteDetailForCalenderView.refetch();
        noteDetailQuery.refetch();
      });
  };

  const resetTimer = () => {
    resetTodoTimer.mutateAsync(id as string).then(() => {
      noteDetailForCalenderView.refetch();
      noteDetailQuery.refetch();
    });
  };

  const navbar = React.useMemo(
    () => (
      <motion.div
        style={{ pointerEvents: isNavHide ? "none" : "auto" }}
        animate={{ y: isNavHide ? "-100%" : 0 }}
        transition={{ ease: easeDefault }}
        className="sticky top-0 left-0 py-1 bg-white z-50"
      >
        <div className="container-custom flex flex-row items-center justify-between flex-1">
          <div className="flex gap-2 items-center flex-1">
            <Button
              onClick={() => router.back()}
              size="icon"
              variant="ghost"
              className="!w-10"
            >
              <ChevronLeft />
            </Button>
            <div className="m-0 font-semibold line-clamp-1 capitalize flex items-center gap-2 flex-1">
              {noteDetailQuery.isLoading
                ? "Getting Habit..."
                : noteDetailQuery?.data?.title}
              <ResponsiveTagsListed
                tags={noteDetailQuery.data?.tags}
                size={14}
              />
            </div>
          </div>
          <div className="w-fit flex items-center gap-3">
            {process.env.NODE_ENV === "development" && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    loading={changeTodosMutate.isLoading}
                    onClick={resetChecklist}
                    size="icon"
                    variant="ghost"
                    className="!w-10 flex-1 text-gray-700"
                  >
                    <CheckCheck size={18} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Reset Checklist</TooltipContent>
              </Tooltip>
            )}
            {process.env.NODE_ENV === "development" && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    loading={resetTodoTimer.isLoading}
                    onClick={resetTimer}
                    size="icon"
                    variant="ghost"
                    className="!w-10 flex-1 text-gray-700"
                  >
                    <TimerReset size={18} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Reset timer</TooltipContent>
              </Tooltip>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => router.push(`/write/${id}`)}
                  size="icon"
                  variant="ghost"
                  className="!w-10 flex-1 text-gray-700"
                >
                  <PencilRuler size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Edit</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </motion.div>
    ),
    [isNavHide, noteDetailQuery, router]
  );

  return (
    <div className="bg-white min-h-screen pb-20">
      {navbar}
      <AnimatePresence>
        {clickToFinish && (
          <motion.div
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            initial={{ height: 0 }}
            className="w-full container-custom overflow-hidden flex items-center justify-between border-solid border-b border-gray-200"
          >
            <p className="m-0 text-xs">Congrats!, Click finish to finish?</p>
            <button
              disabled={finishHabits.isLoading}
              onClick={onFinishClick}
              className="flex text-xs font-light items-center gap-2 my-2 bg-yellow-500 text-white border-none rounded-md px-2 py-1"
            >
              Check as Done <Check />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <StateRender
        data={noteDetailQuery.data}
        isLoading={noteDetailQuery.isLoading}
      >
        <StateRender.Data>
          <div className="container-custom flex flex-col">
            {isFreeToday && (
              <div className="flex gap-3 relative overflow-hidden rounded-lg my-10">
                <Lottie
                  style={{ pointerEvents: "none", zIndex: 10 }}
                  options={{ ...defaultOptions, animationData: enjoyAnim }}
                  height={150}
                  width={250}
                />
                <p className="text-xl z-10">Enjoy, there is no task today 😎</p>
              </div>
            )}
            {!isFreeToday && (
              <div className="flex items-center gap-3 mt-4 mb-2">
                {!habitCompleted ? (
                  <span className="text-gray-400 text-xs ">Need to do</span>
                ) : (
                  <span className="text-green-600 text-xs flex items-center">
                    Complete!
                    <Lottie
                      style={{ pointerEvents: "none" }}
                      options={{ ...defaultOptions, animationData: fireAnim }}
                      height={30}
                      width={30}
                    />
                  </span>
                )}
                {!habitCompleted && (
                  <div className="flex-1 flex gap-2 items-center max-w-[400px]">
                    <Progress className="h-[5px]" value={progress} />
                    <p className="m-0 text-xs text-gray-500 text-end">{`${taskDone}/${todos?.length}`}</p>
                  </div>
                )}
              </div>
            )}
            <LayoutGrid items={todos} className="mb-2">
              {(todo) => (
                <ListCardHabit
                  noteId={noteDetailQuery?.data?.id}
                  setTodos={setTodos}
                  completedHabit={
                    !noteDetailQuery.data?.reschedule || isFreeToday
                  }
                  progressDoneCheer={progressDoneCheer}
                  onCheck={onUpdateCheck}
                  key={todo.id}
                  todo={todo}
                />
              )}
            </LayoutGrid>
            {noteDetailQuery.data?.reschedule && !isFreeToday && (
              <HabitsCountdown noteHabits={noteDetailQuery.data} />
            )}
            <CardContinueZenMode note={noteDetailQuery.data} />
            <span className="text-gray-400 text-xs mt-8 mb-2">Description</span>
            <div className="text-gray-700 capitalize">
              {noteDetailQuery.data?.description
                ? parse(
                    convertEditorDataToText(noteDetailQuery.data.description!)
                  )
                : "-"}
            </div>
            <span className="text-gray-400 text-xs mt-8 mb-2">
              Scheduler in
            </span>
            <div className="text-gray-700 capitalize text-xs">
              {noteDetailQuery.data?.schedulerType === "day"
                ? noteDetailQuery.data?.schedulerDays?.join(", ")
                : noteDetailQuery.data?.schedulerType}
            </div>
            <span className="text-gray-400 text-xs mt-8 mb-2">
              History streak
            </span>
            <StateRender
              data={historyQuery.data}
              isLoading={historyQuery.isLoading}
            >
              <StateRender.Data>{calenderViewMemo}</StateRender.Data>
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
  );
}
