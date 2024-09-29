import { INITIATE_SECURE_NOTE } from "@/app/components/card-note/setting/initiate-secure-note";
import { SECURE_NOTE } from "@/app/components/card-note/setting/secure-note";
import { pause } from "@/lib/utils";
import noteService from "@/service/note";
import { useMutation } from "@tanstack/react-query";
import React from "react";

export type UseSecureNoteParam = {
    onInitiateSecure?: () => void;
    onSecure?: (result: boolean) => void;
}

export default function useSecureNote({ onInitiateSecure, onSecure }: UseSecureNoteParam) {

    const checkHasPassNote = useMutation(["has-password"], async () => {
        await pause(0.4);
        return (await noteService.hasPasswordNote()).data.data;
    });

    React.useEffect(() => {
        const initiateSecureHandler = (e: any) => {
            if (onInitiateSecure) onInitiateSecure();
        }

        const secureHandler = (e: any) => {
            const isPasswordCorrect = e?.detail?.isPasswordCorrect;
            if (onSecure) onSecure(isPasswordCorrect);
        }

        window.addEventListener(INITIATE_SECURE_NOTE, initiateSecureHandler);
        window.addEventListener(SECURE_NOTE, secureHandler);
        return () => {
            window.removeEventListener(INITIATE_SECURE_NOTE, initiateSecureHandler);
            window.removeEventListener(SECURE_NOTE, secureHandler);
        }
    }, []);

    return { checkHasPassNote };

}