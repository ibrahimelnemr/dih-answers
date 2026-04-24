import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { fetchCategoryTree, fetchQuestions, fetchTags } from "../api/qa";

function CategoryNode({ category, selectedSlug, onSelect, depth = 0 }) {
  const [expanded, setExpanded] = useState(depth === 0);
  const hasChildren = category.children?.length > 0;
  const isSelected = selectedSlug === category.slug;
  const isAncestor = selectedSlug?.startsWith(category.slug + ".");

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          if (hasChildren) setExpanded(!expanded);
          onSelect(isSelected ? null : category.slug);
        }}
        className={`w-full text-left px-3 py-1.5 text-sm rounded-md flex items-center gap-1.5 transition-colors ${
          isSelected
            ? "bg-blue-50 text-blue-700 font-medium"
            : isAncestor
            ? "text-blue-600"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        }`}
        style={{ paddingLeft: `${depth * 16 + 12}px` }}
      >
        {hasChildren && (
          <svg
            className={`w-3.5 h-3.5 shrink-0 transition-transform ${expanded ? "rotate-90" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        )}
        {!hasChildren && <span className="w-3.5" />}
        <span className="truncate">{category.name}</span>
      </button>
      {expanded && hasChildren && (
        <div>
          {category.children.map((child) => (
            <CategoryNode
              key={child.id}
              category={child}
              selectedSlug={selectedSlug}
              onSelect={onSelect}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function QuestionCard({ question }) {
  const hasAccepted = question.answers?.some((a) => a.is_accepted);

  return (
    <Link
      to={`/questions/${question.id}`}
      className="block bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all group"
    >
      <div className="flex gap-4">
        <div className="flex flex-col items-center gap-2 text-center min-w-[60px]">
          <div className="text-sm">
            <span className="font-semibold text-gray-900">{question.vote_count ?? 0}</span>
            <p className="text-xs text-gray-500">votes</p>
          </div>
          <div className={`text-sm px-2 py-0.5 rounded ${
            hasAccepted
              ? "bg-green-100 text-green-700 border border-green-200"
              : question.answer_count > 0
              ? "bg-gray-100 text-gray-700"
              : "text-gray-400"
          }`}>
            <span className="font-semibold">{question.answer_count ?? 0}</span>
            <p className="text-xs">{question.answer_count === 1 ? "answer" : "answers"}</p>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-blue-700 group-hover:text-blue-800 mb-1 line-clamp-2">
            {question.title}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2 mb-3">{question.body}</p>

          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              {question.category && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {question.category.full_path}
                </span>
              )}
              {question.tags?.map((tag) => (
                <span
                  key={tag.id}
                  className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-600"
                >
                  {tag.name}
                </span>
              ))}
            </div>
            <span className="text-xs text-gray-400">by {question.created_by}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function QuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [categoryTree, setCategoryTree] = useState([]);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategoryTree()
      .then(setCategoryTree)
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    setLoading(true);
    setError("");
    fetchQuestions({ q: query, categorySlug: selectedCategorySlug })
      .then(setQuestions)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [query, selectedCategorySlug]);

  return (
    <div className="flex gap-8">
      {/* Category sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-24">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Categories</h3>
            <button
              type="button"
              onClick={() => setSelectedCategorySlug(null)}
              className={`w-full text-left px-3 py-1.5 text-sm rounded-md mb-1 transition-colors ${
                !selectedCategorySlug
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              All Questions
            </button>
            {categoryTree.map((cat) => (
              <CategoryNode
                key={cat.id}
                category={cat}
                selectedSlug={selectedCategorySlug}
                onSelect={setSelectedCategorySlug}
              />
            ))}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Questions</h1>
            <p className="text-sm text-gray-500 mt-0.5">Browse questions or ask your own</p>
          </div>
          <Link
            to="/ask"
            className="inline-flex items-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
          >
            Ask a Question
          </Link>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search questions..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Mobile category selector */}
        <div className="lg:hidden mb-4">
          <select
            value={selectedCategorySlug || ""}
            onChange={(e) => setSelectedCategorySlug(e.target.value || null)}
            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
          >
            <option value="">All Categories</option>
            {categoryTree.map((cat) => (
              <optgroup key={cat.id} label={cat.name}>
                {cat.children?.map((child) => (
                  <option key={child.id} value={child.slug}>
                    {child.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {error && (
          <p className="text-red-600 text-sm bg-red-50 border border-red-100 rounded-lg px-4 py-2 mb-4">
            {error}
          </p>
        )}

        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full" />
          </div>
        )}

        {!loading && questions.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">No questions found</p>
            <p className="text-gray-400 text-sm mt-1">Be the first to ask one!</p>
          </div>
        )}

        <div className="space-y-3">
          {questions.map((question) => (
            <QuestionCard key={question.id} question={question} />
          ))}
        </div>
      </div>
    </div>
  );
}
