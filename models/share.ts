import { User } from "next-auth";
import { Note } from "./note";

export type NoteShared = Pick<
  Note,
  | "title"
  | "note"
  | "updatedAt"
  | "updatedBy"
  | "todos"
  | "type"
  | "filesUrl"
  | "imagesUrl"
> &
  Pick<User, "name" | "image"> & {
    ownerId: string;
    collaborators: Pick<User, "name" | "image">[];
  };

export type ShareLink = {
  id: string;
  noteId: string;
  link: string;
  userId: string;
};
