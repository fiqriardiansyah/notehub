"use client";

import useStatusBar from "@/hooks/use-status-bar";
import LoadingStatusBar from "./loading";
import ErrorStatusBar from "./error";
import SucccessStatusBar from "./success";

export default function StatusBar() {
  const [statusBar] = useStatusBar();

  return (
    <div className="z-20 bg-background-primary w-full">
      <div className="container-custom">
        <LoadingStatusBar {...statusBar} />
        <ErrorStatusBar {...statusBar} />
        <SucccessStatusBar {...statusBar} />
      </div>
    </div>
  );
}
