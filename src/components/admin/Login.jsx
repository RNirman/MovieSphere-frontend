import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Film } from 'lucide-react';

function Login({ setAuth }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:8080/api/v1/auth/login', {
                username,
                password
            });

            if (response.data && response.data.token) {
                const token = response.data.token;
                setAuth(token);
                localStorage.setItem('jwtToken', token);
                navigate('/admin');
            }
        } catch (err) {
            console.error('Login Error:', err);
            if (err.response && err.response.status === 401) {
                setError('Invalid username or password.');
            } else {
                setError('An unexpected error occurred during login.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
            </div>

            <div className="relative w-full max-w-md px-6">
                <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/50 rounded-2xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-violet-600/20 to-blue-600/20 px-8 py-10 text-center border-b border-slate-800/50">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 mb-4 shadow-lg shadow-violet-600/50">
                            <Film className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                            MovieSphere
                        </h1>
                        <p className="text-slate-400 text-sm font-medium tracking-wide">Admin Portal</p>
                    </div>

                    {/* Form Container */}
                    <div className="px-8 py-8">
                        {error && (
                            <div className="mb-6 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 backdrop-blur-sm">
                                <p className="text-red-400 text-sm font-medium">{error}</p>
                            </div>
                        )}

                        <div className="space-y-6">
                            <div>
                                <label className="block mb-2 text-sm font-semibold text-slate-300">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all duration-200"
                                    placeholder="Enter your username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-semibold text-slate-300">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all duration-200"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={loading}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && username && password && !loading) {
                                            handleLogin(e);
                                        }
                                    }}
                                />
                            </div>

                            <button
                                onClick={handleLogin}
                                disabled={loading || !username || !password}
                                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 transition-all duration-200 font-semibold text-white shadow-lg shadow-violet-600/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Logging in...
                                    </span>
                                ) : (
                                    'Login'
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-8 py-6 bg-slate-900/50 border-t border-slate-800/50 text-center">
                        <p className="text-slate-500 text-xs">
                            © {new Date().getFullYear()} MovieSphere. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;