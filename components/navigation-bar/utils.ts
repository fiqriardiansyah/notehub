import { Bell, Blocks, House, PanelsTopLeft, Plus, Trophy } from "lucide-react";
import React from "react";

export type NavigationItem = {
    icon: any,
    text: string,
    href: string,
    component?: React.ReactElement,
    isActive: (path: string) => boolean,
}

export const navigation: { [key: string]: NavigationItem } = {
    home: {
        icon: House,
        text: "Home",
        href: "/",
        isActive: (path) => path === "/",
    },
    collaborate: {
        icon: Blocks,
        text: "Collaborate",
        href: "/collaborate",
        isActive: (path) => path.includes("/collaborate"),
    },
    write: {
        icon: Plus,
        text: "Write",
        href: "/write",
        isActive: (path) => path.includes("/write"),
    },
    habits: {
        icon: Trophy,
        text: "Habits",
        href: "/habits",
        isActive: (path) => path.includes("/habits"),
    },
    xixi: {
        icon: PanelsTopLeft,
        text: "Xixi",
        href: "#",
        isActive: (path) => path.includes("/xixi"),
    },
    notification: {
        icon: Bell,
        text: "Notification",
        href: "/notification",
        isActive: (path) => path.includes("/notification")
    }
}