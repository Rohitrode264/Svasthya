import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Landing from "./pages/Landing";
import SignupForm from "./pages/Auth/SignUp";
import VerifyForm from "./pages/Auth/SignUpVerification";
import LoginForm from "./pages/Auth/SignIn";
import ForgotPasswordForm from "./pages/Auth/ForgotPasswordVarification";
import ResetPasswordForm from "./pages/Auth/ForgotPassword";
import Dashboard from "./pages/Dashboard/Dashboard";
import { MediMinder } from "./pages/MediMinder/MediMinder";
import { CareLocator } from "./pages/CareLocator/CareLocator";
import { CareAlert } from "./pages/CareAlert/CareAlert";
import CareCircle from "./pages/CareCircle/CareCircle";
import CareCirclePost from "./pages/CareCircle/PostPage";
import Profile from "./pages/Profile";

import ProtectedRoute from "./component/ProtecredRoute"; 
export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/verify" element={<VerifyForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/forgot-password" element={<ForgotPasswordForm />} />
        <Route path="/reset-password" element={<ResetPasswordForm />} />

        {/* ✅ Protected Routes */}
        <Route
          path="/:userId/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/:userId/mediminder"
          element={
            <ProtectedRoute>
              <MediMinder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/:userId/carelocator"
          element={
            <ProtectedRoute>
              <CareLocator />
            </ProtectedRoute>
          }
        />
        <Route
          path="/:userId/carealert"
          element={
            <ProtectedRoute>
              <CareAlert />
            </ProtectedRoute>
          }
        />
        <Route
          path="/:userId/carecircle"
          element={
            <ProtectedRoute>
              <CareCircle />
            </ProtectedRoute>
          }
        />
        <Route
          path="/:userId/carecircle/:id"
          element={
            <ProtectedRoute>
              <CareCirclePost />
            </ProtectedRoute>
          }
        />
        <Route
          path="/:userId/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Redirect unknown paths */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
