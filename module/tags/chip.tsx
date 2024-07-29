"use client"

import { Button, ButtonProps } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Tag } from "@/models/note"
import { icons, X } from "lucide-react"
import React from "react"

export interface ChipType extends ButtonProps {
    tag: Tag;
    pick?: boolean;
    deleteable?: boolean;
    onClickDelete?: (tag: Tag) => void;
}

const WithBorderAnim = ({ children, withBorder }: { children: any, withBorder?: boolean; }) => {
    const RemoveBorder = () => React.Children.map(children, (child) => (
        React.cloneElement(child, {
            className: `${child.props.className} border-none`
        })
    ));

    if (!withBorder) return children;
    return <div className="animate-background inline-block rounded-full from-pink-500 via-red-500 to-yellow-500 bg-[length:_400%_400%] p-0.5 [animation-duration:_2s] bg-gradient-to-r">
        <RemoveBorder />
    </div>
}

export default function Chip({ tag, pick, deleteable, onClickDelete, ...props }: ChipType) {
    const Icon = icons[tag.icon as keyof typeof icons] || icons["X"]

    return (
        <Tooltip delayDuration={0.1}>
            <TooltipTrigger asChild>
                <div className="flex items-center gap-1">
                    <WithBorderAnim withBorder={tag.isNew}>
                        <Button {...props} variant={pick ? "default" : "outline"} size="chip" className="flex items-center gap-1">
                            <Icon size={15} />
                            {tag.text}
                        </Button>
                    </WithBorderAnim>
                    {deleteable && <button onClick={() => onClickDelete && onClickDelete(tag)} className="text-gray-500 cursor-pointer"><X size={16} /></button>}
                </div>
            </TooltipTrigger>
            <TooltipContent>{tag.text}</TooltipContent>
        </Tooltip>
    )
}