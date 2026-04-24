import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  acceptAnswer,
  createAnswer,
  createAnswerComment,
  createQuestionComment,
  fetchQuestion,
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
  const [commentBody, setCommentBody] = useState("");
  const [answerComments, setAnswerComments] = useState({});
  const [submittingAnswer, setSubmittingAnswer] = useState(false);

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
      await createAnswer(id, answerBody);
      setAnswerBody("");
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full" />
      </div>
    );
  }

  if (!question) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">Question not found.</p>
      </div>
    );
  }

  const sortedAnswers = [...(question.answers || [])].sort((a, b) => {
    if (a.is_accepted && !b.is_accepted) return -1;
    if (!a.is_accepted && b.is_accepted) return 1;
    return (b.vote_count || 0) - (a.vote_count || 0);
  });

  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <nav className="mb-4">
        <Link to="/" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
          ← Back to Questions
        </Link>
      </nav>

      {/* Question */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <div className="flex gap-4">
          {/* Vote column */}
          <div className="flex flex-col items-center gap-1 pt-1">
            <button
              type="button"
              onClick={handleUpvoteQuestion}
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                question.has_upvoted
                  ? "bg-blue-100 text-blue-600"
                  : "hover:bg-gray-100 text-gray-400 hover:text-gray-600"
              }`}
              title={question.has_upvoted ? "Already upvoted" : "Upvote"}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
              </svg>
            </button>
            <span className="text-lg font-bold text-gray-900">{question.vote_count ?? 0}</span>
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-gray-900 mb-2">{question.title}</h1>

            <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
              <span>Asked by <span className="font-medium text-gray-700">{question.created_by}</span></span>
              <span>·</span>
              <span>{timeAgo(question.created_at)}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                question.status === "open" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"
              }`}>
                {question.status}
              </span>
            </div>

            <div className="prose prose-sm max-w-none text-gray-700 mb-4 whitespace-pre-wrap">
              {question.body}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {question.category && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {question.category.full_path}
                </span>
              )}
              {question.tags?.map((tag) => (
                <span
                  key={tag.id}
                  className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-600"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Question comments */}
        {question.comments?.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100 ml-14">
            {question.comments.map((comment) => (
              <div key={comment.id} className="text-sm text-gray-600 py-1.5 border-b border-gray-50 last:border-0">
                {comment.body}
                <span className="text-gray-400 ml-2">– {comment.created_by}</span>
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
              className="flex-1 px-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Comment
            </button>
          </form>
        </div>
      </div>

      {/* Answers header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          {question.answers?.length || 0} {question.answers?.length === 1 ? "Answer" : "Answers"}
        </h2>
      </div>

      {/* Answers */}
      <div className="space-y-4 mb-8">
        {sortedAnswers.map((answer) => (
          <div
            key={answer.id}
            className={`bg-white border rounded-xl p-6 ${
              answer.is_accepted ? "border-green-300 ring-1 ring-green-100" : "border-gray-200"
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
                      ? "bg-blue-100 text-blue-600"
                      : "hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <span className="text-lg font-bold text-gray-900">{answer.vote_count ?? 0}</span>
                {answer.is_accepted && (
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center" title="Accepted answer">
                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
                {canAccept && !answer.is_accepted && (
                  <button
                    type="button"
                    onClick={() => handleAccept(answer.id)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 hover:border-green-400 hover:text-green-500 transition-colors"
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
                    <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                      Accepted
                    </span>
                  )}
                </div>

                <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                  {answer.body}
                </div>

                <div className="mt-3 text-sm text-gray-500">
                  Answered by <span className="font-medium text-gray-700">{answer.created_by}</span>
                  {answer.created_at && <span> · {timeAgo(answer.created_at)}</span>}
                </div>

                {/* Answer comments */}
                {answer.comments?.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    {answer.comments.map((comment) => (
                      <div key={comment.id} className="text-sm text-gray-600 py-1.5 border-b border-gray-50 last:border-0">
                        {comment.body}
                        <span className="text-gray-400 ml-2">– {comment.created_by}</span>
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
                      className="flex-1 px-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
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
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Answer</h3>
        <form onSubmit={handleAnswerSubmit}>
          <textarea
            value={answerBody}
            onChange={(e) => setAnswerBody(e.target.value)}
            rows={6}
            placeholder="Write your answer here..."
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
          />
          <div className="mt-3 flex justify-end">
            <button
              type="submit"
              disabled={submittingAnswer || !answerBody.trim()}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors"
            >
              {submittingAnswer ? "Posting..." : "Post Your Answer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
