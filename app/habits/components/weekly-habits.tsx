"use client";

import StateRender from "@/components/state-render";
import habitsService from "@/service/habits";
import { useQuery } from "@tanstack/react-query";
import GridCardHabit from "./grid-card-habit";
import ButtonToWrite from "./button-make-habit";
import LayoutGrid from "@/components/layout-grid";

export type WeeklyHabitsProps = {
  onGoingHabits?: string;
};

export default function WeeklyHabits({ onGoingHabits }: WeeklyHabitsProps) {
  const habits = useQuery(
    [habitsService.getHabits.name, "weekly"],
    async () => {
      return (await habitsService.getHabits("weekly")).data.data;
    }
  );

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
        <p>Getting Weekly Habits...</p>
      </StateRender.Loading>
    </StateRender>
  );
}
