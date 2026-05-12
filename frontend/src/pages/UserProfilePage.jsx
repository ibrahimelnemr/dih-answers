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
        <div className="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">{error}</p>
        <Link to="/" className="text-blue-600 hover:text-blue-800 text-sm mt-2 inline-block">
          ← Back to home
        </Link>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <nav className="mb-4">
        <Link to="/" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
          ← Back
        </Link>
      </nav>

      {/* Profile header */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shrink-0">
            {profile.username[0].toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{profile.username}</h1>
            {profile.bio && <p className="text-gray-500 mt-1">{profile.bio}</p>}
            <div className="flex items-center gap-6 mt-3">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">{profile.reputation}</div>
                <div className="text-xs text-gray-500">Reputation</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">{profile.questions_count}</div>
                <div className="text-xs text-gray-500">Questions</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">{profile.answers_count}</div>
                <div className="text-xs text-gray-500">Answers</div>
              </div>
            </div>
          </div>
        </div>

        {/* Patron categories */}
        {profile.patron_categories?.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Patron of</h3>
            <div className="flex flex-wrap gap-2">
              {profile.patron_categories.map((cat) => (
                <span
                  key={cat.id}
                  className="px-3 py-1 text-xs font-medium rounded-full bg-amber-50 text-amber-700 border border-amber-200"
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
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Questions</h2>
        {profile.questions?.length > 0 ? (
          <div className="space-y-2">
            {profile.questions.map((q) => (
              <Link
                key={q.id}
                to={`/questions/${q.id}`}
                className="block bg-white border border-gray-200 rounded-lg px-4 py-3 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{q.title}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    q.status === "open" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"
                  }`}>
                    {q.status}
                  </span>
                </div>
                <span className="text-xs text-gray-400 mt-1 block">{timeAgo(q.created_at)}</span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">No questions yet.</p>
        )}
      </div>

      {/* Answers */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Answers</h2>
        {profile.answers?.length > 0 ? (
          <div className="space-y-2">
            {profile.answers.map((a) => (
              <Link
                key={a.id}
                to={`/questions/${a.question__id}`}
                className="block bg-white border border-gray-200 rounded-lg px-4 py-3 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-center gap-2">
                  {a.is_accepted && (
                    <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">✓ Accepted</span>
                  )}
                  <span className="text-sm font-medium text-gray-900">{a.question__title}</span>
                </div>
                <span className="text-xs text-gray-400 mt-1 block">{timeAgo(a.created_at)}</span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">No answers yet.</p>
        )}
      </div>
    </div>
  );
}
