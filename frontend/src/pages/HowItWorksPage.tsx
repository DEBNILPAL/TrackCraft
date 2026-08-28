import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  UserPlus,
  KeyRound,
  UserCheck,
  Activity,
  Award,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  MessageSquare,
  Video,
  FileCode2,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { ProgressBar } from '../components/common/ProgressBar';
import { CircularProgress } from '../components/common/CircularProgress';

export const HowItWorksPage: React.FC = () => {
  // Interactive Demo State for role progress playground
  const [frontendProg, setFrontendProg] = useState(80);
  const [backendProg, setBackendProg] = useState(65);
  const [mlProg, setMlProg] = useState(50);

  const overallAvg = Math.round((frontendProg + backendProg + mlProg) / 3);

  const steps = [
    {
      num: '01',
      icon: UserPlus,
      title: 'Sign Up & Build Profile',
      desc: 'Create your developer account using your email. Enter your name, phone number, and avatar to get started.',
      highlight: 'Primary email serves as unique identifier',
    },
    {
      num: '02',
      icon: KeyRound,
      title: 'Create or Join Project',
      desc: 'Create a new project with a hashed project password or enter a project password to join your teammate\'s workspace.',
      highlight: 'Password security & permanent membership',
    },
    {
      num: '03',
      icon: UserCheck,
      title: 'Select Developer Role',
      desc: 'Assign yourself a role in the project squad: Frontend, Backend, ML, AI, DevOps, UI/UX Designer, Researcher, or Manager.',
      highlight: 'Role-based progress tracking',
    },
    {
      num: '04',
      icon: Activity,
      title: 'Log Daily Progress',
      desc: 'Submit daily updates: percentage completed, tasks finished today, current focus, blockers, and next session plans.',
      highlight: 'Real-time dashboard recalculations',
    },
    {
      num: '05',
      icon: MessageSquare,
      title: 'Team Chat & Sync Meetings',
      desc: 'Use high-speed project chat powered by Socket.IO and schedule Google Meet or Zoom syncs with 1-click join buttons.',
      highlight: 'Restricted team authorization',
    },
    {
      num: '06',
      icon: Award,
      title: 'Track Hackathons & Win',
      desc: 'Monitor submission deadlines, registration cutoffs, and pitch presentation dates with automatic countdown widgets.',
      highlight: 'Live countdown & health badges',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white bg-grid-pattern">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 h-20 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-8 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center font-bold text-white shadow-glow">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <span className="text-xl font-black tracking-tight text-white">
            TrackCraft
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="sm" icon={ArrowLeft}>
              Back to Home
            </Button>
          </Link>
          <Link to="/signup">
            <Button variant="glow" size="sm" icon={ArrowRight} iconPosition="right">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold shadow-glow">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Complete Platform Workflow</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-100 tracking-tight">
            How <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-emerald-400 bg-clip-text text-transparent">TrackCraft</span> Works
          </h1>
          <p className="text-base text-slate-400 leading-relaxed">
            Understand how student teams and hackathon competitors organize projects, track role progress percentages daily, collaborate securely, and hit tight submission deadlines.
          </p>
        </div>

        {/* Step-by-step Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <Card key={idx} glass hoverable className="p-6 relative flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-black text-indigo-500/30">{step.num}</span>
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-glow">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-100 mb-2">{step.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">{step.desc}</p>
                </div>
                <div className="pt-3 border-t border-slate-800/80">
                  <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {step.highlight}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Interactive Progress Calculation Playground */}
        <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 glass-card shadow-2xl space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-100">
              ⚡ Try the Live Role Progress Calculator
            </h2>
            <p className="text-xs text-slate-400">
              Drag the role progress sliders below to see how TrackCraft dynamically calculates overall project completion in real-time.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Sliders Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Frontend Slider */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-indigo-400">Debnil (Frontend Developer)</span>
                  <span className="text-white text-base font-extrabold">{frontendProg}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={frontendProg}
                  onChange={(e) => setFrontendProg(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <ProgressBar progress={frontendProg} showPercentage={false} size="sm" color="indigo" />
              </div>

              {/* Backend Slider */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-purple-400">Rahul (Backend Developer)</span>
                  <span className="text-white text-base font-extrabold">{backendProg}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={backendProg}
                  onChange={(e) => setBackendProg(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <ProgressBar progress={backendProg} showPercentage={false} size="sm" color="gradient" />
              </div>

              {/* ML Slider */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-emerald-400">Ananya (ML Developer)</span>
                  <span className="text-white text-base font-extrabold">{mlProg}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={mlProg}
                  onChange={(e) => setMlProg(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <ProgressBar progress={mlProg} showPercentage={false} size="sm" color="emerald" />
              </div>
            </div>

            {/* Circular Overall Gauge Result Column */}
            <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Calculated Project Progress</h4>
              <CircularProgress progress={overallAvg} size={150} label="OVERALL" />
              <p className="text-xs text-slate-400 max-w-xs">
                Derived from the average completion percentage across all assigned team member roles.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-indigo-900/50 via-purple-900/40 to-slate-900 border border-indigo-500/30 text-center space-y-4 shadow-glow">
          <h3 className="text-2xl font-black text-slate-100">Ready to boost your team's development speed?</h3>
          <p className="text-xs text-slate-300 max-w-md mx-auto">
            Set up your free account now and experience seamless project tracking, password-protected team access, and real-time collaboration.
          </p>
          <div className="pt-2">
            <Link to="/signup">
              <Button variant="glow" size="lg" icon={ArrowRight} iconPosition="right">
                Create Free Account
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800/80 py-8 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} TrackCraft. All rights reserved.
      </footer>
    </div>
  );
};
