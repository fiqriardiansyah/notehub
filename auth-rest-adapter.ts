import {
  Adapter,
  AdapterAccount,
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from "next-auth/adapters";
import api from "./config/axios";

export function AuthRestAdapter(): Adapter {
  return {
    createUser: async (user: Omit<AdapterUser, "id">) => {
      const response = await api.post("/auth", user);
      return format<AdapterUser>(response.data);
    },
    getUserByEmail: async (email: string) => {
      const response = await api.get("/auth", { params: { email } });
      return response.data ? format<AdapterUser>(response.data) : response.data;
    },
    getUserByAccount: async ({
      providerAccountId,
      provider,
    }: Pick<AdapterAccount, "provider" | "providerAccountId">) => {
      const response = await api.get(
        `/auth/account/${provider}/${providerAccountId}`
      );
      return response.data ? format<AdapterUser>(response.data) : response.data;
    },
    getUser: async (id: string) => {
      const response = await api.get(`/auth/${id}`);
      return response.data ? format<AdapterUser>(response.data) : response.data;
    },
    updateUser: async (
      user: Partial<AdapterUser> & Pick<AdapterUser, "id">
    ) => {
      const response = await api.patch("/auth/", user);
      return format<AdapterUser>(response.data);
    },
    deleteUser: async (userId: string) => {
      const response = await api.delete(`/auth/${userId}`);
      return response.data ? format<AdapterUser>(response.data) : response.data;
    },
    linkAccount: async (account: AdapterAccount) => {
      const response = await api.post("/auth/account", account);
      return response.data
        ? format<AdapterAccount>(response.data)
        : response.data;
    },
    unlinkAccount: async ({
      providerAccountId,
      provider,
    }: Pick<AdapterAccount, "provider" | "providerAccountId">) => {
      const response = await api.delete(
        `/auth/account/${provider}/${providerAccountId}`
      );
      return response.data
        ? format<AdapterAccount>(response.data)
        : response.data;
    },
    createSession: async (session: {
      sessionToken: string;
      userId: string;
      expires: Date;
    }) => {
      const response = await api.post("/auth/session", session);
      return response.data
        ? format<AdapterSession>(response.data)
        : response.data;
    },
    getSessionAndUser: async (sessionToken: string) => {
      const response = await api.get(`/auth/session/${sessionToken}`);

      if (!response.data) {
        return response.data;
      }

      const session = format<AdapterSession>(response.data.session);
      const user = format<AdapterUser>(response.data.user);
      return { session, user };
    },
    updateSession: async (
      session: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">
    ) => {
      const response = await api.patch("/auth/session", session);
      return response.data
        ? format<AdapterSession>(response.data)
        : response.data;
    },
    deleteSession: async (sessionToken: string) => {
      const response = await api.delete(`/auth/session/${sessionToken}`);
      return response.data
        ? format<AdapterSession>(response.data)
        : response.data;
    },
    createVerificationToken: async (verificationToken: VerificationToken) => {
      const response = await api.post("/auth/verification", verificationToken);
      return response.data
        ? format<VerificationToken>(response.data)
        : response.data;
    },
    useVerificationToken: async (params: {
      identifier: string;
      token: string;
    }) => {
      const response = await api.patch(`/auth/verification`, params);
      return response.data
        ? format<VerificationToken>(response.data)
        : response.data;
    },
  };
}

function format<T>(obj: Record<string, unknown>): T {
  return Object.entries(obj).reduce((result, [key, value]) => {
    const newResult = result;

    if (value === null) {
      return newResult;
    }

    if (isDate(value)) {
      newResult[key] = new Date(value);
    } else {
      newResult[key] = value;
    }

    return newResult;
  }, {} as Record<string, unknown>) as T;
}

const isDate = (value: unknown): value is string =>
  typeof value === "string"
    ? new Date(value).toString() !== "Invalid Date" &&
      !Number.isNaN(Date.parse(value))
    : false;
