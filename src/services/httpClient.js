const BASE_URL = import.meta.env.VITE_API_URL;

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    const errorBody = await safeJson(res);
    const message = errorBody?.message || res.statusText;
    throw new Error(message);
  }

  return safeJson(res);
}

async function safeJson(res) {
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

export const httpClient = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: "POST", body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: "PUT", body: JSON.stringify(body) }),
  patch: (path, body) => request(path, { method: "PATCH", body: JSON.stringify(body) }),
  del: (path) => request(path, { method: "DELETE" }),
};