"use client";

import useStatusBar from "@/hooks/use-status-bar";
import LoadingStatusBar from "./loading";
import ErrorStatusBar from "./error";
import SucccessStatusBar from "./success";
import React from "react";
import ProgressStatusBar from "./progress";
import { cn } from "@/lib/utils";

export default function StatusBar() {
  const [statusBar] = useStatusBar();

  React.useEffect(() => {
    if (statusBar?.show) {
      window.scrollTo(0, 0);
    }
  }, [statusBar?.show]);

  const className = cn(
    "container-custom flex flex-col gap-3",
    statusBar?.show && statusBar?.type ? "py-3" : ""
  );

  return (
    <div className="z-20 w-full">
      <div className={className}>
        <LoadingStatusBar {...statusBar} />
        <ErrorStatusBar {...statusBar} />
        <SucccessStatusBar {...statusBar} />
        <ProgressStatusBar {...statusBar} />
      </div>
    </div>
  );
}
