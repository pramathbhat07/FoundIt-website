import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Search,
  MapPin,
  Bell,
  User as UserIcon,
  Menu,
  X,
  Package,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { FeedbackModal } from "../FeedbackModal";
import { MessageSquare } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = React.useState(false);
  const location = useLocation();
  const { currentUser, userProfile, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Lost Items", path: "/lost" },
    { name: "Found Items", path: "/found" },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-gray-200/50 dark:border-gray-800/50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl shadow-sm dark:shadow-none transition-colors duration-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Link
                to="/"
                className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400"
              >
                <Package className="h-6 w-6" />
                <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                  FoundIt.
                </span>
              </Link>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={cn(
                      "relative text-sm font-medium transition-colors hover:text-indigo-600 dark:hover:text-indigo-400",
                      location.pathname === link.path
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-gray-500 dark:text-gray-400",
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-500 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-100"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
              <Link
                to="/report-lost"
                className="rounded-full px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-100 transition-colors"
              >
                Report Lost
              </Link>
              <Link
                to="/report-found"
                className="rounded-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-sm"
              >
                Report Found
              </Link>
              <div className="h-4 w-px bg-gray-100 dark:bg-gray-800 mx-2"></div>
              {currentUser ? (
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsFeedbackOpen(true)}
                    className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Feedback
                  </button>
                  {userProfile?.role === "admin" ? (
                    <Link
                      to="/admin"
                      className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Admin Portal
                    </Link>
                  ) : (
                    <>
                      <Link
                        to="/messages"
                        className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      >
                        Messages
                      </Link>
                      <Link
                        to="/dashboard"
                        className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      >
                        Dashboard
                      </Link>
                    </>
                  )}
                  <button
                    onClick={logout}
                    className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/sign-in"
                  className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <UserIcon className="h-5 w-5" />
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-500 transition-colors rounded-full"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-500 focus:outline-none"
              >
                {isOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200/50 dark:border-gray-800/50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl"
            >
              <div className="space-y-1 px-4 pb-4 pt-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                      location.pathname === link.path
                        ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400"
                        : "text-gray-500 dark:text-gray-400 hover:bg-indigo-50/50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white",
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col gap-2">
                  <Link
                    to="/report-lost"
                    onClick={() => setIsOpen(false)}
                    className="block text-center rounded-md px-3 py-2 mx-3 text-base font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    Report Lost Item
                  </Link>
                  <Link
                    to="/report-found"
                    onClick={() => setIsOpen(false)}
                    className="block text-center rounded-md mx-3 px-3 py-2 text-base font-medium text-white bg-indigo-600 hover:bg-indigo-500 transition-colors"
                  >
                    Report Found Item
                  </Link>

                  {currentUser ? (
                    <>
                      {userProfile?.role === "admin" ? (
                        <Link
                          to="/admin"
                          onClick={() => setIsOpen(false)}
                          className="block text-center rounded-md px-3 py-2 mx-3 text-base font-medium text-emerald-600 hover:bg-emerald-50 mt-2"
                        >
                          Admin Portal
                        </Link>
                      ) : (
                        <>
                          <Link
                            to="/messages"
                            onClick={() => setIsOpen(false)}
                            className="block text-center rounded-md px-3 py-2 mx-3 text-base font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-gray-700 mt-2"
                          >
                            Messages
                          </Link>
                          <Link
                            to="/dashboard"
                            onClick={() => setIsOpen(false)}
                            className="block text-center rounded-md px-3 py-2 mx-3 text-base font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-gray-700 mt-2"
                          >
                            Dashboard
                          </Link>
                        </>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          setIsOpen(false);
                        }}
                        className="block w-full text-center rounded-md px-3 py-2 mx-3 text-base font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors mt-2"
                      >
                        Sign Out
                      </button>
                      <button
                        onClick={() => {
                          setIsFeedbackOpen(true);
                          setIsOpen(false);
                        }}
                        className="block w-full text-center rounded-md px-3 py-2 mx-3 text-base font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white transition-colors mt-2"
                      >
                        Feedback
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/sign-in"
                      onClick={() => setIsOpen(false)}
                      className="block text-center rounded-md px-3 py-2 mx-3 text-base font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors mt-2"
                    >
                      Sign In
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />
    </>
  );
}
