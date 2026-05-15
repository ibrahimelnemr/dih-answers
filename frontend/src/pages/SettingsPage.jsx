import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  fetchCategoryTree,
  fetchUserProfile,
  togglePatron,
  updateMyProfile,
} from "../api/qa";
import { useAuth } from "../auth/AuthContext";

export default function SettingsPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", bio: "" });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([fetchUserProfile(user.username), fetchCategoryTree()])
      .then(([prof, cats]) => {
        setProfile(prof);
        setCategories(cats);
        setForm({
          first_name: user.first_name || "",
          last_name: user.last_name || "",
          email: user.email || "",
          bio: prof.bio || "",
        });
      })
      .finally(() => setLoading(false));
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      await updateMyProfile(form);
      setMessage("Profile updated.");
    } catch (err) {
      setMessage(err.message || "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePatron = async (categoryId) => {
    try {
      await togglePatron(categoryId);
      // Refresh profile and category tree to reflect changes
      const [prof, cats] = await Promise.all([
        fetchUserProfile(user.username),
        fetchCategoryTree(),
      ]);
      setProfile(prof);
      setCategories(cats);
    } catch (err) {
      setMessage(err.message || "Failed to toggle patron.");
    }
  };

  // Collect all patron category IDs from the user's profile
  const patronCategoryIds = new Set(
    (profile?.patron_categories || []).map((c) => c.id)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <Link
          to={`/users/${user.username}`}
          className="text-sm text-brand-600 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300"
        >
          View public profile →
        </Link>
      </div>

      {/* Profile form */}
      <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profile Information</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                First Name
              </label>
              <input
                id="first_name"
                type="text"
                value={form.first_name}
                onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>
            <div>
              <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Last Name
              </label>
              <input
                id="last_name"
                type="text"
                value={form.last_name}
                onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Bio
            </label>
            <textarea
              id="bio"
              rows={3}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              placeholder="Tell others about your expertise..."
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 disabled:opacity-50 transition-colors"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            {message && (
              <span className={`text-sm ${message.includes("updated") ? "text-brand-600 dark:text-brand-400" : "text-red-600 dark:text-red-400"}`}>
                {message}
              </span>
            )}
          </div>
        </form>
      </section>

      {/* Patron categories */}
      <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Patron Topics</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Choose specific topics you are an expert in. As a patron, you will be notified when new questions are posted in your areas.
        </p>

        {categories.map((offering) => (
          <div key={offering.id} className="mb-5 last:mb-0">
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-1.5">
              {offering.name}
            </h3>
            {offering.children?.map((spec) => (
              <div key={spec.id} className="ml-3 mb-3 last:mb-0">
                <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">{spec.name}</h4>
                <div className="flex flex-wrap gap-1.5 ml-2">
                  {spec.children?.map((topic) => {
                    const isPatron = patronCategoryIds.has(topic.id);
                    return (
                      <button
                        key={topic.id}
                        type="button"
                        onClick={() => handleTogglePatron(topic.id)}
                        className={`px-2.5 py-1 text-xs rounded-lg border transition-all ${
                          isPatron
                            ? "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/30 font-medium"
                            : "bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-700 hover:text-brand-600 dark:hover:text-brand-400"
                        }`}
                      >
                        {isPatron ? "★" : "☆"} {topic.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ))}
      </section>
    </div>
  );
}
