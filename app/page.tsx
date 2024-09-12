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
import StateRender from "@/components/state-render";
import ButtonToWrite from "./habits/components/button-make-habit";

export default function IndexPage() {
  const itemsQuery = useQuery([noteService.getAllItems.name], async () => {
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
      <div className="container-custom pb-20 min-h-screen">
        <Quotes />
        <HabitsAlert />
        <ToolBar />
        <StateRender data={itemsQuery.data} isLoading={itemsQuery.isLoading}>
          <StateRender.Data>
            <div className="w-full my-7">
              {itemsQuery.data?.length ? <LayoutGrid notes={itemsQuery.data} /> : <ButtonToWrite href="/write?type=freetext" title="There is no notes available" />}
            </div>
          </StateRender.Data>
          <StateRender.Loading>
            <p>Getting Notes...</p>
          </StateRender.Loading>
        </StateRender>
      </div>
      <SettingNoteDrawer.BottomSheet refetch={itemsQuery.refetch} />
      <BottomBar />
    </>
  );
}
