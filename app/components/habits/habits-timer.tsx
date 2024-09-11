"use client";

import { Todo } from "@/app/write/mode/todolist";
import Timer from "@/components/common/timer";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { Info, Play } from "lucide-react";
import React from "react";

export type HabitsTimerProps = {
    todo?: Todo;
    children: (ctrl: { open: () => void }) => React.ReactNode;
}

export default function HabitsTimer({ children, todo }: HabitsTimerProps) {
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
                            {todo?.content}
                        </DrawerTitle>
                    </DrawerHeader>
                    <div className="container-custom flex flex-col gap-4">
                        <p className="flex items-center text-sm"><Info className="mr-2" />Set timer for this task</p>
                        <div className="h-[250px] flex items-center justify-center">
                            <Timer />
                        </div>
                        <div className="flex items-center justify-between w-full my-10">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="terms" />
                                <Label htmlFor="terms">Auto complete task when time end</Label>
                            </div>
                            <Button size="icon">
                                <Play />
                            </Button>
                        </div>
                    </div>
                </DrawerContent>
            </Drawer>
            {children(ctrl)}
        </>
    );
}