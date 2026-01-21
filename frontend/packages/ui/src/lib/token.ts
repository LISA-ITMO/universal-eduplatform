let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token ?? null;
};

export const getAccessToken = (): string | null => accessToken;
