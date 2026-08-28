import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Github } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 pt-12 pb-8 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center font-bold text-white shadow-glow">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-slate-200 text-sm">TrackCraft</p>
            <p className="text-[11px] text-slate-400">Full-Stack Project Progress Tracker Platform</p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-slate-400">
          <button
            onClick={() => {
              const el = document.getElementById('features');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              } else {
                window.location.hash = '#/';
                setTimeout(() => {
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="hover:text-slate-200 transition-colors"
          >
            Features
          </button>
          <Link to="/how-it-works" className="hover:text-slate-200 transition-colors">Workflow & How It Works</Link>
          <Link to="/login" className="hover:text-slate-200 transition-colors">Login</Link>
          <Link to="/signup" className="hover:text-slate-200 transition-colors">Sign Up</Link>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
          >
            <Github className="w-4 h-4" />
          </a>
          <p>© {new Date().getFullYear()} TrackCraft. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
