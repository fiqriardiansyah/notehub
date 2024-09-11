"use client";

import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { REGEXP_ONLY_DIGITS } from "input-otp";
import React from "react";

export type TimerProps = {
    children?: (value: { hour: number; minute: number; second: number; }) => any;
    onChange?: (value: { hour: number; minute: number; second: number; }) => any;
}

export default function Timer({ children, onChange }: TimerProps) {
    const [value, setValue] = React.useState("000000");

    const parse = (val: string) => {
        const hour = parseInt(val.slice(0, 1));
        const minute = parseInt(val.slice(2, 3));
        const second = parseInt(val.slice(4, 5));

        return { hour, minute, second }
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