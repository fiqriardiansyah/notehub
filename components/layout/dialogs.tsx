"use client";

import DialogDeleteGround, {
  REMOVE_NOTE_EVENT_DIALOG,
} from "../card-note/setting/delete";
import DialogDeleteFolderGround, {
  REMOVE_FOLDER_EVENT_DIALOG,
} from "@/app/folder/components/delete-folder";
import DialogGetLink, {
  GET_LINK_EVENT_DIALOG,
} from "../card-note/setting/get-link";
import CheeringOverlay, { CHEERING_OVERLAY } from "../overlay/cheering";
import LeaveProject, { LEAVE_PROJECT } from "../card-note-collab/setting/leave";

export default function Dialogs() {
  return (
    <>
      <DialogGetLink key={GET_LINK_EVENT_DIALOG} />
      <DialogDeleteGround key={REMOVE_NOTE_EVENT_DIALOG} />
      <DialogDeleteFolderGround key={REMOVE_FOLDER_EVENT_DIALOG} />
      <CheeringOverlay key={CHEERING_OVERLAY} />
      <LeaveProject key={LEAVE_PROJECT} />
    </>
  );
}
