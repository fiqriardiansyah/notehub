import { useMobileMediaQuery } from "@/hooks/responsive";
import Cookies from "js-cookie";
import { usePathname } from "next/navigation";
import React from "react";

export type CommonState = {
    statusBar?: {
        type?: "default" | "danger" | "success" | "loading";
        message?: string;
        show?: boolean;
        icon?: any;
        autoClose?: number;
    } | null;
    sidePageOpen?: boolean;
    groundOpen?: string;
    process?: {
        id?: string;
        nameOfProcess?: string;
    }[]
};

type CallbackPayload<T = any> = (callback: (nameground: string, payload: T) => void) => void;

export type CommonContextType<T = any> = {
    common: CommonState;
    setCommon: React.Dispatch<React.SetStateAction<CommonState>>;
    callbackPayload: CallbackPayload<T>
    triggerCallbackPayload: (nameground: string, payload: any) => void;
    emptyCallback: () => void;
    setIsDesktopSidebarCollapsed: React.Dispatch<boolean>;
    isDesktopSidebarCollapsed: boolean;
    defaultLayoutResizable: number[];
};

export const CommonContext = React.createContext({});

export const CommonProvider = ({ children }: { children: any }) => {
    const layout = Cookies.get("react-resizable-panels:layout:mail")
    const collapsed = Cookies.get("react-resizable-panels:collapsed")

    const defaultLayoutResizable = layout ? JSON.parse(layout) : [17, 83, 30];
    const defaultCollapsed = collapsed ? JSON.parse(collapsed) : false;

    const isMobile = useMobileMediaQuery();
    const pathname = usePathname();
    const [common, setCommon] = React.useState<CommonState>();
    const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = React.useState<boolean>(defaultCollapsed);

    let onCallbackPayload: any[] = [];

    const callbackPayload: CallbackPayload = (callback) => {
        onCallbackPayload.push(callback);
    }

    const triggerCallbackPayload = (nameground: string, payload: any) => {
        if (onCallbackPayload.length > 0) {
            onCallbackPayload.forEach((callback) => {
                callback(nameground, payload);
            });
            setCommon((prev) => ({
                ...prev,
                sidePageOpen: true,
                groundOpen: nameground,
            }));
        } else {
            console.log("No callback payload [common.tsx] registerd");
        }
    };

    const emptyCallback = () => {
        onCallbackPayload = [];
    }

    React.useEffect(() => {
        if (isMobile) {
            setCommon({});
            return;
        }
        setCommon((prev) => ({ ...prev, groundOpen: prev?.groundOpen, sidePageOpen: prev?.sidePageOpen }))
    }, [pathname]);

    const value = {
        common,
        setCommon,
        callbackPayload,
        triggerCallbackPayload,
        emptyCallback,
        setIsDesktopSidebarCollapsed,
        isDesktopSidebarCollapsed,
        defaultLayoutResizable,
    } as CommonContextType;

    return (
        <CommonContext.Provider value={value}>{children}</CommonContext.Provider>
    );
};