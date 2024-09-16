"use client";

import { convertEditorDataToText } from "@/lib/utils";
import { Note } from "@/models/note";
import GridCardHabit from "./grid-card-habit";
import personSeatAnim from "@/asset/animation/person-seat.json";
import Lottie from "react-lottie";

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: personSeatAnim,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

type SearchHabitsProps = {
    habits?: Note[];
    onGoingHabits?: string;
    query?: string;
}
export default function SearchHabits({ habits, onGoingHabits, query }: SearchHabitsProps) {
    const filter = habits?.map((habit) => {
        if (
            query &&
            habit.title.toLocaleLowerCase().includes(query!.toLocaleLowerCase()) ||
            convertEditorDataToText(habit.description!).toLocaleLowerCase().includes(query!.toLocaleLowerCase()) ||
            JSON.stringify(habit.todos).toLocaleLowerCase().includes(query!.toLocaleLowerCase())
        ) {
            return <GridCardHabit onGoingHabits={onGoingHabits} key={habit.id} habits={habit} />
        }
        return null;
    }).filter(Boolean);

    if (filter?.length === 0 && query) {
        return (
            <div className="w-full h-[40vh] flex items-center justify-center flex-col">
                <Lottie style={{ pointerEvents: 'none' }} options={defaultOptions} width={250} height={250} />
                <p className="text-xs text-center">Hmmm, there is nothing with {`"${query}"`}</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {filter}
        </div>
    )
}