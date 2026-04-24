import { Navigate, Route, Routes } from "react-router-dom";

import { AuthProvider } from "./auth/AuthContext";
import AppLayout from "./components/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import AskQuestionPage from "./pages/AskQuestionPage";
import LoginPage from "./pages/LoginPage";
import QuestionDetailPage from "./pages/QuestionDetailPage";
import QuestionsPage from "./pages/QuestionsPage";
import SmokePage from "./pages/SmokePage";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/smoke" element={<SmokePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<QuestionsPage />} />
          <Route path="questions/:id" element={<QuestionDetailPage />} />
          <Route path="ask" element={<AskQuestionPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
