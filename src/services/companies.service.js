import { httpClient } from './httpClient';

function buildQueryString(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, value);
    }
  });

  const queryString = searchParams.toString();

  return queryString ? `?${queryString}` : '';
}

export const companiesService = {
  getAll: (params = {}) =>
    httpClient.get(`api/companies${buildQueryString(params)}`),
  getById: (id) => httpClient.get(`api/companies/${id}`),
  create: (payload) => httpClient.post('api/companies', payload),
  update: (id, payload) => httpClient.patch(`api/companies/${id}`, payload),
  delete: (id) => httpClient.del(`api/companies/${id}`),
  getPending: () => httpClient.get('api/admin/companies/pending'),
  approve: (id) => httpClient.patch(`api/admin/companies/${id}/approve`),
  reject: (id) => httpClient.patch(`api/admin/companies/${id}/reject`),
};
