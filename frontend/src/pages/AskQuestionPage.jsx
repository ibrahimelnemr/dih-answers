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
  const [isAnonymous, setIsAnonymous] = useState(false);
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
      const payload = { title, body, is_anonymous: isAnonymous };
      if (selectedCategoryId) payload.category_id = Number(selectedCategoryId);
      if (selectedTags.length) payload.tag_ids = selectedTags;
      await createQuestion(payload);
      navigate("/questions");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Ask a Question</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Get help from the community</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
          <label htmlFor="title" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Title
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Be specific and imagine you're asking another person</p>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. How to configure Spring Boot with PostgreSQL?"
            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
          <label htmlFor="body" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Body
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Include all the information someone would need to answer your question</p>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={8}
            placeholder="Describe your problem in detail..."
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-y"
          />
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
          <label htmlFor="category" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Category
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Choose the most specific category for your question</p>
          <select
            id="category"
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
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
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Tags</label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Add tags to help others find your question (optional)</p>
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
                        ? "bg-brand-50 dark:bg-brand-900/20 border-brand-300 dark:border-brand-700 text-brand-700 dark:text-brand-400"
                        : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"
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
          <p className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-lg px-4 py-2">
            {error}
          </p>
        )}

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-brand-600 focus:ring-brand-500"
            />
            <div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">Post anonymously</span>
              <p className="text-xs text-gray-500 dark:text-gray-400">Your name will not be shown with this question</p>
            </div>
          </label>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors shadow-sm"
          >
            {loading ? "Posting..." : "Post Question"}
          </button>
        </div>
      </form>
    </div>
  );
}
