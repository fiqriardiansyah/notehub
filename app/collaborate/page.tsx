"use client";

import BottomBar from "@/components/navigation-bar/bottom-bar";
import TopBar from "@/components/navigation-bar/top-bar";
import StateRender from "@/components/state-render";
import collabService from "@/service/collab";
import { useQuery } from "@tanstack/react-query";
import ReactDom from 'react-dom';
import CardNoteCollab from "../components/card-note-collab";
import LayoutGrid from "../components/layout-grid";
import SettingNoteDrawer from "../components/setting-note-drawer";
import ToolBar from "../components/tool-bar";

export default function CollaboratePage() {

    const projectsQuery = useQuery([collabService.getMyCollaborateProject.name], async () => {
        return (await collabService.getMyCollaborateProject()).data.data;
    });

    const renderTopNav = () => {
        return typeof document !== "undefined" && document.querySelector("#top-nav") && ReactDom.createPortal(<TopBar />, document.querySelector("#top-nav")!)
    }

    return (
        <>
            {renderTopNav()}
            <div className="container-custom pb-20 min-h-screen">
                <ToolBar />
                <StateRender data={projectsQuery.data} isLoading={projectsQuery.isLoading}>
                    <StateRender.Data>
                        <LayoutGrid items={projectsQuery.data}>
                            {(item) => <CardNoteCollab note={item} key={item.id} />}
                        </LayoutGrid>
                    </StateRender.Data>
                    <StateRender.Loading>
                        <p>Getting Notes...</p>
                    </StateRender.Loading>
                </StateRender>
            </div>
            <SettingNoteDrawer.CollabBottomSheet refetch={projectsQuery.refetch} />
            <BottomBar />
        </>
    );
}
