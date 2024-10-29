"use client";

import { CommonContext, CommonContextType } from "@/context/common";
import { motion } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";

export const PROFILE_MENU = "profileMenu";

export default function ProfileMenu() {
  const session = useSession();
  const { common } = React.useContext(CommonContext) as CommonContextType;
  const [loading, setLoading] = React.useState(false);

  const onLogout = () => {
    signOut();
    setLoading(true);
  };

  if (common?.groundOpen !== PROFILE_MENU) return null;
  return (
    <motion.div
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1, transition: { delay: 0.3 } }}
      className="w-full h-full flex flex-col gap-6"
    >
      <div className="flex items-center gap-2">
        <Image
          title={session?.data?.user?.name || ""}
          src={session?.data?.user?.image || ""}
          alt={session?.data?.user?.name || ""}
          width={40}
          height={40}
          className="rounded-full bg-gray-100 bg-cover"
        />
        <p className="m-0 text-gray-700">{session?.data?.user?.name}</p>
      </div>
      <Button loading={loading} onClick={onLogout} size="sm" variant="secondary" title="Logout from account" className="flex gap-3 text-red-400">
        <LogOut />
        Logout
      </Button>
    </motion.div>
  );
}
