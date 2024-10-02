import { User } from "next-auth";
import { Note } from "./note";

export type NoteShared = Pick<Note, "title" | "note" | "updatedAt" | "updatedBy" | "todos" | "type"> & Pick<User, "name" | "image"> & {
    ownerId: string;
};

export type ShareLink = {
    id: string;
    noteId: string;
    link: string;
    userId: string;
}