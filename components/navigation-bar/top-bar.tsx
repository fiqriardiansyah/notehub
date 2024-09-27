"use client";

import useSidePage from "@/hooks/use-side-page";
import useToggleHideNav from "@/hooks/use-toggle-hide-nav";
import { easeDefault } from "@/lib/utils";
import { Session } from "@/models";
import notificationService from "@/service/notification";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { AlignJustify, Bell } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { NOTIFICATIONS } from "../notifications";
import SearchGlobal from "../search-global";

export default function TopBar() {
  const { data } = useSession();
  const session = data as Session;
  const isNavHide = useToggleHideNav();
  const [setSidePage] = useSidePage();

  const countUnreadNotifQuery = useQuery([notificationService.countUnreadNotif.name], async () => {
    return (await notificationService.countUnreadNotif()).data.data
  });

  const onClickNotifications = () => {
    setSidePage(NOTIFICATIONS);
  };

  return (
    <>
      <motion.header animate={{ y: isNavHide ? "-100%" : 0 }} transition={{ ease: easeDefault }} className="fixed top-0 left-0 right-0 w-screen container-custom z-50 bg-white">
        <nav className="w-full flex items-center justify-between gap-3 py-1">
          <div className="flex items-center gap-2">
            <Link href="/" className="hidden md:block">
              <h1 className="text-gray-700 font-semibold text-xl">NoteHub</h1>
            </Link>
            <div className="block md:hidden">
              <SearchGlobal />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onClickNotifications} title="notifications"
              className="p-1 w-7 h-7 flex items-center justify-center rounded-full text-gray-500 relative">
              {countUnreadNotifQuery.data ? <div className="absolute -top-1 -right-1 pointer-events-none w-4 h-4 rounded-full bg-gray-800 text-white flex items-center justify-center text-xs">
                {countUnreadNotifQuery.data}
              </div> : null}
              <Bell size={20} />
            </button>
            <button className="p-1 w-7 h-7 flex items-center justify-center rounded-full text-gray-500">
              <AlignJustify size={20} />
            </button>
          </div>
        </nav>
      </motion.header>
      <div className="h-[50px]" />
    </>
  );
}


// {session?.sessionToken && (
//   <DropdownMenu>
//     <DropdownMenuTrigger asChild>
//       <Avatar className="cursor-pointer">
//         <AvatarImage
//           src={session?.user?.image}
//           alt={session?.user?.name}
//           referrerPolicy="no-referrer"
//         />
//         <AvatarFallback>{session?.user?.name}</AvatarFallback>
//       </Avatar>
//     </DropdownMenuTrigger>
//     <DropdownMenuContent className="w-56">
//       <DropdownMenuLabel>{session?.user?.name}</DropdownMenuLabel>
//       <DropdownMenuSeparator />
//       <DropdownMenuItem
//         onClick={onClickLogout}
//         className="cursor-pointer"
//         variant="danger"
//       >
//         <LogOut className="mr-2 h-4 w-4" />
//         <span>Log out</span>
//         <DropdownMenuShortcut>
//           {shortCut.logoutKey}
//         </DropdownMenuShortcut>
//       </DropdownMenuItem>
//     </DropdownMenuContent>
//   </DropdownMenu>
// )}