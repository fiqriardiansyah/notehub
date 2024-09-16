"use client";

import BottomBar from "@/components/navigation-bar/bottom-bar";
import StateRender from "@/components/state-render";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useToggleHideNav from "@/hooks/use-toggle-hide-nav";
import { easeDefault } from "@/lib/utils";
import habitsService from "@/service/habits";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import moment from "moment";
import { useRouter } from "next-nprogress-bar";
import React from "react";
import HabitsUrgent from "../components/habits/habits-urgent";
import AllHabits from "./components/all-habits";
import CompleteAllHabit from "./components/complete-all-habit";
import DailyHabits from "./components/daily-habits";
import ListCardHabit from "./components/list-card-habit";
import MonthlyHabits from "./components/monthly-habits";
import WeeklyHabits from "./components/weekly-habits";

const tabs = [
    {
        value: "all",
        label: "All",
    },
    {
        value: "day",
        label: "Daily"
    },
    {
        value: "weekly",
        label: "Weekly",
    },
    {
        value: "monthly",
        label: "Monthly"
    }
]

export default function Habits() {
    const router = useRouter();
    const isNavHide = useToggleHideNav();

    const pickedDay = moment().format("dddd");
    const pickedDate = moment().format("DD MMM YYYY");

    const [activeTab, setActiveTab] = React.useState(tabs[0].value);

    const habitsToday = useQuery([habitsService.getUrgentHabit.name, "habitstoday", pickedDate], async () => {
        return (await habitsService.getUrgentHabit(5)).data.data;
    });

    const allHabit = useQuery([habitsService.getHabits.name, "all"], async () => {
        return (await habitsService.getHabits("all")).data.data
    });

    const onTabChange = (key: string) => {
        setActiveTab(key);
    }

    return (
        <div className="w-screen bg-white min-h-screen pb-20">
            <motion.div animate={{ y: isNavHide ? "-100%" : 0 }} transition={{ ease: easeDefault }} className="sticky top-0 left-0 py-1 bg-white z-50">
                <div className="container-custom flex flex-row items-center justify-between">
                    <div className="flex gap-2 items-center">
                        <Button onClick={() => router.back()} size="icon" variant="ghost" className="!w-10 flex-1">
                            <ChevronLeft />
                        </Button>
                        <p className="m-0 font-semibold">{pickedDay}, <span className="text-xs font-normal">{pickedDate}</span> 👋</p>
                    </div>
                    {/* <div className="w-fit">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <PickDate onSelectDate={onSelectDate} pickedDate={momentDate}>
                                    {(ctrl) => (
                                        <Button onClick={ctrl.open} size="icon" variant="ghost" className="!w-10 flex-1">
                                            <CalendarRange />
                                        </Button>
                                    )}
                                </PickDate>
                            </TooltipTrigger>
                            <TooltipContent>
                                Calendar
                            </TooltipContent>
                        </Tooltip>
                    </div> */}
                </div>
            </motion.div>
            <StateRender data={allHabit.data} isLoading={allHabit.isLoading}>
                <StateRender.Data>
                    {allHabit.data?.length ? (
                        <div className={`container-custom flex flex-col ${habitsToday.data?.length ? "mt-2 mb-16" : ""}`}>
                            <HabitsUrgent inPageHabits onChangeHabit={habitsToday.refetch} />
                            {habitsToday.data?.length ? <p className="text-2xl my-3 mt-5">Should Do! 💪</p> : null}
                            <div className="flex flex-col gap-3" >
                                {habitsToday.data?.map((habit, i) => (
                                    <ListCardHabit key={habit.id} index={i} habit={habit} />
                                ))}
                            </div>
                        </div>
                    ) : null}
                </StateRender.Data>
                <StateRender.Loading>
                    <p>Getting habits...</p>
                </StateRender.Loading>
            </StateRender>
            <Tabs defaultValue={activeTab} className="w-full sticky top-0 left-0 z-20" onValueChange={onTabChange}>
                <TabsList className="!w-full">
                    {tabs?.map((tab) => <TabsTrigger className="!flex-1" key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>)}
                </TabsList>
            </Tabs>
            <div className="container-custom flex flex-col mt-2 min-h-[50vh] pb-20">
                {activeTab === "all" && <AllHabits onGoingHabits={habitsToday.data?.length ? habitsToday.data[0]?.id : undefined} />}
                {activeTab === "day" && <DailyHabits onGoingHabits={habitsToday.data?.length ? habitsToday.data[0]?.id : undefined} />}
                {activeTab === "weekly" && <WeeklyHabits onGoingHabits={habitsToday.data?.length ? habitsToday.data[0]?.id : undefined} />}
                {activeTab === "monthly" && <MonthlyHabits onGoingHabits={habitsToday.data?.length ? habitsToday.data[0]?.id : undefined} />}
            </div>
            <BottomBar />
        </div>
    )
}