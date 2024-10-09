import api from "@/config/axios";
import { BaseResponse } from "@/models";
import { Note } from "@/models/note";
import { AxiosResponse } from "axios";
import { User } from "next-auth";

export type SearchReturnType = Pick<Note, "id" | "title" | "description" | "todos" | "note" | "type" | "updatedAt"> &
    Pick<User, "name" | "image"> & {
        isOwner: boolean;
    }

const searchService = {
    search: (query?: string): Promise<AxiosResponse<BaseResponse<SearchReturnType[]>>> => api.get(`/search?query=${query}`),
};

export default searchService;
