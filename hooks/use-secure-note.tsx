import { INITIATE_SECURE_NOTE, INITIATE_SECURE_NOTE_FINISH } from "@/components/card-note/setting/initiate-secure-note";
import { SECURE_NOTE, SECURE_NOTE_FINISH } from "@/components/card-note/setting/secure-note";
import { pause } from "@/lib/utils";
import noteService from "@/service/note";
import { useMutation } from "@tanstack/react-query";
import { useBridgeEvent } from "./use-bridge-event";

export type UseSecureNoteParam = {
    onInitiateSecure?: () => void;
    onSecure?: (result: boolean) => void;
}

export default function useSecureNote({ onInitiateSecure, onSecure }: UseSecureNoteParam) {

    const checkHasPassNote = useMutation([noteService.hasPasswordNote.name], async () => {
        await pause(0.4);
        return (await noteService.hasPasswordNote()).data.data;
    });

    useBridgeEvent(SECURE_NOTE_FINISH, (payload: { isPasswordCorrect: boolean }) => {
        if (onSecure) onSecure(payload.isPasswordCorrect);
    });

    useBridgeEvent(INITIATE_SECURE_NOTE_FINISH, () => {
        if (onInitiateSecure) onInitiateSecure();
    });

    return { checkHasPassNote };

}