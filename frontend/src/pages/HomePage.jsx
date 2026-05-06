import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { fetchCategoryTree, fetchLeaderboard } from "../api/qa";

const CATEGORY_ICONS = {
  general: "💬",
  office: "🏢",
  customer: "👥",
  internal: "🔧",
  cloud: "☁️",
  "ai-data": "🤖",
};

function TopicCard({ category }) {
  const icon = CATEGORY_ICONS[category.slug] || "📂";
  const childCount = category.children ? category.children.length : 0;

  return (
    <Link
      to={`/questions?category=${category.slug}`}
      className="block bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-md transition-all group"
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">{icon}</span>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-blue-700 group-hover:text-blue-800 mb-1">
            {category.name}
          </h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {category.description || "Explore questions in this topic."}
          </p>
          {childCount > 0 && (
            <div className="text-xs text-gray-400 mb-2">
              {childCount} subtopic{childCount !== 1 ? "s" : ""}
            </div>
          )}
          {category.patrons && category.patrons.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap">
              <span className="text-xs text-amber-600 font-medium">🏅 Patrons:</span>
              {category.patrons.map((p) => (
                <span
                  key={p.username}
                  className="inline-block text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200"
                >
                  {p.username}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

function LeaderboardRow({ profile, rank }) {
  const medals = ["🥇", "🥈", "🥉"];
  const rankDisplay = rank <= 3 ? medals[rank - 1] : `#${rank}`;

  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-3">
        <span className="text-sm font-bold w-8 text-center">{rankDisplay}</span>
        <div>
          <span className="text-sm font-semibold text-gray-800">{profile.username}</span>
          {profile.patron_categories && profile.patron_categories.length > 0 && (
            <span className="ml-2 text-xs text-amber-600">🏅 patron</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3 text-xs text-gray-500">
        <span title="Reputation" className="font-medium text-blue-600">{profile.reputation} rep</span>
        <span title="Questions asked">{profile.questions_count} Q</span>
        <span title="Answers given">{profile.answers_count} A</span>
        <span title="Votes received">⬆ {profile.votes_received}</span>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    fetchCategoryTree().then(setCategories).catch(console.error);
    fetchLeaderboard().then(setLeaderboard).catch(console.error);
  }, []);

  const topCategories = categories.filter(cat => !cat.parent_id);

  return (
    <div className="space-y-8">
      {/* Hero section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 text-white">
        <h1 className="text-2xl font-bold mb-2">DIH Answers</h1>
        <p className="text-blue-100 text-lg mb-4">
          Your team's knowledge base. Ask questions, share expertise, and help each other grow.
        </p>
        <div className="flex gap-3">
          <Link
            to="/questions"
            className="inline-block bg-white text-blue-700 font-medium px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Browse Questions
          </Link>
          <Link
            to="/ask"
            className="inline-block bg-blue-500 text-white font-medium px-4 py-2 rounded-lg hover:bg-blue-400 transition-colors border border-blue-400"
          >
            Ask a Question
          </Link>
        </div>
      </section>

      {/* Topics grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Topics</h2>
          <span className="text-sm text-gray-500">{topCategories.length} topics</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topCategories.map((category) => (
            <TopicCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* Leaderboard */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">🏆 Leaderboard</h2>
          <span className="text-sm text-gray-500">Top contributors</span>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          {leaderboard.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">No contributors yet.</p>
          ) : (
            <div>
              {leaderboard.slice(0, 10).map((profile, index) => (
                <LeaderboardRow key={profile.username} profile={profile} rank={index + 1} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
