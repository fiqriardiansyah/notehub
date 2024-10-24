import useProcess from "@/hooks/use-process";
import { Maximize, Minimize, Minimize2 } from "lucide-react";
import { ProgressStatusBarAsProcess } from "../status-bar/progress";
import { ErrorStatusBarAsProcess } from "../status-bar/error";
import { SucccessStatusBarAsProcess } from "../status-bar/success";
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

export default function FloatingProcessStack() {
  const { allProcess } = useProcess();
  const [isMinimize, setIsMinimize] = React.useState(false);

  const process = allProcess?.filter((p) => p.putInFloatingStack);

  const onClickMinimize = () => {
    setIsMinimize((prev) => !prev);
  };

  const className = cn(
    "bg-white rounded-lg shadow-md z-50 fixed bottom-4 left-4 right-4 sm:right-auto p-2 border border-solid border-gray-300",
    !isMinimize ? "sm:min-w-[250px]" : "w-fit"
  );

  if (!process?.length) return null;
  return (
    <div className={className}>
      <div className="w-full flex items-center justify-between gap-5">
        <div className="flex gap-1 items-center">
          {isMinimize && (
            <Button size="icon-small">
              {process.filter((p) => p.type === "progress").length}
            </Button>
          )}
          <p className="text-xs font-medium">Process Queue</p>
        </div>
        <button
          onClick={onClickMinimize}
          className=""
          title={isMinimize ? "Maximize" : "Minimize"}
        >
          {isMinimize ? <Maximize size={16} /> : <Minimize size={16} />}
        </button>
      </div>
      {!isMinimize && (
        <div className="mt-5 w-full max-h-[60vh] overflow-y-scroll">
          {process.map((p) => {
            if (p.type === "progress") {
              return (
                <div className="w-full mb-2" key={p.id}>
                  <ProgressStatusBarAsProcess process={p} />
                </div>
              );
            }
            if (p.type === "danger") {
              return (
                <div className="w-full mb-2" key={p.id}>
                  <ErrorStatusBarAsProcess key={p.id} process={p} />
                </div>
              );
            }
            if (p.type === "success") {
              return (
                <div className="w-full mb-2" key={p.id}>
                  <SucccessStatusBarAsProcess key={p.id} process={p} />
                </div>
              );
            }
            return "Not handled yet";
          })}
        </div>
      )}
    </div>
  );
}
