import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Books } from "./pages/Books";
import { IssueBook } from "./pages/IssueBook";
import { Login } from "./pages/Login";
import { MemberHistory } from "./pages/MemberHistory";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/books" element={<Books />} />
          <Route path="/issue-book" element={<IssueBook />} />
          <Route path="/member-history" element={<MemberHistory />} />
          <Route path="/" element={<Navigate to="/books" replace />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/books" replace />} />
    </Routes>
  );
}