"use client";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CalendarRange, ChevronLeft } from "lucide-react";
import HabitsUrgent from "../components/habits/habits-urgent";
import { useRouter } from "next-nprogress-bar";
import habitsService from "@/service/habits";
import { useQuery } from "@tanstack/react-query";
import ListCardHabit from "./components/list-card-habit";
import { AnimatePresence, motion } from "framer-motion";
import CompleteAllHabit from "./components/complete-all-habit";
import moment from "moment";

const staggerVariants = {
    initial: { opacity: 0, x: '100%' },
    animate: {
        opacity: 1,
        x: 0,
        transition: {
            staggerChildren: 0.2, // Delay between the animations of each child
        },
    },
    exit: { opacity: 0, x: '-100%' },
};

const itemVariants = {
    initial: { opacity: 0, x: '100%' },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: '-100%' },
};

export default function Habits() {
    const router = useRouter();

    const today = moment().format("dddd");
    const date = moment().format("DD MMM YYYY");

    const habitsToday = useQuery([habitsService.getUrgentHabit.name, "habitstoday"], async () => {
        return (await habitsService.getUrgentHabit(5)).data.data;
    });

    return (
        <div className="w-screen bg-white min-h-screen pb-20">
            <div className="sticky top-0 left-0 py-1 bg-white z-50">
                <div className="container-custom flex flex-row items-center justify-between">
                    <div className="flex gap-2 items-center">
                        <Button onClick={() => router.back()} size="icon" variant="ghost" className="!w-10 flex-1">
                            <ChevronLeft />
                        </Button>
                        <p className="m-0 font-semibold">{today}, <span className="text-xs font-normal">{date}</span> 👋</p>
                    </div>
                    <div className="w-fit">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button size="icon" variant="ghost" className="!w-10 flex-1">
                                    <CalendarRange />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                Calendar
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </div>
            </div>
            <div className="container-custom flex flex-col mt-2">
                <HabitsUrgent
                    inPageHabits
                    onChangeHabit={habitsToday.refetch}
                    renderWhenComplete={(anim) => <CompleteAllHabit anim={anim} />} />
                {habitsToday.data?.length ? <p className="text-2xl my-3 mt-5">Should Do! 💪</p> : null}
                <AnimatePresence>
                    <motion.div
                        variants={staggerVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="flex flex-col gap-3"
                    >
                        {habitsToday.data?.map((habit, i) => (
                            <motion.div key={habit.id} variants={itemVariants} >
                                <ListCardHabit index={i} habit={habit} />
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}