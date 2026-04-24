import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, vi } from "vitest";

import QuestionsPage from "../pages/QuestionsPage";

const mockCategories = [
  {
    id: 1,
    name: "Customer",
    slug: "customer",
    is_leaf: false,
    is_active: true,
    full_path: "Customer",
    depth: 0,
    children: [
      { id: 2, name: "Fullstack Development", slug: "customer.fullstack-development", is_leaf: true, is_active: true, full_path: "Customer / Fullstack Development", depth: 1, children: [] },
    ],
  },
];

const mockQuestions = [
  {
    id: 1,
    title: "Power BI help",
    body: "Need charts",
    tags: [],
    category: { id: 2, name: "Fullstack Development", slug: "customer.fullstack-development", full_path: "Customer / Fullstack Development" },
    answers: [],
    comments: [],
    created_by: "owner",
    vote_count: 0,
    has_upvoted: false,
    answer_count: 0,
  },
];

vi.mock("../api/qa", () => ({
  fetchCategoryTree: vi.fn(() => Promise.resolve(mockCategories)),
  fetchQuestions: vi.fn(() => Promise.resolve(mockQuestions)),
  fetchTags: vi.fn(() => Promise.resolve([])),
}));

vi.mock("../auth/AuthContext", () => ({
  useAuth: () => ({ user: { username: "owner" } }),
}));

describe("QuestionsPage", () => {
  it("renders questions and category sidebar", async () => {
    render(
      <MemoryRouter>
        <QuestionsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Power BI help")).toBeInTheDocument();
    });

    expect(screen.getByText("Customer")).toBeInTheDocument();
  });
});
