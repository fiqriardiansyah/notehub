import { User } from "next-auth";

export type InvitationData = {
    email: string;
    role: string;
    noteId: string;
    noteTitle: string;
}

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
}

export type CollabAccount = Pick<User, "id" | "name" | "email" | "image"> & Pick<InvitationData, "role">