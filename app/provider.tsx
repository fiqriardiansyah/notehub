"use client";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { NoteProvider } from "@/context/note";
import { CommonProvider } from "@/context/common";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WriteProvider } from "@/context/write";

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
            <TooltipProvider>{children}</TooltipProvider>
          </WriteProvider>
        </NoteProvider>
      </CommonProvider>
    </QueryClientProvider>
  );
}
