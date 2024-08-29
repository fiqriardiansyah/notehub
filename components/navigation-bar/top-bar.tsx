"use client";

import { LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SearchBar from "@/app/components/search-bar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { shortCut } from "@/lib/shortcut";
import { Session } from "@/models";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next-nprogress-bar";
import Link from "next/link";

export default function TopBar() {
  const { data } = useSession();
  const router = useRouter();
  const session = data as Session;

  shortCut.logout(() => {
    signOut();
  });

  const onClickLogout = () => {
    signOut();
  };

  const onClickBack = () => {
    router.back();
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 w-screen container-custom z-50 bg-background-primary">
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
      </header>
      <div className="h-[50px]" />
    </>
  );
}
