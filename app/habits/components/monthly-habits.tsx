"use client";

import StateRender from "@/components/state-render";
import habitsService from "@/service/habits";
import { useQuery } from "@tanstack/react-query";
import GridCardHabit from "./grid-card-habit";
import ButtonToWrite from "./button-make-habit";

export type MonthlyHabitsProps = {
    onGoingHabits?: string
}

export default function MonthlyHabits({ onGoingHabits }: MonthlyHabitsProps) {
    const habits = useQuery([habitsService.getHabits.name, "monthly"], async () => {
        return (await habitsService.getHabits("monthly")).data.data
    });

    return (
        <StateRender data={habits.data} isLoading={habits.isLoading} isError={habits.isError}>
            <StateRender.Data>
                {habits.data?.length ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                        {habits.data?.map((habit) => <GridCardHabit onGoingHabits={onGoingHabits} key={habit.id} habits={habit} />)}
                    </div>
                ) : (
                    <ButtonToWrite href="/write?type=habits" />
                )}
            </StateRender.Data>
            <StateRender.Loading>
                <p>Getting Monthly Habits...</p>
            </StateRender.Loading>
        </StateRender>
    )
}