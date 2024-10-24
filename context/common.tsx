import { useMobileMediaQuery } from "@/hooks/responsive";
import Cookies from "js-cookie";
import { usePathname } from "next/navigation";
import React from "react";

export type StatusBar = {
  type?: "default" | "danger" | "success" | "loading" | "progress";
  message?: string;
  show?: boolean;
  icon?: any;
  autoClose?: number;
};

export type Process = {
  id: string;
  nameOfProcess: string;
  putInFloatingStack?: boolean;
  type?: StatusBar["type"];
};

export type HelperPanel = {
  open?: boolean;
  content?: string;
};

export type CommonState = {
  statusBar?: StatusBar;
  sidePageOpen?: boolean;
  groundOpen?: string;
  process?: Process[];
  helperPanel?: HelperPanel;
};

type CallbackPayload<T = any> = (
  callback: (nameground: string, payload: T) => void
) => void;

export type CommonContextType<T = any> = {
  common: CommonState;
  setCommon: React.Dispatch<React.SetStateAction<CommonState>>;
  callbackPayload: CallbackPayload<T>;
  triggerCallbackPayload: (nameground: string, payload: any) => void;
  emptyCallback: () => void;
  setIsDesktopSidebarCollapsed: React.Dispatch<boolean>;
  isDesktopSidebarCollapsed: boolean;
  defaultLayoutResizable: number[];
};

export const CommonContext = React.createContext({});

// {
//     process: [
//         { id: "kfjaieasoifiaeifj", nameOfProcess: 'creating note', putInFloatingStack: true, type: "progress" }
//     ]
// }

export const CommonProvider = ({ children }: { children: any }) => {
  const layout = Cookies.get("react-resizable-panels:layout:mail");
  const collapsed = Cookies.get("react-resizable-panels:collapsed");

  const defaultLayoutResizable = layout ? JSON.parse(layout) : [17, 83, 30];
  const defaultCollapsed = collapsed ? JSON.parse(collapsed) : false;

  const isMobile = useMobileMediaQuery();
  const pathname = usePathname();
  const [common, setCommon] = React.useState<CommonState>();
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] =
    React.useState<boolean>(defaultCollapsed);

  React.useEffect(() => {
    if (isMobile) {
      setCommon((prev) => ({
        process: prev?.process,
        statusBar: prev?.statusBar,
      }));
      return;
    }
  }, [pathname]);

  const value = {
    common,
    setCommon,
    setIsDesktopSidebarCollapsed,
    isDesktopSidebarCollapsed,
    defaultLayoutResizable,
  } as CommonContextType;

  return (
    <CommonContext.Provider value={value}>{children}</CommonContext.Provider>
  );
};
