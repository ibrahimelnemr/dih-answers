import { Navigate, Route, Routes } from "react-router-dom";

import { AuthProvider } from "./auth/AuthContext";
import AppLayout from "./components/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminSQLPage from "./pages/AdminSQLPage";
import AskQuestionPage from "./pages/AskQuestionPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import QuestionDetailPage from "./pages/QuestionDetailPage";
import QuestionsPage from "./pages/QuestionsPage";
import SettingsPage from "./pages/SettingsPage";
import SmokePage from "./pages/SmokePage";
import UserProfilePage from "./pages/UserProfilePage";
import { ThemeProvider } from "./theme/ThemeContext";

export default function App() {
  return (
    <ThemeProvider>
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
          <Route index element={<HomePage />} />
          <Route path="questions" element={<QuestionsPage />} />
          <Route path="questions/:id" element={<QuestionDetailPage />} />
          <Route path="ask" element={<AskQuestionPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="users/:username" element={<UserProfilePage />} />
          <Route path="admin/sql" element={<AdminSQLPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
    </ThemeProvider>
  );
}
