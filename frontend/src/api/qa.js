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
    const error = new Error(data.detail || "Request failed");
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function fetchTags() {
  return request("/tags");
}

export function fetchCategories() {
  return request("/categories");
}

export function fetchCategoryTree() {
  return request("/categories/tree");
}

export function fetchQuestions(params = {}) {
  const searchParams = new URLSearchParams();
  if (params.q) {
    searchParams.set("q", params.q);
  }
  if (params.tagIds?.length) {
    params.tagIds.forEach((id) => searchParams.append("tag_ids", id));
  }
  if (params.categorySlug) {
    searchParams.set("category_slug", params.categorySlug);
  }
  const query = searchParams.toString();
  return request(`/questions${query ? `?${query}` : ""}`);
}

export function fetchQuestion(id) {
  return request(`/questions/${id}`);
}

export function createQuestion(payload) {
  return request("/questions", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function createAnswer(questionId, body) {
  return request(`/questions/${questionId}/answers`, {
    method: "POST",
    body: JSON.stringify({ body }),
  });
}

export function acceptAnswer(questionId, answerId) {
  return request(`/questions/${questionId}/answers/${answerId}/accept`, {
    method: "POST",
  });
}

export function upvoteQuestion(questionId) {
  return request(`/questions/${questionId}/upvote`, {
    method: "POST",
  });
}

export function upvoteAnswer(answerId) {
  return request(`/answers/${answerId}/upvote`, {
    method: "POST",
  });
}

export function createQuestionComment(questionId, body) {
  return request(`/questions/${questionId}/comments`, {
    method: "POST",
    body: JSON.stringify({ body }),
  });
}

export function createAnswerComment(answerId, body) {
  return request(`/answers/${answerId}/comments`, {
    method: "POST",
    body: JSON.stringify({ body }),
  });
}
