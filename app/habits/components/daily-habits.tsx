"use client";

import StateRender from "@/components/state-render";
import habitsService from "@/service/habits";
import { useQuery } from "@tanstack/react-query";
import GridCardHabit from "./grid-card-habit";
import ButtonToWrite from "./button-make-habit";
import LayoutGrid from "@/components/layout-grid";

export type DailyHabitsProps = {
  onGoingHabits?: string;
};

export default function DailyHabits({ onGoingHabits }: DailyHabitsProps) {
  const habits = useQuery([habitsService.getHabits.name, "day"], async () => {
    return (await habitsService.getHabits("day")).data.data;
  });

  return (
    <StateRender
      data={habits.data}
      isLoading={habits.isLoading}
      isError={habits.isError}
    >
      <StateRender.Data>
        {habits.data?.length ? (
          <LayoutGrid items={habits.data}>
            {(item, i) => (
              <GridCardHabit
                onGoingHabits={onGoingHabits}
                key={item.id}
                habits={item}
              />
            )}
          </LayoutGrid>
        ) : (
          <ButtonToWrite href="/write?type=habits" />
        )}
      </StateRender.Data>
      <StateRender.Loading>
        <p>Getting Daily Habits...</p>
      </StateRender.Loading>
    </StateRender>
  );
}
