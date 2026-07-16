/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import ItemsList from "./pages/ItemsList";
import ItemDetails from "./pages/ItemDetails";
import ReportLost from "./pages/ReportLost";
import ReportFound from "./pages/ReportFound";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Messages from "./pages/Messages";
import ChatPage from "./pages/Chat";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ProtectedRoute } from "./components/shared/ProtectedRoute";
import { AdminRoute } from "./components/shared/AdminRoute";

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <div className="flex min-h-screen flex-col relative bg-white dark:bg-gray-900 transition-colors duration-500 text-gray-900 dark:text-white">
            <div className="fixed inset-0 -z-10 h-full w-full transition-colors duration-500 bg-white dark:bg-gray-900"></div>
            <Navbar />
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route
                  path="/lost"
                  element={
                    <ItemsList
                      type="lost"
                      title="Lost Items"
                      description="Browse items that have been reported lost. Help reunite them with their owners."
                    />
                  }
                />
                <Route
                  path="/found"
                  element={
                    <ItemsList
                      type="found"
                      title="Found Items"
                      description="Browse items that have been found and turned in. See if yours is here."
                    />
                  }
                />
                <Route path="/lost/:id" element={<ItemDetails />} />
                <Route path="/found/:id" element={<ItemDetails />} />
                <Route
                  path="/report-lost"
                  element={
                    <ProtectedRoute>
                      <ReportLost />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/report-found"
                  element={
                    <ProtectedRoute>
                      <ReportFound />
                    </ProtectedRoute>
                  }
                />
                <Route path="/sign-in" element={<SignIn />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/messages"
                  element={
                    <ProtectedRoute>
                      <Messages />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/chat/:id"
                  element={
                    <ProtectedRoute>
                      <ChatPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  }
                />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/cookie-policy" element={<CookiePolicy />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}
