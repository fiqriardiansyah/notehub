import api from "@/config/axios";
import { BaseResponse } from "@/models";
import { CollabAccount, CollaborateProject, Invitation, InvitationData } from "@/models/collab";
import { AxiosResponse } from "axios";

const collabService = {
    invite: (invitation: InvitationData): Promise<AxiosResponse<BaseResponse<any>>> => api.post("/collab/invite", invitation),
    getInvitation: (noteId: string, status: Invitation["status"] = "pending"): Promise<AxiosResponse<BaseResponse<Invitation[]>>> =>
        api.get("/collab/invite/" + noteId, { params: { status } }),
    collabAccount: (noteId: string): Promise<AxiosResponse<BaseResponse<CollabAccount[]>>> => api.get(`/collab/${noteId}`),
    inviteValidate: (token: string, status: string): Promise<AxiosResponse<BaseResponse<{ status: Invitation["status"] }>>> =>
        api.post(`collab/invite/validate?token=${token}&status=${status}`,),
    cancelInvitation: (idInvitation: string): Promise<AxiosResponse<BaseResponse<boolean>>> => api.delete(`collab/invite/${idInvitation}`),
    removeCollab: (idCollab: string): Promise<AxiosResponse<BaseResponse<boolean>>> => api.delete(`collab/${idCollab}`),
    changeRoleCollab: (idCollab: string, role: string): Promise<AxiosResponse<BaseResponse<boolean>>> => api.patch(`collab/${idCollab}`, { role }),
    getMyCollaborateProject: (): Promise<AxiosResponse<BaseResponse<CollaborateProject[]>>> => api.get("collab/all"),
};

export default collabService;
