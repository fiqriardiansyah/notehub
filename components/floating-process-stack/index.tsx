import useProcess from "@/hooks/use-process";
import { Minimize2 } from "lucide-react";
import { ProgressStatusBarAsProcess } from "../status-bar/progress";
import { ErrorStatusBarAsProcess } from "../status-bar/error";
import { SucccessStatusBarAsProcess } from "../status-bar/success";

export default function FloatingProcessStack() {
  const { allProcess } = useProcess();

  const process = allProcess?.filter((p) => p.putInFloatingStack);

  if (!process?.length) return null;
  return (
    <div className="bg-white rounded-lg shadow-md z-50 fixed bottom-4 left-4 right-4 sm:right-auto p-2 sm:min-w-[250px] border border-solid border-gray-300 min-w-[200px]">
      <div className="w-full flex items-center justify-between">
        <p className="text-xs font-medium">On progress</p>
        <button className="" title="minimize">
          <Minimize2 size={16} />
        </button>
      </div>
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
    </div>
  );
}
