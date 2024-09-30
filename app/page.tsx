"use client";

import BottomBar from "@/components/navigation-bar/bottom-bar";
import TopBar from "@/components/navigation-bar/top-bar";
import Quotes from "@/components/quotes";
import StateRender from "@/components/state-render";
import { NoteContext, NoteContextType } from "@/context/note";
import { Note } from "@/models/note";
import noteService from "@/service/note";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import ReactDom from 'react-dom';
import CardFolder from "./components/card-folder";
import CardNote from "./components/card-note";
import HabitsAlert from "./components/habits/habits-alert";
import LayoutGrid from "./components/layout-grid";
import SettingNoteDrawer from "./components/setting-note-drawer";
import ToolBar from "./components/tool-bar";
import ButtonToWrite from "./habits/components/button-make-habit";

export default function IndexPage() {
  const { note: { changesRandomId } } = React.useContext(NoteContext) as NoteContextType;
  const [orderList, setOrderList] = React.useState<"desc" | "asc">("desc");

  const itemsQuery = useQuery([noteService.getAllItems.name, orderList, changesRandomId], async () => {
    return (await noteService.getAllItems(orderList)).data.data;
  });

  React.useEffect(() => { itemsQuery.refetch() }, []);

  const renderTopNav = () => {
    return typeof document !== "undefined" && document.querySelector("#top-nav") && ReactDom.createPortal(<TopBar />, document.querySelector("#top-nav")!)
  }

  const onClickModified = () => {
    setOrderList((prev) => prev === "desc" ? "asc" : "desc");
  }

  return (
    <>
      {renderTopNav()}
      <div className="container-custom pb-20 min-h-screen">
        <Quotes />
        <HabitsAlert />
        <ToolBar order={orderList} onClickModified={onClickModified} />
        <StateRender data={itemsQuery.data} isLoading={itemsQuery.isLoading}>
          <StateRender.Data>
            <div className="w-full my-7">
              {itemsQuery.data?.length ?
                <LayoutGrid items={itemsQuery.data}>
                  {(item) => {
                    if (item.type === "folder") return <CardFolder {...item} key={item.id} />
                    return <CardNote note={item as Note} key={item.id} attachMenu={(note) => <SettingNoteDrawer.Attach note={note} />} />
                  }}
                </LayoutGrid> :
                <ButtonToWrite href="/write?type=freetext" title="There is no notes available" />}
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
