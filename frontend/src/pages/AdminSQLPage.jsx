import { useState } from "react";

import { BACKEND_URL } from "../data/Data";

function getCookie(name) {
  const cookieValue = `; ${document.cookie}`;
  const parts = cookieValue.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(";").shift();
  }
  return "";
}

export default function AdminSQLPage() {
  const [sql, setSql] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleExecute(e) {
    e.preventDefault();
    if (!sql.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const csrfToken = getCookie("csrftoken");
      const response = await fetch(`${BACKEND_URL}/api/sql`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify({ sql: sql.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Query failed");
      } else {
        setResult(data);
      }
    } catch (err) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">SQL Console</h1>
        <p className="mt-1 text-sm text-gray-500">
          Execute SQL queries directly against the database. Admin access only.
        </p>
      </div>

      <form onSubmit={handleExecute} className="space-y-4">
        <div>
          <label htmlFor="sql" className="block text-sm font-medium text-gray-700 mb-1">
            SQL Query
          </label>
          <textarea
            id="sql"
            rows={8}
            value={sql}
            onChange={(e) => setSql(e.target.value)}
            placeholder="SELECT * FROM auth_user LIMIT 10;"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 font-mono text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !sql.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        >
          {loading ? "Executing..." : "Execute"}
        </button>
      </form>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700 font-mono whitespace-pre-wrap">{error}</p>
        </div>
      )}

      {result && (
        <div className="space-y-2">
          {result.message && (
            <p className="text-sm text-green-700 font-medium">{result.message}</p>
          )}
          {result.columns && result.columns.length > 0 && (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {result.columns.map((col) => (
                      <th
                        key={col}
                        className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {result.rows.map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      {row.map((cell, j) => (
                        <td key={j} className="px-4 py-2 text-sm text-gray-700 font-mono whitespace-nowrap">
                          {cell === null ? <span className="text-gray-400 italic">NULL</span> : String(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
                {result.row_count} row(s) returned
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
