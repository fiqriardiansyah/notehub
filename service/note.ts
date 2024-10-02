import api from "@/config/axios";
import { BaseResponse } from "@/models";
import { ChangeTodosData, CreateNote, DetailFolder, DetailNote, Folder, Note, Tag } from "@/models/note";
import { NoteShared, ShareLink } from "@/models/share";
import { AxiosResponse } from "axios";

const noteService = {
  createNote: (
    data: CreateNote
  ): Promise<AxiosResponse<BaseResponse<any>, any>> => api.post("/note", data),

  updateNote: (
    data: Partial<CreateNote>,
    id: string,
  ): Promise<AxiosResponse<BaseResponse<any>, any>> => api.put(`/note/update/${id}`, data),

  getNote: (): Promise<AxiosResponse<BaseResponse<Note[]>>> => api.get("/note"),

  getAllItems: (order: any): Promise<AxiosResponse<BaseResponse<(Note | Folder)[]>>> => api.get(`/note/get-all?order=${order}`),

  getOneNote: (id: string): Promise<AxiosResponse<BaseResponse<DetailNote>>> => api.get(`/note/${id}`),

  getFolder: (): Promise<AxiosResponse<BaseResponse<Folder[]>>> => api.get(`/note/list-folder`),

  changeTodos: (data: ChangeTodosData): Promise<AxiosResponse<BaseResponse<boolean>>> => api.post(`/note/ct`, data),

  getFolderAndContent: (id: string): Promise<AxiosResponse<BaseResponse<DetailFolder>>> => api.get(`/note/f/${id}`),

  updateFolder: (id: string, data: Partial<Folder>): Promise<AxiosResponse<BaseResponse<DetailFolder>>> => api.patch(`/note/f/${id}`, data),

  addNoteToFolder: (folderId: string, noteIds: string[]): Promise<AxiosResponse<BaseResponse<any>>> => api.post(`/note/antf`, { folderId, noteIds }),

  isSecureNote: (id: string): Promise<AxiosResponse<BaseResponse<boolean>>> => api.get(`/note/isn/${id}`),

  deleteNote: (id: string): Promise<AxiosResponse<BaseResponse<Note>>> =>
    api.delete(`/note/${id}`),

  deleteFolder: (id: string): Promise<AxiosResponse<BaseResponse<{ folderId: string }>>> =>
    api.delete(`/note/folder/${id}`),

  hasPasswordNote: (): Promise<AxiosResponse<BaseResponse<boolean>>> =>
    api.get("/note/hpn"),

  setPasswordNote: (
    password: string
  ): Promise<AxiosResponse<BaseResponse<boolean>>> =>
    api.post("/note/spn", { password }),

  changePasswordNote: (data: {
    password: string;
    newPassword: string;
  }): Promise<AxiosResponse<BaseResponse<boolean>>> =>
    api.post("/note/cpn", {
      password: data.newPassword,
      "old-password": data.password,
    }),

  isPasswordNoteCorrect: (
    password: string
  ): Promise<AxiosResponse<BaseResponse<boolean>>> =>
    api.post("/note/ipnc", { password }),

  getTag: (): Promise<AxiosResponse<BaseResponse<Tag[]>>> => api.get("/note/tag"),

  createTag: (data: Partial<Tag>): Promise<AxiosResponse<BaseResponse<Tag>>> => api.post("/note/tag", data),

  removeTagNewFlag: (id: string): Promise<AxiosResponse<BaseResponse<Tag>>> => api.patch(`/note/tag/${id}`),

  resetTodosTimer: (id: string): Promise<AxiosResponse<BaseResponse<Note>>> => api.get(`/note/reset-todos-timer/${id}`), // for debugging only

  getOnlyTodos: (id: string): Promise<AxiosResponse<BaseResponse<Pick<Note, "todos">>>> => api.get(`/note/only-todos/${id}`),

  generateShareLink: (noteId: string): Promise<AxiosResponse<BaseResponse<ShareLink>>> => api.post(`/note/share-link`, { noteId }),

  getShareLink: (noteId: string): Promise<AxiosResponse<BaseResponse<ShareLink>>> => api.get(`/note/share-link/${noteId}`),

  deleteShareLink: (id: string): Promise<AxiosResponse<BaseResponse<ShareLink>>> => api.delete(`/note/share-link/${id}`),

  getNoteFromShareLink: (id: string): Promise<AxiosResponse<BaseResponse<NoteShared>>> => api.get(`/note/share/${id}`),

};

export default noteService;
