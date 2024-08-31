import api from "@/config/axios";
import { BaseResponse } from "@/models";
import { HabitHistory } from "@/models/habits";
import { Note } from "@/models/note";
import { AxiosResponse } from "axios";

const habitsService = {
    getUrgentHabit: (limit?: number): Promise<AxiosResponse<BaseResponse<Note[]>>> => api.get("/habits/urgent", { params: { limit } }),
    finishHabits: (id: string): Promise<AxiosResponse<BaseResponse<boolean>>> => api.get(`/habits/finish/${id}`),
    getHabitHistory: (id?: string): Promise<AxiosResponse<BaseResponse<HabitHistory[]>>> => api.get(`/habits/history/${id}`),
};

export default habitsService;
