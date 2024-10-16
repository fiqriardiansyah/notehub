import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import React from "react";

export interface CheckboxCustomProps {
    disabled?: boolean;
    label?: any;
    checked?: boolean;
    onChecked?: (val: boolean) => void;
    buttonProps?: React.HTMLProps<HTMLButtonElement>;
    size?: "sm" | "md"
}

const CheckboxCustom = (props: CheckboxCustomProps) => {
    const size = props?.size || "sm"

    const onClick = () => {
        if (props?.disabled) return;
        if (props?.onChecked) {
            props?.onChecked(!props?.checked);
        }
    }

    const asCheckbox = (
        <button {...props?.buttonProps} disabled={props?.disabled} onClick={onClick} type="button" className={cn(
            props?.buttonProps?.className,
            'flex items-center justify-center bg-white border-2 border-solid rounded-lg',
            props?.checked ? "border-primary bg-primary" : "border-primary",
            size === "sm" ? "!w-5 !h-5" : "",
            size === "md" ? "!w-7 !h-7" : "",
            props?.disabled ? "opacity-50" : ""
        )}>
            <Check size={size === "sm" ? 14 : 16} className={cn(props?.checked ? "text-white" : "text-gray-200")} />
        </button>
    )

    if (!props?.label) return asCheckbox;
    return (
        <div onClick={onClick} className="flex items-start gap-3 cursor-pointer">
            {asCheckbox}
            <div className="flex-1">{props?.label}</div>
        </div>
    )
}

export default CheckboxCustom;