import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle, LogIn, Lock, User, Eye, EyeOff, LayoutDashboard } from 'lucide-react';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl mb-4">
                <LayoutDashboard className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-bold mb-1">Task Manager</h2>
              <p className="text-gray-400 text-sm">Sign in to manage your tasks</p>
            </div>

            {error && (
              <div className="mb-6 bg-red-900/30 border border-red-800/50 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="w-5 h-5 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-white"
                    placeholder="Enter your username"
                    required
                    disabled={loading}
                    autoComplete="username"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-500" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-white"
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-500 hover:text-gray-400" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-500 hover:text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Sign In
                  </>
                )}
              </button>

              <div className="text-center pt-4 border-t border-gray-700">
                <p className="text-gray-400 text-sm">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-semibold">
                    Sign up
                  </Link>
                </p>
              </div>

              <div className="text-center">
                <p className="text-xs text-gray-500 mb-2">Demo credentials:</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setUsername('admin');
                      setPassword('admin123');
                    }}
                    className="p-2 bg-gray-900/50 border border-gray-700 rounded-lg hover:border-blue-500 transition-colors text-xs"
                  >
                    <div className="font-medium">Admin</div>
                    <div className="text-gray-400 font-mono">admin / admin123</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUsername('user');
                      setPassword('user123');
                    }}
                    className="p-2 bg-gray-900/50 border border-gray-700 rounded-lg hover:border-purple-500 transition-colors text-xs"
                  >
                    <div className="font-medium">User</div>
                    <div className="text-gray-400 font-mono">user / user123</div>
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="px-8 py-4 bg-gray-900 border-t border-gray-700 text-center">
            <p className="text-xs text-gray-500">© 2026 Task Manager. Built for the 10Alytics DevOps assessment.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
