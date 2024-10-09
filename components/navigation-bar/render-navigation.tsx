"use client";

import { usePathname } from "next/navigation";
import { NavigationItem } from "./utils";
import themeColor from "tailwindcss/colors";
import Link from "next/link";
import { Button } from "../ui/button";
import { useRouter } from "next-nprogress-bar";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export type RenderNavigationProps = {
    item: NavigationItem;
    children?: (item: NavigationItem & { pathname: string, isCollapsed?: boolean }) => any;
    mode?: "mobile" | "desktop",
    isCollapsed?: boolean;
    postfixComponent?: (item: NavigationItem & { pathname: string, isCollapsed?: boolean }) => any;
}

export default function RenderNavigation({ item, children, mode = "mobile", isCollapsed, postfixComponent }: RenderNavigationProps) {
    const pathname = usePathname();
    const router = useRouter();

    const Icon = item.icon;

    const returnItem = { ...item, pathname, isCollapsed };

    if (children) {
        return children(returnItem);
    }

    if (mode === "mobile") {
        return (
            <Link style={{ color: item?.isActive(pathname) ? themeColor.gray[700] : themeColor.gray[400] }} href={item.href}>
                <Icon />
            </Link>
        )
    }

    if (isCollapsed) {
        return (
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button onClick={() => router.push(item.href)} variant={item?.isActive(pathname) ? "default" : "ghost"} size="sm" className="!w-10 !h-10 !flex !items-center relative !justify-center">
                        <Icon size={18} />
                        {postfixComponent && postfixComponent(returnItem)}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    {item.text}
                </TooltipContent>
            </Tooltip>
        )
    }

    return (
        <Button onClick={() => router.push(item.href)} variant={item?.isActive(pathname) ? "default" : "ghost"} size="sm" className="!flex !items-center relative !justify-between gap-2 line-clamp-1 capitalize">
            <div className="flex gap-2 items-center">
                <Icon size={16} />
                {item.text}
            </div>
            {postfixComponent && postfixComponent(returnItem)}
        </Button>
    )
}