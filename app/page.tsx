"use client";

import BottomBar from "@/components/navigation-bar/bottom-bar";
import TopBar from "@/components/navigation-bar/top-bar";
import Quotes from "@/components/quotes";
import noteService from "@/service/note";
import { useQuery } from "@tanstack/react-query";
import ReactDom from 'react-dom';
import HabitsAlert from "./components/habits/habits-alert";
import LayoutGrid from "./components/layout-grid";
import SettingNoteDrawer from "./components/setting-note-drawer";
import ToolBar from "./components/tool-bar";

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
      <div className="container-custom pb-20">
        <Quotes />
        <HabitsAlert />
        <ToolBar />
        <div className="w-full my-7">
          <LayoutGrid notes={itemsQuerey.data} />
        </div>
      </div>
      <SettingNoteDrawer.BottomSheet refetch={itemsQuerey.refetch} />
      <BottomBar />
    </>
  );
}
