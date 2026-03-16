import { httpClient } from "./httpClient";

export const commentsService = {
  getAll: (companyId) => httpClient.get(`api/companies/${companyId}/comments`),
  create: (companyId, payload) => httpClient.post(`api/companies/${companyId}/comments`, payload),
  update: (commentId, payload) => httpClient.patch(`api/comments/${commentId}`, payload),
  delete: (commentId, payload) => httpClient.del(`api/comments/${commentId}`, { body: payload }),
};