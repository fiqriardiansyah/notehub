"use client";

import StateRender from "@/components/state-render";
import habitsService from "@/service/habits";
import { useQuery } from "@tanstack/react-query";
import GridCardHabit from "./grid-card-habit";

export type AllHabitsProps = {
    onGoingHabits?: string
}

export default function AllHabits({ onGoingHabits }: AllHabitsProps) {
    const habits = useQuery([habitsService.getHabits.name, "all"], async () => {
        return (await habitsService.getHabits("all")).data.data
    })

    return (
        <StateRender data={habits.data} isLoading={habits.isLoading} isError={habits.isError}>
            <StateRender.Data>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                    {habits.data?.map((habit) => <GridCardHabit onGoingHabits={onGoingHabits} key={habit.id} habits={habit} />)}
                </div>
            </StateRender.Data>
            <StateRender.Loading>
                <p>Getting All Habits...</p>
            </StateRender.Loading>
        </StateRender>
    )
}