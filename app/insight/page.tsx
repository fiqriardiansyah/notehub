"use client";

import BottomBar from "@/components/navigation-bar/bottom-bar";
import TopBar from "@/components/navigation-bar/top-bar/mobile";
import ReactDom from "react-dom";
import { useQuery } from "@tanstack/react-query";
import noteService from "@/service/note";
import ListImage from "@/components/file/list-image";
import StateRender from "@/components/state-render";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";

const FreetextView = dynamic(() => import("@/app/share/[id]/components/freetext").then((mod) => mod.default), { ssr: false });

export default function Insight() {
  const content = useQuery([noteService.getOneNote.name, "insight"], async () => {
    return (await noteService.getOneNote("insight")).data.data;
  });

  const renderTopNav = () => {
    return (
      typeof document !== "undefined" && document.querySelector("#top-nav") && ReactDom.createPortal(<TopBar />, document.querySelector("#top-nav")!)
    );
  };

  return (
    <>
      {renderTopNav()}
      <div className="container-read w-full flex flex-col gap-2 pt-5 pb-20">
        <StateRender data={content.data} isError={content.isError} isLoading={content?.isLoading}>
          <StateRender.Data>
            <h1 className="text-xl sm:text-3xl font-medium mb-5">{content?.data?.title}</h1>
            <FreetextView data={content?.data?.note} />
            {content.data?.imagesUrl?.length ? (
              <>
                <div className="h-6"></div>
                <ListImage defaultList={content.data?.imagesUrl} />
              </>
            ) : null}
          </StateRender.Data>
          <StateRender.Loading>
            <Skeleton className="w-full h-5" />
            <Skeleton className="w-[80%] h-5" />
            <Skeleton className="w-[90%] h-5" />
          </StateRender.Loading>
          <StateRender.Error>
            <p className="text-red-500">{(content?.error as any)?.message}</p>
          </StateRender.Error>
        </StateRender>
      </div>
      <BottomBar />
    </>
  );
}
