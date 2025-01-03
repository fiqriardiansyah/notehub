import { User } from "next-auth";
import { Note } from "./note";

export type InvitationData = {
  email: string;
  role: string;
  noteId: string;
  noteTitle: string;
};

export type Invitation = {
  id: string;
  noteId: string;
  noteTitle: string;
  invitedEmail: string;
  invitedBy: string;
  status: "pending" | "rejected" | "accepted";
  cretedAt: string;
  role: String;
  token: string;
};

export type InvitationValidate = Pick<Invitation, "status"> & Omit<InvitationData, "email">;

export type CollabAccount = Pick<User, "id" | "name" | "email" | "image"> & Pick<InvitationData, "role">;

export type CollaborateProject = Pick<
  Note,
  "id" | "title" | "note" | "type" | "todos" | "isHang" | "tags" | "updatedAt" | "isSecure" | "imagesUrl" | "filesUrl"
> &
  Pick<InvitationData, "role"> & {
    collaborateId: string;
    ownerId: string;
    ownerName: string;
    ownerImage: string;
  };
