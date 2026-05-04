import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { fetchCategoryTree, fetchLeaderboard } from "../api/qa";

function TopicCard({ category }) {
  return (
    <Link
      to={`/questions?category=${category.slug}`}
      className="block bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-md transition-all group"
    >
      <h3 className="text-lg font-semibold text-blue-700 group-hover:text-blue-800 mb-2">
        {category.name}
      </h3>
      <p className="text-sm text-gray-600 mb-4">{category.description || "Explore questions in this topic."}</p>
      {category.patrons && category.patrons.length > 0 && (
        <div className="text-xs text-gray-500">
          Patrons: {category.patrons.map(p => p.username).join(", ")}
        </div>
      )}
    </Link>
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
      <section className="card">
        <h2>Welcome to DIH Answers</h2>
        <p>
          A knowledge base platform for the company. Ask questions, share knowledge, and compete on the leaderboard.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Topics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topCategories.map((category) => (
            <TopicCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Leaderboard</h2>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="space-y-2">
            {leaderboard.slice(0, 10).map((profile, index) => (
              <div key={profile.username} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                  <span className="text-sm font-medium">{profile.username}</span>
                </div>
                <div className="text-sm text-gray-600">
                  {profile.reputation} rep • {profile.questions_count} Q • {profile.answers_count} A
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
