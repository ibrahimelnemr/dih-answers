import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { fetchUserProfile } from "../api/qa";

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function UserProfilePage() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    fetchUserProfile(username)
      .then(setProfile)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 dark:text-gray-400 text-lg">{error}</p>
        <Link to="/" className="text-brand-600 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 text-sm mt-2 inline-block">
          ← Back to home
        </Link>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <nav className="mb-4">
        <Link to="/" className="text-sm text-brand-600 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 transition-colors">
          ← Back
        </Link>
      </nav>

      {/* Profile header */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-2xl font-bold shrink-0">
            {profile.username[0].toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{profile.username}</h1>
            {profile.bio && <p className="text-gray-500 dark:text-gray-400 mt-1">{profile.bio}</p>}
            <div className="flex items-center gap-6 mt-3">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900 dark:text-white">{profile.reputation}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Reputation</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900 dark:text-white">{profile.questions_count}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Questions</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900 dark:text-white">{profile.answers_count}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Answers</div>
              </div>
            </div>
          </div>
        </div>

        {/* Patron categories */}
        {profile.patron_categories?.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Patron of</h3>
            <div className="flex flex-wrap gap-2">
              {profile.patron_categories.map((cat) => (
                <span
                  key={cat.id}
                  className="px-3 py-1 text-xs font-medium rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
                >
                  {cat.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Questions */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Questions</h2>
        {profile.questions?.length > 0 ? (
          <div className="space-y-2">
            {profile.questions.map((q) => (
              <Link
                key={q.id}
                to={`/questions/${q.id}`}
                className="block bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-3 hover:border-brand-300 dark:hover:border-brand-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{q.title}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    q.status === "open" ? "bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                  }`}>
                    {q.status}
                  </span>
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500 mt-1 block">{timeAgo(q.created_at)}</span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 dark:text-gray-500">No questions yet.</p>
        )}
      </div>

      {/* Answers */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Answers</h2>
        {profile.answers?.length > 0 ? (
          <div className="space-y-2">
            {profile.answers.map((a) => (
              <Link
                key={a.id}
                to={`/questions/${a.question__id}`}
                className="block bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-3 hover:border-brand-300 dark:hover:border-brand-700 transition-colors"
              >
                <div className="flex items-center gap-2">
                  {a.is_accepted && (
                    <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20 px-2 py-0.5 rounded-full">✓ Accepted</span>
                  )}
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{a.question__title}</span>
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500 mt-1 block">{timeAgo(a.created_at)}</span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 dark:text-gray-500">No answers yet.</p>
        )}
      </div>
    </div>
  );
}
