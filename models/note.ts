import { Todo } from "@/app/write/mode/todolist";
import { FileInfo } from "@/hooks/use-upload-file";
import { User } from "next-auth";

export interface Tag {
  id: string;
  text: string;
  flag: string;
  icon: string;
  isNew?: boolean;
  creatorId?: string;
}

export type ModeNote = "freetext" | "todolist" | "habits";

export type FileInfoFromServer = Pick<FileInfo, "url" | "name" | "sizeInMb">;
export interface Note {
  id: string;
  title: string;
  note?: {
    time: number;
    blocks: any[];
    version: string;
  };
  description?: {
    time: number;
    blocks: any[];
    version: string;
  };
  userId?: string;
  type: ModeNote;
  createdAt: string;
  updatedAt: string;
  isSecure?: boolean;
  tags?: Tag[];
  isHang?: boolean;
  folderId?: string;
  newFolder?: {
    title?: string;
  };
  updatedBy?: string;
  todos?: Todo[];
  schedulerType?: "day" | "weekly" | "monthly";
  schedulerDays?: string[];
  schedulerStartTime?: string;
  schedulerEndTime?: string;
  reschedule?: boolean;
  filesUrl?: FileInfoFromServer[];
  imagesUrl?: FileInfoFromServer[];
}

export interface DetailNote extends Note {
  folderName?: string;
  role?: "editor" | "viewer";
}

export interface Folder {
  type: "folder";
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface DetailFolder {
  folder: Folder;
  notes: Note[];
}

export interface CreateNote extends Omit<Note, "createdAt" | "updatedAt"> {
  files?: Pick<
    FileInfo,
    "base64" | "name" | "contentType" | "sizeInMb" | "url"
  >[];
  images?: Pick<
    FileInfo,
    "base64" | "name" | "contentType" | "sizeInMb" | "url"
  >[];
}

export interface ChangeTodosData {
  noteId: string;
  todos: Todo[];
}
