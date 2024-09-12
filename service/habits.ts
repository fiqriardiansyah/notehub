import api from "@/config/axios";
import { BaseResponse } from "@/models";
import { HabitHistory, Timer } from "@/models/habits";
import { Note } from "@/models/note";
import { AxiosResponse } from "axios";

const habitsService = {
    getUrgentHabit: (limit?: number): Promise<AxiosResponse<BaseResponse<Note[]>>> => api.get("/habits/urgent", { params: { limit } }),
    finishHabits: (id: string): Promise<AxiosResponse<BaseResponse<boolean>>> => api.get(`/habits/finish/${id}`),
    getHabitHistory: (id?: string): Promise<AxiosResponse<BaseResponse<HabitHistory[]>>> => api.get(`/habits/history/${id}`),
    getHabits: (type?: string): Promise<AxiosResponse<BaseResponse<Note[]>>> => api.get(`/habits/${type}`),
    setTimerTask: (timer?: Timer): Promise<AxiosResponse<BaseResponse<Timer>>> => api.post(`/habits/timer`, timer),
    deleteTimerTask: (data: { noteId: string; itemId: string }): Promise<AxiosResponse<BaseResponse<Timer>>> => api.delete(`/habits/timer/${data.noteId}/${data.itemId}`),
};

export default habitsService;
