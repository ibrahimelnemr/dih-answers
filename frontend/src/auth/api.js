import BACKEND_URL from "../data/Data";

function getCookie(name) {
  const cookieValue = `; ${document.cookie}`;
  const parts = cookieValue.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(";").shift();
  }
  return "";
}

async function request(path, options = {}) {
  const method = (options.method || "GET").toUpperCase();
  const csrfToken = getCookie("csrftoken");
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (["POST", "PUT", "PATCH", "DELETE"].includes(method) && csrfToken) {
    headers["X-CSRFToken"] = csrfToken;
  }

  const response = await fetch(`${BACKEND_URL}${path}`, {
    credentials: "include",
    headers,
    ...options,
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    const message = data.detail || data.non_field_errors?.[0] || data.username?.[0] || "Request failed";
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function ensureCsrfToken() {
  return request("/auth/csrf");
}

export function register({ username, email, password }) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ username, email, password }),
  });
}

export function login({ username, password }) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export function logout() {
  return request("/auth/logout", {
    method: "POST",
  });
}

export function me() {
  return request("/auth/me");
}

export async function checkBackendHealth() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch(`${BACKEND_URL}/health`, { signal: controller.signal });
    return res.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timeoutId);
  }
}
