import NotespacehubIcon from "@/asset/svg/notespacehub-icon.svg";
import { Bell, Blocks, PanelsTopLeft, Plus, Trophy, Workflow } from "lucide-react";
import Image from "next/image";
import React from "react";

export type NavigationItem = {
  icon?: any;
  element?: any;
  variant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost";
  text: string;
  href: string;
  component?: React.ReactElement;
  isActive: (path: string) => boolean;
};

export const navigation: { [key: string]: NavigationItem } = {
  home: {
    icon: Workflow,
    text: "My Space",
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
    isActive: (path) => path.includes("/notification"),
  },
  insight: {
    element: <Image fill src={NotespacehubIcon} alt="notespacehub" />,
    text: "Insight Hub",
    variant: "link",
    href: "/insight",
    isActive: (path) => path.includes("/insight"),
  },
};
