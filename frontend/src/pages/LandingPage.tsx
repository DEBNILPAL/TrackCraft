import React from 'react';
import { Link } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';
import { Hero } from '../components/landing/Hero';
import { Features } from '../components/landing/Features';
import { HowItWorks } from '../components/landing/HowItWorks';
import { Footer } from '../components/landing/Footer';
import { Button } from '../components/common/Button';

export const LandingPage: React.FC = () => {
  const scrollToFeatures = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('features');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Landing Navbar */}
      <header className="sticky top-0 z-40 h-20 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/app-icon.png"
            alt="TrackCraft Logo"
            className="w-10 h-10 rounded-2xl border border-indigo-500/40 shadow-glow object-cover"
          />
          <span className="text-xl font-black tracking-tight text-white">
            TrackCraft
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
          <button onClick={scrollToFeatures} className="hover:text-white transition-colors">
            Features
          </button>
          <Link to="/how-it-works" className="hover:text-white transition-colors">How It Works</Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Desktop & Tablet Navigation Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="md" icon={LogIn}>
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="glow" size="md" icon={UserPlus}>
                Start For Free
              </Button>
            </Link>
          </div>

          {/* Mobile Phone Only: Sleek Sign In Icon Button */}
          <div className="sm:hidden">
            <Link to="/login">
              <Button
                variant="glow"
                size="sm"
                icon={LogIn}
                className="!p-2.5 !rounded-xl shadow-glow"
                title="Sign In"
              >
                <span className="text-xs font-bold ml-1">Sign In</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Sections */}
      <main className="flex-1">
        <Hero />
        <Features />
        <HowItWorks />
      </main>

      <Footer />
    </div>
  );
};
