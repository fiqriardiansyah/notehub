import React from "react";

export type CallbackBridgeTrigger<T = any> = (callback?: (key: string, payload: T) => void) => void;


export type TriggerContextType<T> = {
    fireBridgeTrigger: (key: string, payload: any) => void;
    onBridgeTrigger: CallbackBridgeTrigger<T>;
}

export const TriggerContext = React.createContext({});

export const TriggerProvider = <T = any,>({ children }: { children: any }) => {

    let onBridgeTriggerCallback: any[] = [];

    const onBridgeTrigger: CallbackBridgeTrigger<T> = (callback) => {
        onBridgeTriggerCallback.push(callback);
    };

    const fireBridgeTrigger = (key: string, payload: any) => {
        if (onBridgeTriggerCallback.length > 0) {
            onBridgeTriggerCallback.forEach((callback) => {
                callback(key, payload);
            });
        } else {
            console.log("No callback bridge trigger registered!");
        }
    }

    const value = {
        onBridgeTrigger,
        fireBridgeTrigger,
    }

    return (
        <TriggerContext.Provider value={value}>{children}</TriggerContext.Provider>
    );
};

export default function useBridgeTrigger<T = any>() {
    const trigger = React.useContext(TriggerContext) as TriggerContextType<T>
    return trigger;
}