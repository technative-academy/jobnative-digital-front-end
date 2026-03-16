import { httpClient } from "./httpClient";

export const eventsService = {
  getAll: () => httpClient.get("api/events"),
  getById: (id) => httpClient.get(`api/events/${id}`),
  create: (payload) => httpClient.post("api/events", payload),
  update: (id, payload) => httpClient.put(`api/events/${id}`, payload),
  delete: (id) => httpClient.del(`api/events/${id}`),
};
