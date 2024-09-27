import api from "@/config/axios";
import { BaseResponse } from "@/models";
import { Notification } from "@/models/notification";
import { AxiosResponse } from "axios";

const notificationService = {
    getAllNotif: (page: number = 1): Promise<AxiosResponse<BaseResponse<Notification[]>>> => api.get("/notification", { params: { page } }),
    readNotif: (id: string): Promise<AxiosResponse<BaseResponse<Notification>>> => api.get(`/notification/read/${id}`),
    deleteNotif: (id: string): Promise<AxiosResponse<BaseResponse<Notification>>> => api.delete(`/notification/${id}`),
    updateInvitationProjectStatus: (id: string, status: string): Promise<AxiosResponse<BaseResponse<Notification>>> =>
        api.patch(`notification/status-project/${id}?status=${status}`),
    countUnreadNotif: (): Promise<AxiosResponse<BaseResponse<number>>> => api.get(`/notification/count`),
};

export default notificationService;
