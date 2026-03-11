const DEFAULT_BASE_URL = "https://jobnative-digital-api-production.up.railway.app/";

function normalizeBaseUrl(url) {
  return url.endsWith("/") ? url : `${url}/`;
}

const BASE_URL = normalizeBaseUrl(
  import.meta.env.VITE_API_BASE_URL || DEFAULT_BASE_URL,
);

async function request(path, options = {}) {
  const { body, headers: customHeaders, token, ...fetchOptions } = options;
  const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;
  const headers = {
    Accept: "application/json",
    ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
    ...(customHeaders || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    ...fetchOptions,
    body: body === undefined ? undefined : JSON.stringify(body),
    headers,
  });

  if (!res.ok) {
    const errorBody = await safeJson(res);
    const message =
      (typeof errorBody === "object" && errorBody?.message) ||
      res.statusText ||
      "Request failed.";
    const error = new Error(message);
    error.status = res.status;
    error.body = errorBody;
    throw error;
  }

  return safeJson(res);
}

async function safeJson(res) {
  const text = await res.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export const httpClient = {
  del: (path, options = {}) => request(path, { ...options, method: "DELETE" }),
  get: (path, options = {}) => request(path, { ...options, method: "GET" }),
  patch: (path, body, options = {}) =>
    request(path, { ...options, body, method: "PATCH" }),
  post: (path, body, options = {}) =>
    request(path, { ...options, body, method: "POST" }),
  put: (path, body, options = {}) =>
    request(path, { ...options, body, method: "PUT" }),
};
