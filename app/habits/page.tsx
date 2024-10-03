"use client";

import BottomBar from "@/components/navigation-bar/bottom-bar";
import StateRender from "@/components/state-render";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import useToggleHideNav from "@/hooks/use-toggle-hide-nav";
import { easeDefault } from "@/lib/utils";
import habitsService from "@/service/habits";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, X } from "lucide-react";
import moment from "moment";
import { useRouter } from "next-nprogress-bar";
import { useSearchParams } from "next/navigation";
import React from "react";
import { CiSearch } from "react-icons/ci";
import HabitsUrgent from "@/components/habits/habits-urgent";
import SearchBar from "@/components/search-bar";
import AllHabits from "./components/all-habits";
import DailyHabits from "./components/daily-habits";
import ListCardHabit from "./components/list-card-habit";
import MonthlyHabits from "./components/monthly-habits";
import WeeklyHabits from "./components/weekly-habits";
import SearchHabits from "./components/search-habits";
import RunningTimer from "@/components/habits/running-timer";

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
    const searchParams = useSearchParams();
    const query = searchParams.get("query");

    const pickedDay = moment().format("dddd");
    const pickedDate = moment().format("DD MMM YYYY");

    const [activeTab, setActiveTab] = React.useState(tabs[0].value);
    const [search, setSearch] = React.useState<{ query: string, open: boolean }>({ query: "", open: false });
    const searchInputRef = React.useRef<HTMLInputElement>(null);

    const habitsToday = useQuery([habitsService.getUrgentHabit.name, "habitstoday", pickedDate], async () => {
        return (await habitsService.getUrgentHabit(5)).data.data;
    });

    const allHabit = useQuery([habitsService.getHabits.name, "all"], async () => {
        return (await habitsService.getHabits("all")).data.data
    });

    const onTabChange = (key: string) => {
        setActiveTab(key);
    }

    React.useEffect(() => {
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [search.open]);

    React.useEffect(() => {
        if (query?.trim()) {
            setSearch({
                open: true,
                query: query.trim(),
            });
        }
    }, [query]);

    const onClickSearch = () => {
        setSearch((prev) => ({ query: "", open: !prev.open }));
        if (search.open) {
            router.replace(`/habits`);
        }
    };

    const onChangeSearch = (e: any) => {
        const value = e.target.value;
        setSearch((prev) => ({ ...prev, query: value }));
    };

    const onSubmitSearch = (e: any) => {
        e.preventDefault();
        if (!search.query.trim()) return;
        router.replace(`/habits?query=${search.query}`);
    }

    const onGoingHabits = habitsToday.data?.length ? habitsToday.data[0]?.id : undefined;

    return (
        <div className="w-screen bg-white min-h-screen pb-20">
            <motion.div
                style={{ pointerEvents: isNavHide ? "none" : "auto" }}
                animate={{ y: isNavHide ? "-100%" : 0 }}
                transition={{ ease: easeDefault }} className="sticky overflow-y-hidden top-0 left-0 py-1 bg-white z-50">
                <div className="container-custom flex flex-row items-center justify-between gap-4">
                    <AnimatePresence mode="popLayout">
                        {search.open ?
                            <motion.div key="search" exit={{ y: '-100%', scale: 0.6 }} animate={{ y: 0, scale: 1 }} initial={{ y: '-100%' }} transition={{ ease: easeDefault }}>
                                <form onSubmit={onSubmitSearch}>
                                    <SearchBar value={search.query} onChange={onChangeSearch} ref={searchInputRef} placeholder="Search Habit" />
                                </form>
                            </motion.div>
                            : <motion.div key="date" exit={{ y: '100%', scale: 0.6 }} animate={{ y: 0, scale: 1 }} initial={{ y: '100%' }} transition={{ ease: easeDefault }} className="flex gap-2 items-center">
                                <Button onClick={() => router.back()} size="icon" variant="ghost" className="!w-10 flex-1">
                                    <ChevronLeft />
                                </Button>
                                <p className="m-0 font-semibold">{pickedDay}, <span className="text-xs font-normal">{pickedDate}</span> 👋</p>
                            </motion.div>}
                    </AnimatePresence>
                    <div className="w-fit">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button onClick={onClickSearch} size="icon" variant="ghost" className="!w-10 flex-1">
                                    {search.open ? <X size={20} /> : <CiSearch size={20} />}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                {search.open ? "Close Search" : "Search Note"}
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </div>
            </motion.div>
            {(search.open && search.query) ? (
                <div className="container-custom mt-10">
                    <SearchHabits query={search.query} habits={allHabit.data} onGoingHabits={onGoingHabits} />
                </div>
            ) : (
                <>
                    <StateRender data={allHabit.data} isLoading={allHabit.isLoading}>
                        <StateRender.Data>
                            {allHabit.data?.length ? (
                                <div className={`container-custom flex flex-col ${habitsToday.data?.length ? "mt-2 mb-16" : ""}`}>
                                    <HabitsUrgent inPageHabits onChangeHabit={habitsToday.refetch} />
                                    <div className="my-5">
                                        <RunningTimer />
                                    </div>
                                    {habitsToday.data?.length ? <p className="text-2xl my-3 mt-5">Should Do! 💪</p> : null}
                                    <div className="flex flex-col gap-3" >
                                        {habitsToday.data?.map((habit, i) => (
                                            <ListCardHabit key={habit.id} index={i} habit={habit} />
                                        ))}
                                    </div>
                                </div>
                            ) : null}
                        </StateRender.Data>
                    </StateRender>
                    <Tabs defaultValue={activeTab} className="w-full sticky top-0 left-0 z-20" onValueChange={onTabChange}>
                        <TabsList className="!w-full">
                            {tabs?.map((tab) => <TabsTrigger className="!flex-1" key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>)}
                        </TabsList>
                    </Tabs>
                    <div className="container-custom flex flex-col mt-2 min-h-[50vh] pb-20">
                        {activeTab === "all" && <AllHabits onGoingHabits={onGoingHabits} />}
                        {activeTab === "day" && <DailyHabits onGoingHabits={onGoingHabits} />}
                        {activeTab === "weekly" && <WeeklyHabits onGoingHabits={onGoingHabits} />}
                        {activeTab === "monthly" && <MonthlyHabits onGoingHabits={onGoingHabits} />}
                    </div>
                </>
            )}
            <BottomBar />
        </div>
    )
}