import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { fetchCategoryTree, fetchLeaderboard, togglePatron } from "../api/qa";
import { useAuth } from "../auth/AuthContext";

const CATEGORY_ICONS = {
  customer: "👥",
  internal: "🔧",
  cloud: "☁️",
  "ai-and-data": "🤖",
};

function PatronBadge({ topic, currentUser, onToggle }) {
  const isPatron = topic.patrons?.some((p) => p.username === currentUser?.username);
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onToggle(topic.id); }}
      className={`shrink-0 px-2 py-0.5 text-xs font-medium rounded-full border transition-all ${
        isPatron
          ? "bg-brand-50 text-brand-700 border-brand-300 hover:bg-brand-100 dark:bg-brand-900/30 dark:text-brand-400 dark:border-brand-600"
          : "bg-gray-50 text-gray-400 border-gray-200 hover:border-brand-300 hover:text-brand-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-500"
      }`}
      title={isPatron ? "Leave as patron" : "Become a patron"}
    >
      {isPatron ? "★" : "☆"}
    </button>
  );
}

function CategoryCard({ category, currentUser, onTogglePatron }) {
  const [expanded, setExpanded] = useState(false);
  const icon = CATEGORY_ICONS[category.slug] || "📂";

  return (
    <div className="animate-fadeIn bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 hover:shadow-md dark:hover:shadow-brand-900/10 transition-all">
      <div className="flex items-start justify-between mb-2">
        <Link
          to={`/questions?category=${category.slug}`}
          className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
        >
          <span className="text-xl">{icon}</span>
          {category.name}
        </Link>
        {category.children?.length > 0 && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-brand-600 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 font-medium shrink-0"
          >
            {expanded ? "Collapse" : `${category.children.length} areas ▾`}
          </button>
        )}
      </div>

      {category.description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{category.description}</p>
      )}

      {/* Collapsed: show specialization chips */}
      {!expanded && category.children?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {category.children.map((child) => (
            <Link
              key={child.id}
              to={`/questions?category=${child.slug}`}
              className="px-2.5 py-1 text-xs rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
            >
              {child.name}
            </Link>
          ))}
        </div>
      )}

      {/* Expanded: show specializations with their leaf topics */}
      {expanded && category.children?.map((spec) => (
        <div key={spec.id} className="mt-3 first:mt-2">
          <Link
            to={`/questions?category=${spec.slug}`}
            className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
          >
            {spec.name}
          </Link>
          {spec.children?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1.5 ml-2">
              {spec.children.map((topic) => (
                <span key={topic.id} className="inline-flex items-center gap-1">
                  <Link
                    to={`/questions?category=${topic.slug}`}
                    className="px-2 py-0.5 text-xs rounded bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                  >
                    {topic.name}
                  </Link>
                  <PatronBadge topic={topic} currentUser={currentUser} onToggle={onTogglePatron} />
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    Promise.all([fetchCategoryTree(), fetchLeaderboard()])
      .then(([cats, lb]) => {
        setCategories(cats);
        setLeaderboard(lb);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTogglePatron = async (categoryId) => {
    try {
      await togglePatron(categoryId);
      const cats = await fetchCategoryTree();
      setCategories(cats);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="bg-gradient-to-r from-brand-600 to-brand-800 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome to DIH Champions</h1>
        <p className="text-brand-100 text-lg mb-4">
          Ask questions, share knowledge, and become a patron of your expertise areas.
        </p>
        <div className="flex gap-3">
          <Link
            to="/ask"
            className="px-5 py-2.5 bg-white text-brand-700 font-semibold rounded-lg hover:bg-brand-50 transition-colors"
          >
            Ask a Question
          </Link>
          <Link
            to="/questions"
            className="px-5 py-2.5 bg-brand-500/30 text-white font-semibold rounded-lg hover:bg-brand-500/50 transition-colors border border-brand-400"
          >
            Browse Questions
          </Link>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Categories */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Explore Categories</h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">{categories.length} categories</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((cat) => (
              <CategoryCard
                key={cat.id}
                category={cat}
                currentUser={user}
                onTogglePatron={handleTogglePatron}
              />
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">🏆 Leaderboard</h2>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
            {leaderboard.length === 0 ? (
              <p className="p-4 text-sm text-gray-400 dark:text-gray-500">No users yet.</p>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {leaderboard.slice(0, 10).map((entry, index) => (
                  <Link
                    key={entry.username}
                    to={`/users/${entry.username}`}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0 ? "bg-amber-100 text-amber-700" :
                      index === 1 ? "bg-gray-200 text-gray-700" :
                      index === 2 ? "bg-orange-100 text-orange-700" :
                      "bg-gray-100 text-gray-500"
                    }`}>
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 dark:text-white truncate">{entry.username}</div>
                      {entry.patron_categories?.length > 0 && (
                        <div className="text-xs text-amber-600 truncate">
                          🏅 {entry.patron_categories.join(", ")}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-900 dark:text-white">{entry.reputation}</div>
                      <div className="text-xs text-gray-400 dark:text-gray-500">rep</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
