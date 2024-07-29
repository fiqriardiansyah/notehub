import api from "@/config/axios";
import { BaseResponse } from "@/models";
import { CreateNote, Note, Tag } from "@/models/note";
import { AxiosResponse } from "axios";

const noteService = {
  createNote: (
    data: CreateNote
  ): Promise<AxiosResponse<BaseResponse<any>, any>> => api.post("/note", data),

  updateNote: (
    data: CreateNote,
    id: string,
  ): Promise<AxiosResponse<BaseResponse<any>, any>> => api.put(`/note/update/${id}`, data),

  getNote: (): Promise<AxiosResponse<BaseResponse<Note[]>>> => api.get("/note"),

  getOneNote: (id: string): Promise<AxiosResponse<BaseResponse<Note>>> => api.get(`/note/${id}`),

  deleteNote: (id: string): Promise<AxiosResponse<BaseResponse<Note>>> =>
    api.delete(`/note/${id}`),

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

  getTag: (): Promise<AxiosResponse<BaseResponse<Tag[]>>> => api.get("/note/tag"),

  createTag: (data: Partial<Tag>): Promise<AxiosResponse<BaseResponse<Tag>>> => api.post("/note/tag", data),

  removeTagNewFlag: (id: string): Promise<AxiosResponse<BaseResponse<Tag>>> => api.patch(`/note/tag/${id}`),

};

export default noteService;
