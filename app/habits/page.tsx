"use client";

import BottomBar from "@/components/navigation-bar/bottom-bar";
import StateRender from "@/components/state-render";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useToggleHideNav from "@/hooks/use-toggle-hide-nav";
import { easeDefault } from "@/lib/utils";
import habitsService from "@/service/habits";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, Plus, X } from "lucide-react";
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
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMobileMediaQuery } from "@/hooks/responsive";

const tabs = [
  {
    value: "all",
    label: "All",
  },
  {
    value: "day",
    label: "Daily",
  },
  {
    value: "weekly",
    label: "Weekly",
  },
  {
    value: "monthly",
    label: "Monthly",
  },
];

export default function Habits() {
  const router = useRouter();
  const isNavHide = useToggleHideNav();
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const isMobile = useMobileMediaQuery();

  const pickedDay = moment().format("dddd");
  const pickedDate = moment().format("DD MMM YYYY");

  const [activeTab, setActiveTab] = React.useState(tabs[0].value);
  const [search, setSearch] = React.useState<{ query: string; open: boolean }>({
    query: "",
    open: false,
  });
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  const habitsToday = useQuery(
    [habitsService.getUrgentHabit.name, "habitstoday", pickedDate],
    async () => {
      return (await habitsService.getUrgentHabit(5)).data.data;
    }
  );

  const allHabit = useQuery([habitsService.getHabits.name, "all"], async () => {
    return (await habitsService.getHabits("all")).data.data;
  });

  const onTabChange = (key: string) => {
    setActiveTab(key);
  };

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
  };

  const onClickAdd = () => {
    router.push("/write?type=habits");
  };

  const onGoingHabits = habitsToday.data?.length
    ? habitsToday.data[0]?.id
    : undefined;

  return (
    <div className="w-full bg-white min-h-screen pb-20">
      <motion.div
        style={{ pointerEvents: isNavHide ? "none" : "auto" }}
        animate={{ y: isNavHide ? "-100%" : 0 }}
        transition={{ ease: easeDefault }}
        className="sticky overflow-y-hidden top-0 left-0 py-1 bg-white z-50"
      >
        <div className="container-custom flex flex-row items-center justify-between gap-4">
          <AnimatePresence mode="popLayout">
            {search.open ? (
              <motion.div
                key="search"
                exit={{ y: "-100%", scale: 0.6 }}
                animate={{ y: 0, scale: 1 }}
                initial={{ y: "-100%" }}
                transition={{ ease: easeDefault }}
              >
                <form onSubmit={onSubmitSearch}>
                  <SearchBar
                    value={search.query}
                    onChange={onChangeSearch}
                    ref={searchInputRef}
                    placeholder="Search Habit"
                  />
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="date"
                exit={{ y: "100%", scale: 0.6 }}
                animate={{ y: 0, scale: 1 }}
                initial={{ y: "100%" }}
                transition={{ ease: easeDefault }}
                className="flex gap-2 items-center"
              >
                <Button
                  onClick={() => router.back()}
                  size="icon"
                  variant="ghost"
                  className="!w-10 flex-1"
                >
                  <ChevronLeft />
                </Button>
                <p className="m-0 font-semibold">
                  {pickedDay},{" "}
                  <span className="text-xs font-normal">{pickedDate}</span> 👋
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="w-fit flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={onClickSearch}
                  size="icon"
                  variant="ghost"
                  className="!w-10 flex-1"
                >
                  {search.open ? <X size={20} /> : <CiSearch size={20} />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {search.open ? "Close Search" : "Search Note"}
              </TooltipContent>
            </Tooltip>
            <Button onClick={onClickAdd} size="sm" variant="ghost" className="">
              <Plus size={16} className="mr-2" /> Habit
            </Button>
          </div>
        </div>
      </motion.div>
      {search.open && search.query ? (
        <div className="container-custom mt-10">
          <SearchHabits
            query={search.query}
            habits={allHabit.data}
            onGoingHabits={onGoingHabits}
          />
        </div>
      ) : (
        <>
          <StateRender data={allHabit.data} isLoading={allHabit.isLoading}>
            <StateRender.Data>
              {allHabit.data?.length ? (
                <div
                  className={`container-custom grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-3 ${
                    habitsToday.data?.length ? "my-3" : ""
                  }`}
                >
                  <div className="">
                    <HabitsUrgent
                      inPageHabits
                      onChangeHabit={habitsToday.refetch}
                    />
                    <div className="my-5">
                      <RunningTimer />
                    </div>
                  </div>
                  <div className="">
                    {habitsToday.data?.length ? (
                      <p className="text-2xl">Should Do! 💪</p>
                    ) : null}
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3 mt-2">
                      {habitsToday.data?.map((habit, i) => (
                        <ListCardHabit key={habit.id} index={i} habit={habit} />
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </StateRender.Data>
          </StateRender>

          <div className="container-custom">
            {!isMobile ? (
              <Select value={activeTab} onValueChange={onTabChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  {tabs.map((tab) => (
                    <SelectItem key={tab.label} value={tab.value}>
                      {tab.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Tabs
                defaultValue={activeTab}
                className="sticky top-0 left-0 z-20"
                onValueChange={onTabChange}
              >
                <TabsList className="!w-full">
                  {tabs?.map((tab) => (
                    <TabsTrigger
                      className="!flex-1"
                      key={tab.value}
                      value={tab.value}
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            )}

            <div className="flex flex-col mt-2 min-h-[50vh] pb-20">
              {activeTab === "all" && (
                <AllHabits onGoingHabits={onGoingHabits} />
              )}
              {activeTab === "day" && (
                <DailyHabits onGoingHabits={onGoingHabits} />
              )}
              {activeTab === "weekly" && (
                <WeeklyHabits onGoingHabits={onGoingHabits} />
              )}
              {activeTab === "monthly" && (
                <MonthlyHabits onGoingHabits={onGoingHabits} />
              )}
            </div>
          </div>
        </>
      )}
      <BottomBar />
    </div>
  );
}
