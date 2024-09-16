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
};

type CallbackPayload<T = any> = (callback: (nameground: string, payload: T) => void) => void;

export type CommonContextType<T = any> = {
    common: CommonState;
    setCommon: React.Dispatch<React.SetStateAction<CommonState>>;
    callbackPayload: CallbackPayload<T>
    triggerCallbackPayload: (nameground: string, payload: any) => void;
    emptyCallback: () => void;
};

export const CommonContext = React.createContext({});

export const CommonProvider = ({ children }: { children: any }) => {
    const pathname = usePathname();
    const [common, setCommon] = React.useState<CommonState>();

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
            console.log("No callback payload registerd");
        }
    };

    const emptyCallback = () => {
        onCallbackPayload = [];
    }

    React.useEffect(() => {
        setCommon({});
    }, [pathname]);

    const value = {
        common,
        setCommon,
        callbackPayload,
        triggerCallbackPayload,
        emptyCallback
    } as CommonContextType;

    return (
        <CommonContext.Provider value={value}>{children}</CommonContext.Provider>
    );
};
