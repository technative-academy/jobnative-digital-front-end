import { httpClient } from "./httpClient";

export const authService = {
  login: (payload) => httpClient.post("auth/login", payload),
  logout: (refreshToken) => httpClient.post("auth/logout", { refreshToken }),
  me: (accessToken) => httpClient.get("auth/me", { token: accessToken }),
  refresh: (refreshToken) => httpClient.post("auth/refresh", { refreshToken }),
  register: (payload) => httpClient.post("auth/register", payload),
};
