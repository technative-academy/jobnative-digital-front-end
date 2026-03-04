import { httpClient } from "./httpClient";

export const companiesService = {
    getAll: () => httpClient.get("api/companies"),
    getById: (id) => httpClient.get(`api/companies/${id}`),
    create: (payload) => httpClient.post("api/companies", payload),
    update: (id, payload) => httpClient.put(`api/companies/${id}`, payload),
    delete: (id) => httpClient.del(`api/companies/${id}`, payload)
}