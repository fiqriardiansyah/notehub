"use client";

import useStatusBar from "@/hooks/use-status-bar";
import LoadingStatusBar from "./loading";
import ErrorStatusBar from "./error";

export default function StatusBar() {
  const [statusBar] = useStatusBar();

  return (
    <div className="sticky top-[67px] left-0 z-20 bg-background-primary w-full">
      <div className="container-custom">
        <LoadingStatusBar {...statusBar} />
        <ErrorStatusBar {...statusBar} />
      </div>
    </div>
  );
}
