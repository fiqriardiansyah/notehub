"use client";

import animationData from "@/asset/animation/cup.json";
import { Note } from "@/models/note";
import habitsService from "@/service/habits";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { MoveRight } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import Lottie from "react-lottie";
import HabitsUrgent from "./habits-urgent";
import RunningTimer from "./running-timer";
import React from "react";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

export type HabitsAlertProps = {
  children?: (element: React.ReactElement) => any;
};

export default function HabitsAlert({ children }: HabitsAlertProps) {
  const router = useRouter();

  const habitsToday = useQuery([habitsService.getUrgentHabit.name, "habitstoday"], async () => {
    return (await habitsService.getUrgentHabit()).data.data;
  });

  const runningTimerQuery = useQuery([habitsService.getRunningTimer.name], async () => {
    return (await habitsService.getRunningTimer()).data.data;
  });

  const component = React.useMemo(
    () => (
      <div className="flex flex-col gap-4">
        <HabitsUrgent onChangeHabit={habitsToday.refetch} />
        <RunningTimer />
        <AnimatePresence>
          {habitsToday.data?.length && habitsToday.data?.length > 1 && !runningTimerQuery.data?.length && (
            <motion.button
              onClick={() => router.push("/habits")}
              exit={{ scale: 1, height: 0 }}
              animate={{ height: "auto", scale: 1 }}
              initial={{ height: 0, scale: 0 }}
              className="flex items-center justify-between p-2 rounded-md bg-[#ecffa3] overflow-hidden"
            >
              <div className="flex items-center gap-2">
                <Lottie style={{ pointerEvents: "none" }} options={defaultOptions} height={60} width={60} />
                <span className="text-sm font-semibold">You have {habitsToday.data?.length} habits on going</span>
              </div>
              <MoveRight className="mr-2" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    ),
    [habitsToday, router, runningTimerQuery]
  );

  if (children) {
    if (!habitsToday?.isLoading) {
      if (!habitsToday?.data?.length || !habitsToday?.data) return null;
      return children(component);
    }
    return null;
  }

  return component;
}
