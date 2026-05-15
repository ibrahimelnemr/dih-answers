import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  acceptAnswer,
  createAnswer,
  createAnswerComment,
  createQuestionComment,
  deleteQuestion,
  fetchQuestion,
  updateQuestion,
  upvoteAnswer,
  upvoteQuestion,
} from "../api/qa";
import { useAuth } from "../auth/AuthContext";

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

export default function QuestionDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answerBody, setAnswerBody] = useState("");
  const [answerAnonymous, setAnswerAnonymous] = useState(false);
  const [commentBody, setCommentBody] = useState("");
  const [answerComments, setAnswerComments] = useState({});
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");

  const reload = () => {
    setLoading(true);
    fetchQuestion(id)
      .then((data) => setQuestion(data))
      .catch(() => navigate("/"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    reload();
  }, [id]);

  const handleAnswerSubmit = async (event) => {
    event.preventDefault();
    if (!answerBody.trim()) return;
    setSubmittingAnswer(true);
    try {
      await createAnswer(id, answerBody, answerAnonymous);
      setAnswerBody("");
      setAnswerAnonymous(false);
      reload();
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmittingAnswer(false);
    }
  };

  const handleAccept = (answerId) => {
    acceptAnswer(id, answerId).then(() => reload());
  };

  const handleUpvoteAnswer = (answerId) => {
    upvoteAnswer(answerId)
      .then(() => reload())
      .catch((err) => alert(err.message));
  };

  const handleUpvoteQuestion = () => {
    upvoteQuestion(id)
      .then(() => reload())
      .catch((err) => alert(err.message));
  };

  const handleQuestionComment = (event) => {
    event.preventDefault();
    if (!commentBody.trim()) return;
    createQuestionComment(id, commentBody)
      .then((comment) => {
        setCommentBody("");
        setQuestion((current) => ({
          ...current,
          comments: [...current.comments, comment],
        }));
      })
      .catch((err) => alert(err.message));
  };

  const handleAnswerComment = (answerId) => (event) => {
    event.preventDefault();
    const body = answerComments[answerId];
    if (!body?.trim()) return;
    createAnswerComment(answerId, body)
      .then((comment) => {
        setAnswerComments((prev) => ({ ...prev, [answerId]: "" }));
        setQuestion((current) => ({
          ...current,
          answers: current.answers.map((answer) =>
            answer.id === answerId
              ? { ...answer, comments: [...(answer.comments || []), comment] }
              : answer
          ),
        }));
      })
      .catch((err) => alert(err.message));
  };

  const canAccept = user && question && user.username === question.created_by;
  const isOwner = user && question && (user.username === question.created_by || user.is_staff);

  const handleStartEdit = () => {
    setEditTitle(question.title);
    setEditBody(question.body);
    setEditing(true);
  };

  const handleSaveEdit = async () => {
    try {
      await updateQuestion(id, { title: editTitle, body: editBody });
      setEditing(false);
      reload();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this question? This cannot be undone.")) return;
    try {
      await deleteQuestion(id);
      navigate("/questions");
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

  if (!question) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 dark:text-gray-400 text-lg">Question not found.</p>
      </div>
    );
  }

  const sortedAnswers = [...(question.answers || [])].sort((a, b) => {
    if (a.is_accepted && !b.is_accepted) return -1;
    if (!a.is_accepted && b.is_accepted) return 1;
    return (b.vote_count || 0) - (a.vote_count || 0);
  });

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn">
      {/* Breadcrumb */}
      <nav className="mb-4">
        <Link to="/questions" className="text-sm text-brand-600 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 transition-colors">
          ← Back to Questions
        </Link>
      </nav>

      {/* Question */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 mb-6">
        <div className="flex gap-4">
          {/* Vote column */}
          <div className="flex flex-col items-center gap-1 pt-1">
            <button
              type="button"
              onClick={handleUpvoteQuestion}
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                question.has_upvoted
                  ? "bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              }`}
              title={question.has_upvoted ? "Already upvoted" : "Upvote"}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
              </svg>
            </button>
            <span className="text-lg font-bold text-gray-900 dark:text-white">{question.vote_count ?? 0}</span>
          </div>

          <div className="flex-1 min-w-0">
            {editing ? (
              <div className="space-y-3 animate-fadeIn">
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <textarea
                  value={editBody}
                  onChange={(e) => setEditBody(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 resize-y"
                />
                <div className="flex gap-2">
                  <button type="button" onClick={handleSaveEdit} className="px-4 py-1.5 bg-brand-600 text-white text-sm rounded-lg hover:bg-brand-700 transition-colors">Save</button>
                  <button type="button" onClick={() => setEditing(false)} className="px-4 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between gap-2">
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{question.title}</h1>
                  {isOwner && (
                    <div className="flex gap-1 shrink-0">
                      <button type="button" onClick={handleStartEdit} className="px-2.5 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">Edit</button>
                      <button type="button" onClick={handleDelete} className="px-2.5 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors">Delete</button>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <span>Asked by {question.created_by === "Anonymous" ? (
                    <span className="font-medium text-gray-700 dark:text-gray-300">Anonymous</span>
                  ) : (
                    <Link to={`/users/${question.created_by}`} className="font-medium text-brand-600 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300">{question.created_by}</Link>
                  )}</span>
                  <span>·</span>
                  <span>{timeAgo(question.created_at)}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    question.status === "open" ? "bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                  }`}>
                    {question.status}
                  </span>
                </div>

                <div className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-wrap">
                  {question.body}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {question.category && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 border border-brand-100 dark:border-brand-800">
                      {question.category.full_path}
                    </span>
                  )}
                  {question.tags?.map((tag) => (
                    <span
                      key={tag.id}
                      className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Question comments */}
        {question.comments?.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 ml-14">
            {question.comments.map((comment) => (
              <div key={comment.id} className="text-sm text-gray-600 dark:text-gray-400 py-1.5 border-b border-gray-50 dark:border-gray-800 last:border-0">
                {comment.body}
                <span className="text-gray-400 dark:text-gray-500 ml-2">– {comment.created_by}</span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-3 ml-14">
          <form onSubmit={handleQuestionComment} className="flex gap-2">
            <input
              value={commentBody}
              onChange={(e) => setCommentBody(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 px-3 py-1.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="px-3 py-1.5 text-sm text-brand-600 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 font-medium transition-colors"
            >
              Comment
            </button>
          </form>
        </div>
      </div>

      {/* Answers header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {question.answers?.length || 0} {question.answers?.length === 1 ? "Answer" : "Answers"}
        </h2>
      </div>

      {/* Answers */}
      <div className="space-y-4 mb-8">
        {sortedAnswers.map((answer) => (
          <div
            key={answer.id}
            className={`animate-fadeIn bg-white dark:bg-gray-900 border rounded-xl p-6 ${
              answer.is_accepted ? "border-brand-300 dark:border-brand-700 ring-1 ring-brand-100 dark:ring-brand-900/30" : "border-gray-200 dark:border-gray-800"
            }`}
          >
            <div className="flex gap-4">
              {/* Vote column */}
              <div className="flex flex-col items-center gap-1 pt-1">
                <button
                  type="button"
                  onClick={() => handleUpvoteAnswer(answer.id)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                    answer.has_upvoted
                      ? "bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <span className="text-lg font-bold text-gray-900 dark:text-white">{answer.vote_count ?? 0}</span>
                {answer.is_accepted && (
                  <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center" title="Accepted answer">
                    <svg className="w-5 h-5 text-brand-600 dark:text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
                {canAccept && !answer.is_accepted && (
                  <button
                    type="button"
                    onClick={() => handleAccept(answer.id)}
                    className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-400 hover:border-brand-400 hover:text-brand-500 transition-colors"
                    title="Accept this answer"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  {answer.is_accepted && (
                    <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20 px-2 py-0.5 rounded-full">
                      Accepted
                    </span>
                  )}
                </div>

                <div className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {answer.body}
                </div>

                <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                  Answered by {answer.created_by === "Anonymous" ? (
                    <span className="font-medium text-gray-700 dark:text-gray-300">Anonymous</span>
                  ) : (
                    <Link to={`/users/${answer.created_by}`} className="font-medium text-brand-600 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300">{answer.created_by}</Link>
                  )}
                  {answer.created_at && <span> · {timeAgo(answer.created_at)}</span>}
                </div>

                {/* Answer comments */}
                {answer.comments?.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                    {answer.comments.map((comment) => (
                      <div key={comment.id} className="text-sm text-gray-600 dark:text-gray-400 py-1.5 border-b border-gray-50 dark:border-gray-800 last:border-0">
                        {comment.body}
                        <span className="text-gray-400 dark:text-gray-500 ml-2">– {comment.created_by}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-2">
                  <form onSubmit={handleAnswerComment(answer.id)} className="flex gap-2">
                    <input
                      value={answerComments[answer.id] || ""}
                      onChange={(e) =>
                        setAnswerComments((prev) => ({ ...prev, [answer.id]: e.target.value }))
                      }
                      placeholder="Add a comment..."
                      className="flex-1 px-3 py-1.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 text-sm text-brand-600 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 font-medium transition-colors"
                    >
                      Comment
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Answer form */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Answer</h3>
        <form onSubmit={handleAnswerSubmit}>
          <textarea
            value={answerBody}
            onChange={(e) => setAnswerBody(e.target.value)}
            rows={6}
            placeholder="Write your answer here..."
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-y"
          />
          <div className="mt-3 flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={answerAnonymous}
                onChange={(e) => setAnswerAnonymous(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-brand-600 focus:ring-brand-500"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">Post anonymously</span>
            </label>
            <button
              type="submit"
              disabled={submittingAnswer || !answerBody.trim()}
              className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors"
            >
              {submittingAnswer ? "Posting..." : "Post Your Answer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
