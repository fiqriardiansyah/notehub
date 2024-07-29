export interface BaseResponse<T = any> {
  data: T;
  error: any;
}

export interface Session {
  user?: {
    id?: string;
    name?: string;
    email?: string;
    createdAt?: string;
    updatedAt?: string;
    image?: string;
  };
  sessionToken?: string;
  userId?: string;
  expires?: string;
  createdAt?: string;
  updatedAt?: string;
}
