// App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/Landing/LandingPage";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import { ChatProvider } from "./context/ChatContext";

import AdminDashboard from "./pages/Admin/Dashboard/Dashboard";
import ContactCenter from "./pages/Admin/ContactCenter/ContactCenter";
import Analytics from "./pages/Admin/Analytics/Analytics";
import ChatBot from "./pages/Admin/ChatBot/ChatBot";
import TeamManagement from "./pages/Admin/Team/TeamManagement";
import Settings from "./pages/Admin/Settings/Settings";

import AdminLayout from "./components/Layouts/AdminLayout";
import { AuthProvider } from "./context/AuthContext";
import { useAuthContext } from "./Hooks/useAuthContext";

import UserLayout from "./components/Layouts/UserLayout";
import UserSettings from "./pages/User/UserSettings/UserSettings";
import UserDashboard from "./pages/User/UserDashboard/UserDashboard";
import UserManagement from "./pages/User/UserTeam/UserManagement"
import UserChabot from "./pages/User/UserChabot/UserChabot"
import UserAnalytics from "./pages/User/UserAnalytics/UserAnalytics"
import UserControlCenter from "./pages/User/UserControlCenter/UserControlCenter"

function RequireUser({ children }) {
  const { user } = useAuthContext();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "user") return <Navigate to="/" replace />;
  return children;
}

function RequireAdmin({ children }) {
  const { user } = useAuthContext();

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* USER DASHBOARD */}
          <Route
            path="/user"
            element={
              <RequireUser>
                <UserLayout /> 
              </RequireUser>
            }
          >
            <Route index element={<UserDashboard />} />
            <Route path="control-center" element={<ChatProvider>
                  <UserControlCenter />
                </ChatProvider>}/>
            <Route path="chat-bot" element={<UserChabot/>}/>
            <Route path="analytics" element={<UserAnalytics/>}/>
            <Route path="team" element={<UserManagement/>}/>
            <Route path="settings" element={<UserSettings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>

          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <AdminLayout />
              </RequireAdmin>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route
              path="contact-center"
              element={
                <ChatProvider>
                  <ContactCenter />
                </ChatProvider>
              }
            />
            <Route path="analytics" element={<Analytics />} />
            <Route path="chat-bot" element={<ChatBot />} />
            <Route path="team" element={<TeamManagement />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
