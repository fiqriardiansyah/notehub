"use client";

import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { REGEXP_ONLY_DIGITS } from "input-otp";
import React from "react";

export type Time = { hours: number; minutes: number; seconds: number; };

export type TimerProps = {
    children?: (value: Time) => any;
    onChange?: (value: Time) => any;
}

export default function Timer({ children, onChange }: TimerProps) {
    const [value, setValue] = React.useState("000000");

    const parse = (val: string) => {
        const split = val.split("")

        const hour = parseInt(split[0] + split[1])
        const minute = parseInt(split[2] + split[3]);
        const second = parseInt(split[4] + split[5]);

        return {
            hours: Number.isNaN(hour) ? 0 : hour,
            minutes: Number.isNaN(minute) ? 0 : minute,
            seconds: Number.isNaN(second) ? 0 : second,
        }
    }

    React.useEffect(() => {
        if (onChange) {
            onChange(parse(value));
        }
    }, [value]);

    return <>
        <InputOTP containerClassName="justify-center" maxLength={6} pattern={REGEXP_ONLY_DIGITS} value={value} onChange={(value) => setValue(value)}>
            <div className="flex flex-col gap-2">
                <p className="w-full text-center">Hour</p>
                <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                </InputOTPGroup>
            </div>
            <InputOTPSeparator>
                <div className="h-16 mx-2 w-[1px] bg-gray-400"></div>
            </InputOTPSeparator>
            <div className="flex flex-col gap-2">
                <p className="w-full text-center">Minute</p>
                <InputOTPGroup>
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                </InputOTPGroup>
            </div>
            <InputOTPSeparator>
                <div className="h-16 mx-2 w-[1px] bg-gray-400"></div>
            </InputOTPSeparator>
            <div className="flex flex-col gap-2">
                <p className="w-full text-center">Second</p>
                <InputOTPGroup>
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                </InputOTPGroup>
            </div>
        </InputOTP>
        {children && children(parse(value))}
    </>
}