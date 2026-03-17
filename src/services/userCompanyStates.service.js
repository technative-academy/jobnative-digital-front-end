import { httpClient } from "./httpClient";

export const userCompanyStatesService = {
  list: () => httpClient.get("api/user-company-states"),
  getByCompanyId: (companyId) =>
    httpClient.get(`api/user-company-states/${companyId}`),
  upsert: (companyId, payload) =>
    httpClient.put(`api/user-company-states/${companyId}`, payload),
  delete: (companyId) => httpClient.del(`api/user-company-states/${companyId}`),
};
