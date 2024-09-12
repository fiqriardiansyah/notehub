"use client";

import fireAnim from '@/asset/animation/fire.json';
import { Calendar } from "@/components/ui/calendar";
import { hexToRgba } from '@/lib/utils';
import { HabitHistory } from "@/models/habits";
import { DetailNote } from "@/models/note";
import moment from "moment";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import Lottie from "react-lottie";
import themeColor from "tailwindcss/colors";
import HistoryDetailDrawer from './history-detail-drawer';
import React from 'react';
import { Todo } from '@/app/write/mode/todolist';
import DetailTaskDoneMonth from './detail-task-done-month';

const defaultOptions = {
    loop: true,
    animationData: fireAnim,
    autoplay: true,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

export type HistoryCalendarProps = {
    histories?: HabitHistory[];
    currentHabit?: DetailNote;
}

export const FORMAT_DATE_CALENDAR = "DD-MM-YYYY"

export default function HistoryCalendar({ histories = [], currentHabit }: HistoryCalendarProps) {
    const isOnGoingHabitToday = (date: string) => {
        const today = moment(moment.now()).format(FORMAT_DATE_CALENDAR);
        const isAlreadyFinish = histories?.find((h) => moment.utc(h.completedTime).format(FORMAT_DATE_CALENDAR) === today);
        if (isAlreadyFinish) return false;
        return currentHabit?.schedulerType === "day" && today === date;
    }

    const isOnGoingHabitWeek = (weekNumber: number) => {
        const currentWeek = moment().week()
        const isAlreadyFinish = histories?.find((h) => moment.utc(h.completedTime).week() === currentWeek);
        if (isAlreadyFinish) return false;
        return currentWeek === weekNumber;
    }

    const isOnGoingHabitMonthly = (date: Date) => {
        const currentMonth = moment().month();
        const isAlreadyFinish = histories?.find((h) => moment.utc(h.completedTime).month() === currentMonth);
        if (isAlreadyFinish) return false;
        return currentMonth === moment(date).month();
    }

    const currentTaskDone = currentHabit?.todos?.filter((td) => td.isCheck).length;
    const currentProgress = Math.round(currentTaskDone! / (currentHabit?.todos?.length || 1) * 100);

    if (currentHabit?.schedulerType === "day") {
        return (
            <Calendar
                mode="multiple"
                className="rounded-md calendar-history-habit"
                components={{
                    DayButton: ({ day, modifiers, ...props }) => {
                        const date = moment(day.date).format(FORMAT_DATE_CALENDAR);
                        const isOnGoing = isOnGoingHabitToday(date);
                        const dateHistory = histories?.map((dt) => moment.utc(dt.completedTime).format(FORMAT_DATE_CALENDAR));

                        const pastOrToday = dateHistory?.includes(date) || moment(moment.now()).format(FORMAT_DATE_CALENDAR) === date;

                        const isFree = !currentHabit?.schedulerDays?.find((d) => d === moment(day.date).format("dddd").toLocaleLowerCase())

                        if (pastOrToday && !isFree) {
                            const history = histories?.find((h) => moment.utc(h.completedTime).format(FORMAT_DATE_CALENDAR) === date);
                            const taskDone = history?.todos?.filter((td) => td.isCheck).length;
                            const progress = isOnGoing ? currentProgress : Math.round(taskDone! / (history?.todos.length || 1) * 100);

                            return (
                                <div key={date} className="w-[40px] h-[40px] rounded-full relative">
                                    {isOnGoing && <div className="absolute top-[-40px] left-1/2 transform -translate-x-1/2 z-10">
                                        <Lottie style={{ pointerEvents: 'none' }} options={defaultOptions} height={40} width={40} />
                                    </div>}
                                    <HistoryDetailDrawer history={history} schedulerType="day">
                                        {(ctrl) => (
                                            <button onClick={isOnGoing ? undefined : ctrl.open} className='w-full h-full border-none bg-transparent'>
                                                <CircularProgressbar value={progress} text={moment(day.date).format("D")} styles={buildStyles({
                                                    textSize: '30px',
                                                    textColor: hexToRgba("#000000", 0.5),
                                                    trailColor: isOnGoing ? hexToRgba(themeColor.orange[400], 0.3) : hexToRgba(themeColor.gray[400], 0.3),
                                                    pathColor: isOnGoing ? themeColor.orange[400] : progress === 100 ? themeColor.green[400] : themeColor.gray[400]
                                                })} />
                                            </button>
                                        )}
                                    </HistoryDetailDrawer>
                                </div>
                            )
                        }
                        return <button {...props} disabled />
                    }
                }}
            />
        )
    }

    if (currentHabit?.schedulerType === "weekly") {
        return (
            <Calendar className="rounded-md calendar-history-habit" mode="multiple" components={{
                DayButton({ day, modifiers, ...props }) {
                    return <button className="h-10 w-10 z-[2] pointer-events-none">
                        {moment(day.date).format("D")}
                    </button>
                },
                Week: ({ week, className, children, ...props }) => {
                    const isOnGoing = isOnGoingHabitWeek(week.weekNumber);

                    const history = histories?.find((h) => moment.utc(h.completedTime).week() === week.weekNumber);
                    const taskDone = history?.todos?.filter((td) => td.isCheck).length;
                    const progress = isOnGoing ? currentProgress : Math.round(taskDone! / (history?.todos.length || 1) * 100);

                    const color = () => {
                        if (isOnGoing) return themeColor.orange[400];
                        return progress === 100 ? themeColor.green[400] : themeColor.gray[400]
                    }

                    return <tr {...props} className={`${className} relative`}>
                        {isOnGoing && <tr className="absolute top-1/2 transform -translate-y-1/2 left-0 z-10">
                            <Lottie style={{ pointerEvents: 'none' }} options={defaultOptions} height={40} width={40} />
                        </tr>}
                        {(history || isOnGoing) && (
                            <HistoryDetailDrawer history={history} schedulerType="weekly">
                                {(ctrl) => (
                                    <td onClick={isOnGoing ? undefined : ctrl.open}
                                        style={{ borderColor: color() }}
                                        className="w-full h-full border-2 cursor-pointer border-solid absolute bg-opacity-25 top-0 left-0 z-[1] rounded-full flex justify-start">
                                        <div style={{ width: progress + "%", background: hexToRgba(color(), 0.2), height: '100%' }}
                                            className={`duration-200 hover:opacity-70 relative transition rounded-tl-full rounded-bl-full ${progress === 100 ? "rounded-full" : ""}`}>
                                        </div>
                                    </td>
                                )}
                            </HistoryDetailDrawer>
                        )}
                        {children}
                    </tr>
                },
            }} />
        )
    }

    return (
        <Calendar className="rounded-md calendar-history-habit" mode="multiple"
            showOutsideDays={false}
            components={{
                MonthCaption({ calendarMonth, displayIndex, className, ...props }) {
                    const isOnGoing = isOnGoingHabitMonthly(calendarMonth.date);

                    const history = histories?.find((h) => moment.utc(h.completedTime).month() === moment(calendarMonth.date).month());
                    const taskDone = history?.todos?.filter((td) => td.isCheck).length;
                    const progress = isOnGoing ? currentProgress : Math.round(taskDone! / (history?.todos?.length || 1) * 100);

                    return <div {...props} className={`${className} flex items-center gap-3`}>
                        {(isOnGoing || history) && (
                            <div className="w-7 h-7">
                                <CircularProgressbar value={progress} text={`${progress}%`} styles={buildStyles({
                                    textSize: '24px',
                                    textColor: hexToRgba("#000000", 0.5),
                                    trailColor: isOnGoing ? hexToRgba(themeColor.orange[400], 0.3) : hexToRgba(themeColor.gray[400], 0.3),
                                    pathColor: isOnGoing ? themeColor.orange[400] : progress === 100 ? themeColor.green[400] : themeColor.gray[400]
                                })} />
                            </div>
                        )}
                        {moment(calendarMonth.date).format("MMMM YYYY")}
                    </div>
                },
                DayButton({ day, modifiers, ...props }) {
                    const date = moment(day.date).format(FORMAT_DATE_CALENDAR);
                    const dayMarksTodos: Todo[] = [];

                    [...histories, currentHabit]?.forEach((history) => {
                        history?.todos?.forEach((todo) => {
                            if (moment(todo.checkedAt).format(FORMAT_DATE_CALENDAR) === date) {
                                dayMarksTodos.push(todo);
                            }
                        })
                    });

                    if (dayMarksTodos.length) {
                        return <DetailTaskDoneMonth todos={dayMarksTodos} date={day.date}>
                            {(ctrl) => (
                                <button onClick={ctrl.open} className="h-10 w-10 z-[2] rounded-full border-2 relative border-solid border-gray-400">
                                    <span className='absolute -top-[20px] origin-left -rotate-[30deg] text-[10px] z-10 font-semibold whitespace-nowrap'>
                                        {dayMarksTodos.length} task done
                                    </span>
                                    {moment(day.date).format("D")}
                                </button>
                            )}
                        </DetailTaskDoneMonth>
                    }

                    return <button className="h-10 w-10 z-[2] pointer-events-none text-gray-300">
                        {moment(day.date).format("D")}
                    </button>
                },
            }} />
    )
}