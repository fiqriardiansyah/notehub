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

export default function HistoryCalendar({ histories, currentHabit }: HistoryCalendarProps) {
    const isOnGoingHabitToday = (date: string) => {
        const today = moment(moment.now()).format(FORMAT_DATE_CALENDAR);
        const isAlreadyFinish = histories?.find((h) => moment(h.completedTime).format(FORMAT_DATE_CALENDAR) === today);
        if (isAlreadyFinish) return false
        return currentHabit?.schedulerType === "day" && today === date;
    }

    const isOnGoingHabitWeek = (weekNumber: number) => {
        const currentWeek = moment().week()
        const isAlreadyFinish = histories?.find((h) => moment(h.completedTime).week() === currentWeek);
        if (isAlreadyFinish) return false;
        return currentWeek === weekNumber;
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
                        const dateHistory = histories?.map((dt) => moment(dt.completedTime).format(FORMAT_DATE_CALENDAR));

                        if (dateHistory?.includes(date) || moment(moment.now()).format(FORMAT_DATE_CALENDAR) === date) {
                            const isOnGoing = isOnGoingHabitToday(date);

                            const history = histories?.find((h) => moment(h.completedTime).format(FORMAT_DATE_CALENDAR) === date);
                            const taskDone = history?.todos?.filter((td) => td.isCheck).length;
                            const progress = isOnGoing ? currentProgress : Math.round(taskDone! / (history?.todos.length || 1) * 100);

                            return (
                                <div key={date} className="w-[40px] h-[40px] rounded-full relative">
                                    {isOnGoing && <div className="absolute top-[-40px] left-1/2 transform -translate-x-1/2 z-10">
                                        <Lottie style={{ pointerEvents: 'none' }} options={defaultOptions} height={40} width={40} />
                                    </div>}
                                    <CircularProgressbar value={progress} text={`${progress}%`} styles={buildStyles({
                                        trailColor: isOnGoing ? 'rgba(251, 146, 60, 0.3)' : `rgba(89, 89, 89, 0.2)`,
                                        pathColor: isOnGoing ? 'rgba(251, 146, 60, 1)' : progress === 100 ? 'rgba(82, 255, 102)' : 'rgba(0, 0, 0, 0.3)'
                                    })} />
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

                    const history = histories?.find((h) => moment(h.completedTime).week() === week.weekNumber);
                    const taskDone = history?.todos?.filter((td) => td.isCheck).length;
                    const progress = isOnGoing ? currentProgress : Math.round(taskDone! / (history?.todos.length || 1) * 100);

                    const color = () => {
                        if (isOnGoing) return themeColor.orange[400];
                        return progress === 100 ? themeColor.green[400] : themeColor.gray[400]
                    }

                    return <tr {...props} className={`${className} relative`}>
                        {isOnGoing && <div className="absolute top-1/2 transform -translate-y-1/2 left-0 z-10">
                            <Lottie style={{ pointerEvents: 'none' }} options={defaultOptions} height={40} width={40} />
                        </div>}
                        {(history || isOnGoing) && (
                            <td style={{ borderColor: color() }}
                                className="w-full h-full border-2 border-solid absolute bg-opacity-25 top-0 left-0 z-[1] rounded-full flex justify-start">
                                <div style={{ width: progress + "%", background: hexToRgba(color(), 0.2), height: '100%' }}
                                    className={`duration-200 relative transition rounded-tl-full rounded-bl-full ${progress === 100 ? "rounded-full" : ""}`}>
                                    <p className='absolute bottom-0 text-[10px] right-0'>{progress}%</p>
                                </div>
                            </td>
                        )}
                        {children}
                    </tr>
                },
            }} />
        )
    }

    return <h1>Calender</h1>
}