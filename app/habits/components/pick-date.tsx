"use client";

import { Calendar } from "@/components/ui/calendar";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import moment from "moment";
import React from "react";


export type PickDateProps = {
    pickedDate: moment.Moment | null;
    onSelectDate: (date: any) => void;
    children: (ctrl: { open: () => void }) => React.ReactNode;
}

export default function PickDate({ children, pickedDate, onSelectDate }: PickDateProps) {
    const [isOpen, setIsOpen] = React.useState(false);

    const onOpenChange = (val: boolean) => {
        setIsOpen(val);
    }

    const ctrl = {
        open: () => {
            if (history) setIsOpen(true);
        },
    }

    const onSelect = (date: any) => {
        onSelectDate(date);
        setIsOpen(false);
    }

    return (
        <>
            <Drawer open={isOpen} onOpenChange={onOpenChange}>
                <DrawerContent className="z-50">
                    <DrawerHeader>
                        <DrawerTitle className="capitalize">
                            {pickedDate instanceof moment ? moment(pickedDate).format("dddd, DD MMM YYYY") : "All"}
                        </DrawerTitle>
                    </DrawerHeader>
                    <div className="container-custom flex flex-col gap-4">
                        <Calendar onSelect={onSelect} selected={pickedDate instanceof moment ? new Date(moment(pickedDate).toISOString()) : undefined} mode="single" className="rounded-md calendar-history-habit" />
                    </div>
                </DrawerContent>
            </Drawer>
            {children(ctrl)}
        </>
    );
}