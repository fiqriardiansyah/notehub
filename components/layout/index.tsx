"use client";

import {
  useDesktopMediaQuery,
  useMobileMediaQuery,
  useTabletMediaQuery,
} from "@/hooks/responsive";
import DesktopLayout from "./desktop";
import Dialogs from "./dialogs";
import MobileLayout from "./mobile";
import SidePanel from "./side-panel";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Codesandbox } from "lucide-react";
import { usePathname } from "next/navigation";
import FloatingProcessStack from "../floating-process-stack";

export default function Layout({ children }: { children: any }) {
  const session = useSession();
  const pathname = usePathname();

  const isMobile = useMobileMediaQuery();
  const isDesktop = useDesktopMediaQuery();
  const isTablet = useTabletMediaQuery();

  if (!session?.data?.user) {
    if (pathname === "/signin") return children;
    return (
      <>
        <header className="sticky top-0 left-0 z-50 bg-white w-full border-b border-solid border-gray-200">
          <nav className="py-2 container-custom w-full flex items-center justify-between">
            <div className="text-lg font-semibold flex items-center gap-1">
              <Codesandbox /> NoteHub
            </div>
            <Link href="/signin">
              <Button variant="default">Signin</Button>
            </Link>
          </nav>
        </header>
        <div className="w-full pb-20 pt-2">{children}</div>
      </>
    );
  }

  return (
    <>
      {isDesktop || isTablet ? (
        <DesktopLayout>{children}</DesktopLayout>
      ) : (
        <MobileLayout>{children}</MobileLayout>
      )}
      <SidePanel />
      <Dialogs />
      <FloatingProcessStack />
    </>
  );
}
