"use client";
import Overlay from "@/components/overlay";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CommonProvider } from "@/context/common";
import { NoteProvider } from "@/context/note";
import { TimerProvider } from "@/context/timer";
import { WriteProvider } from "@/context/write";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

const client = new QueryClient();

export default function Provider({ children }: { children: any }) {
  return (
    <QueryClientProvider client={client}>
      <Toaster />
      <ProgressBar
        height="3px"
        color="#000000"
        options={{ showSpinner: false }}
        shallowRouting
      />
      <CommonProvider>
        <NoteProvider>
          <WriteProvider>
            <TimerProvider>
              <Overlay>
                <TooltipProvider>{children}</TooltipProvider>
              </Overlay>
            </TimerProvider>
          </WriteProvider>
        </NoteProvider>
      </CommonProvider>
    </QueryClientProvider>
  );
}
