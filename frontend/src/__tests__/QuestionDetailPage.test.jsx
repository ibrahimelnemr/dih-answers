import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { Route, MemoryRouter, Routes } from "react-router-dom";
import { describe, expect, vi } from "vitest";

import QuestionDetailPage from "../pages/QuestionDetailPage";

const mockQuestion = {
  id: 1,
  title: "Power BI question",
  body: "Need help",
  status: "open",
  created_by: "owner",
  category: { id: 1, name: "Customer", slug: "customer", full_path: "Customer" },
  tags: [],
  answers: [
    { id: 2, body: "Answer text", created_by: "owner2", is_accepted: false, vote_count: 0, has_upvoted: false, comments: [], created_at: new Date().toISOString() },
  ],
  comments: [],
  vote_count: 3,
  has_upvoted: false,
  answer_count: 1,
  created_at: new Date().toISOString(),
};

vi.mock("../api/qa", () => ({
  fetchQuestion: vi.fn(() => Promise.resolve(mockQuestion)),
  createAnswer: vi.fn(),
  acceptAnswer: vi.fn(),
  upvoteAnswer: vi.fn(),
  upvoteQuestion: vi.fn(),
  createQuestionComment: vi.fn(),
  createAnswerComment: vi.fn(),
}));

vi.mock("../auth/AuthContext", () => ({
  useAuth: () => ({ user: { username: "owner" } }),
}));

describe("QuestionDetailPage", () => {
  it("renders details and answers", async () => {
    render(
      <MemoryRouter initialEntries={["/questions/1"]}>
        <Routes>
          <Route path="/questions/:id" element={<QuestionDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Power BI question")).toBeInTheDocument();
      expect(screen.getByText("Answer text")).toBeInTheDocument();
    });
  });
});
