"use client";

import noteService from "@/service/note";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Link from "next/link";
import { ImPencil2 } from "react-icons/im";
import LayoutGrid from "./components/layout-grid";
import SettingNoteDrawer from "./components/setting-note-drawer";
import ToolBar from "./components/tool-bar";
import ReactDom from 'react-dom'
import TopBar from "@/components/navigation-bar/top-bar";
import Quotes from "@/components/quotes";
import HabitsAlert from "./components/habits/habits-alert";

export default function IndexPage() {
  const itemsQuerey = useQuery([noteService.getAllItems.name], async () => {
    return (await noteService.getAllItems()).data.data;
  }, {
    refetchOnWindowFocus: true,
  });

  const renderTopNav = () => {
    return typeof document !== "undefined" && document.querySelector("#top-nav") && ReactDom.createPortal(<TopBar />, document.querySelector("#top-nav")!)
  }

  return (
    <>
      {renderTopNav()}
      <div className="container-custom">
        <Quotes />
        <HabitsAlert />
        <ToolBar />
        <div className="w-full my-7">
          <LayoutGrid notes={itemsQuerey.data} />
        </div>
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
      <SettingNoteDrawer.BottomSheet refetch={itemsQuerey.refetch} />
    </>
  );
}
