import React from 'react';
import { Film, Github, Twitter, Mail } from 'lucide-react';

function Footer() {
    return (
        <footer className="mt-auto bg-slate-950 border-t border-slate-800/50">
            <div className="container mx-auto px-4 py-8">
                {/* Main Footer Content */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-6">
                    {/* Brand Section */}
                    <div className="flex flex-col items-center md:items-start">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center">
                                <Film className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                                MovieSphere
                            </span>
                        </div>
                        <p className="text-slate-400 text-sm text-center md:text-left">
                            Your ultimate destination for movie information and reviews.
                        </p>
                    </div>

                    {/* Tech Stack
                    <div className="flex flex-col items-center">
                        <h3 className="text-slate-300 font-semibold mb-3">Built With</h3>
                        <div className="flex flex-wrap justify-center gap-2">
                            <span className="px-3 py-1 text-xs font-medium bg-slate-800/50 text-violet-400 rounded-full border border-slate-700/50">
                                React
                            </span>
                            <span className="px-3 py-1 text-xs font-medium bg-slate-800/50 text-blue-400 rounded-full border border-slate-700/50">
                                Spring Boot
                            </span>
                            <span className="px-3 py-1 text-xs font-medium bg-slate-800/50 text-purple-400 rounded-full border border-slate-700/50">
                                Tailwind CSS
                            </span>
                        </div>
                    </div> */}

                    {/* Social Links */}
                    <div className="flex flex-col items-center md:items-end">
                        <h3 className="text-slate-300 font-semibold mb-3">Connect</h3>
                        <div className="flex gap-3">
                            <a
                                href="#"
                                className="w-9 h-9 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-violet-400 hover:bg-slate-800 hover:border-violet-500/30 transition-all duration-200"
                                aria-label="GitHub"
                            >
                                <Github className="w-4 h-4" />
                            </a>
                            <a
                                href="#"
                                className="w-9 h-9 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-blue-400 hover:bg-slate-800 hover:border-blue-500/30 transition-all duration-200"
                                aria-label="Twitter"
                            >
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a
                                href="#"
                                className="w-9 h-9 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-purple-400 hover:bg-slate-800 hover:border-purple-500/30 transition-all duration-200"
                                aria-label="Email"
                            >
                                <Mail className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-6 border-t border-slate-800/50">
                    <p className="text-center text-slate-500 text-sm">
                        © {new Date().getFullYear()} MovieSphere Project. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;