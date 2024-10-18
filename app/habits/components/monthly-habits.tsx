"use client";

import StateRender from "@/components/state-render";
import habitsService from "@/service/habits";
import { useQuery } from "@tanstack/react-query";
import GridCardHabit from "./grid-card-habit";
import ButtonToWrite from "./button-make-habit";
import LayoutGrid from "@/components/layout-grid";

export type MonthlyHabitsProps = {
  onGoingHabits?: string;
};

export default function MonthlyHabits({ onGoingHabits }: MonthlyHabitsProps) {
  const habits = useQuery(
    [habitsService.getHabits.name, "monthly"],
    async () => {
      return (await habitsService.getHabits("monthly")).data.data;
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
        <p>Getting Monthly Habits...</p>
      </StateRender.Loading>
    </StateRender>
  );
}
