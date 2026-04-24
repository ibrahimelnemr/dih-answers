import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { createQuestion, fetchCategories, fetchTags } from "../api/qa";

export default function AskQuestionPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories().then(setCategories).catch((err) => setError(err.message));
    fetchTags().then(setTags).catch((err) => setError(err.message));
  }, []);

  const leafCategories = categories.filter((c) => c.is_leaf);
  const leafTags = tags.filter((t) => t.is_leaf && t.is_active);

  const toggleTag = (tagId) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!title.trim() || !body.trim()) {
      setError("Title and body are required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const payload = { title, body };
      if (selectedCategoryId) payload.category_id = Number(selectedCategoryId);
      if (selectedTags.length) payload.tag_ids = selectedTags;
      await createQuestion(payload);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Ask a Question</h1>
        <p className="text-sm text-gray-500 mt-1">Get help from the community</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-2">
            Title
          </label>
          <p className="text-xs text-gray-500 mb-2">Be specific and imagine you're asking another person</p>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. How to configure Spring Boot with PostgreSQL?"
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <label htmlFor="body" className="block text-sm font-semibold text-gray-900 mb-2">
            Body
          </label>
          <p className="text-xs text-gray-500 mb-2">Include all the information someone would need to answer your question</p>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={8}
            placeholder="Describe your problem in detail..."
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
          />
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <label htmlFor="category" className="block text-sm font-semibold text-gray-900 mb-2">
            Category
          </label>
          <p className="text-xs text-gray-500 mb-2">Choose the most specific category for your question</p>
          <select
            id="category"
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select a category (optional)</option>
            {leafCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.full_path}
              </option>
            ))}
          </select>
        </div>

        {leafTags.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">Tags</label>
            <p className="text-xs text-gray-500 mb-3">Add tags to help others find your question (optional)</p>
            <div className="flex flex-wrap gap-2">
              {leafTags.map((tag) => {
                const isSelected = selectedTags.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                      isSelected
                        ? "bg-blue-50 border-blue-300 text-blue-700"
                        : "bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    {tag.path || tag.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {error && (
          <p className="text-red-600 text-sm bg-red-50 border border-red-100 rounded-lg px-4 py-2">
            {error}
          </p>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors shadow-sm"
          >
            {loading ? "Posting..." : "Post Question"}
          </button>
        </div>
      </form>
    </div>
  );
}
