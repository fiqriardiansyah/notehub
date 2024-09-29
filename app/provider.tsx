"use client";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { NoteProvider } from "@/context/note";
import { CommonProvider } from "@/context/common";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WriteProvider } from "@/context/write";
import Overlay from "@/components/overlay";
import { TimerProvider } from "@/context/timer";
import { TriggerProvider } from "@/context/trigger";

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
      <TriggerProvider>
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
      </TriggerProvider>
    </QueryClientProvider>
  );
}
