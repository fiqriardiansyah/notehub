"use client";

import SearchBar from "@/app/components/search-bar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { shortCut } from "@/lib/shortcut";
import { Session } from "@/models";
import { LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import { easeDefault } from "@/lib/utils";
import useToggleHideNav from "@/hooks/use-toggle-hide-nav";

export default function TopBar() {
  const { data } = useSession();
  const session = data as Session;
  const isNavHide = useToggleHideNav();

  shortCut.logout(() => {
    signOut();
  });

  const onClickLogout = () => {
    signOut();
  };

  return (
    <>
      <motion.header animate={{ y: isNavHide ? "-100%" : 0 }} transition={{ ease: easeDefault }} className="fixed top-0 left-0 right-0 w-screen container-custom z-50 bg-background-primary">
        <nav className="w-full flex items-center justify-between py-1">
          <div className="flex items-center gap-2">
            <Link href="/" className="hidden md:block">
              <h1 className="text-gray-700 font-semibold text-xl">NoteHub</h1>
            </Link>
            <div className="block md:hidden">
              <SearchBar />
            </div>
          </div>
          {session?.sessionToken && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage
                    src={session?.user?.image}
                    alt={session?.user?.name}
                    referrerPolicy="no-referrer"
                  />
                  <AvatarFallback>{session?.user?.name}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>{session?.user?.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={onClickLogout}
                  className="cursor-pointer"
                  variant="danger"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                  <DropdownMenuShortcut>
                    {shortCut.logoutKey}
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </nav>
      </motion.header>
      <div className="h-[50px]" />
    </>
  );
}
