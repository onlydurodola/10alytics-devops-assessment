import { Link } from 'react-router-dom';
import { CheckCircle, LayoutDashboard, LogIn, UserPlus } from 'lucide-react';

export function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold">Task Manager</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Organize your work</h1>
          <p className="text-lg text-gray-300 mb-10">
            A simple task manager with a Kanban-style board. Log in, create tasks,
            set priorities, and track status from todo to done.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              to="/login"
              className="px-8 py-4 bg-blue-600 rounded-xl hover:bg-blue-500 transition-colors font-semibold text-lg"
            >
              Get Started
            </Link>
            <Link
              to="/signup"
              className="px-8 py-4 bg-gray-800 border border-gray-700 rounded-xl hover:bg-gray-700 transition-colors font-semibold text-lg"
            >
              Create Account
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
              <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4">
                <LayoutDashboard className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-bold mb-2">Kanban Board</h3>
              <p className="text-gray-400 text-sm">
                Move tasks across todo, in-progress, and done columns.
              </p>
            </div>

            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
              <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-lg font-bold mb-2">Priority & Status</h3>
              <p className="text-gray-400 text-sm">
                Set priority levels and track the current state of each task.
              </p>
            </div>

            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4">
                <LogIn className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-bold mb-2">Secure Accounts</h3>
              <p className="text-gray-400 text-sm">
                JWT-based authentication with hashed passwords.
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="container mx-auto px-6 py-8 border-t border-gray-800 text-center text-gray-500 text-sm">
        <p>Task Manager — a full-stack demo built with React, Flask, and PostgreSQL.</p>
      </footer>
    </div>
  );
}
