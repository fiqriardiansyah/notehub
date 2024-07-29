"use client";

import noteService from "@/service/note";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ImPencil2 } from "react-icons/im";
import CardNote from "./components/card-note";
import SettingNoteDrawer from "./components/setting-note-drawer";
import ToolBar from "./components/tool-bar";

export default function IndexPage() {
  const { data: session } = useSession();

  const noteQuery = useQuery([noteService.getNote.name], async () => {
    return (await noteService.getNote()).data.data;
  });

  return (
    <>
      <ToolBar />
      <div className="w-full grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 container-custom my-7">
        <AnimatePresence>
          {noteQuery.data?.map((note) => (
            <CardNote {...note} key={note.id} />
          ))}
        </AnimatePresence>
      </div>
      <Link href="/write" className="bottom-10 right-10 fixed z-10">
        <motion.button
          animate={{ transition: { delay: 0.8 }, scale: 1 }}
          initial={{ scale: 0 }}
          className="bg-primary text-white  w-10 h-10 rounded-full flex items-center justify-center"
        >
          <ImPencil2 className="text-xl" />
        </motion.button>
      </Link>
      <SettingNoteDrawer.BottomSheet />
    </>
  );
}
