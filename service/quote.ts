import api from "@/config/axios";
import { BaseResponse } from "@/models";
import { Quote } from "@/models/quote";
import { AxiosResponse } from "axios";

const quoteService = {
    getQuote: (): Promise<AxiosResponse<BaseResponse<Quote | null>>> => api.get("/quote"),
};

export default quoteService;
