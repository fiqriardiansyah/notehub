import api from "@/config/axios";
import { BaseResponse } from "@/models";
import { Note } from "@/models/note";
import { AxiosResponse } from "axios";

const searchService = {
    search: (query?: string): Promise<AxiosResponse<BaseResponse<Note[]>>> => api.get(`/search/${query}`),
};

export default searchService;
