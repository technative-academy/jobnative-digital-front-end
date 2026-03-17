import { httpClient } from "./httpClient";

export const eventsService = {
  getAll: () => httpClient.get("api/events"),
  getById: (id) => httpClient.get(`api/events/${id}`),
  create: (payload) => httpClient.post("api/events", payload),
  update: (id, payload) => httpClient.patch(`api/events/${id}`, payload),
  delete: (id) => httpClient.del(`api/events/${id}`),
  getPending: () => httpClient.get("api/admin/events/pending"),
  approve: (id) => httpClient.patch(`api/admin/events/${id}/approve`),
  reject: (id) => httpClient.patch(`api/admin/events/${id}/reject`),
};
