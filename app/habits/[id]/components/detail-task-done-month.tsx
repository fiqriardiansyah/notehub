"use client";

import { Todo } from "@/app/write/mode/todolist";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import moment from "moment";
import React from "react";
import ListCardHabit from "./list-card-habit";

export type DetailTaskDoneMonthProps = {
    date?: Date | string;
    todos?: Todo[];
    children: (ctrl: { open: () => void }) => React.ReactNode;
}

export default function DetailTaskDoneMonth({ children, todos, date }: DetailTaskDoneMonthProps) {
    const [isOpen, setIsOpen] = React.useState(false);

    const onOpenChange = (val: boolean) => {
        setIsOpen(val);
    }

    const ctrl = {
        open: () => {
            if (history) setIsOpen(true);
        },
    }

    return (
        <>
            <Drawer open={isOpen} onOpenChange={onOpenChange}>
                <DrawerContent className="z-50">
                    <DrawerHeader>
                        <DrawerTitle className="capitalize">
                            {moment(date).format("dddd, DD MMMM YYYY")}
                        </DrawerTitle>
                    </DrawerHeader>
                    <div className="container-custom flex flex-col gap-4">
                        <div className="w-full mb-20 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
                            {todos?.map((todo) => <ListCardHabit completedHabit={true} key={todo.id} todo={todo} />)}
                        </div>
                    </div>
                </DrawerContent>
            </Drawer>
            {children(ctrl)}
        </>
    );
}