import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Activity, Users, Sparkles, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '../common/Button';

export const Hero: React.FC = () => {
  return (
    <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 overflow-hidden bg-grid-pattern">
      {/* Background Radial Lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold tracking-wide shadow-glow">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Built for Student & Hackathon Developer Teams</span>
          </div>

          {/* Hero Headline */}
          <h1 className="text-4xl sm:text-6xl font-black text-slate-100 tracking-tight leading-tight">
            Manage Projects. <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-emerald-400 bg-clip-text text-transparent">
              Track Progress.
            </span>{' '}
            Collaborate Better.
          </h1>

          {/* Hero Description */}
          <p className="text-lg text-slate-300 font-normal leading-relaxed">
            The all-in-one centralized progress dashboard for student developers and hackathon creators. Log daily role percentages, schedule Meet/Zoom syncs, lock projects with passwords, and share architecture diagrams.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/signup">
              <Button variant="glow" size="lg" icon={ArrowRight} iconPosition="right" className="w-full sm:w-auto text-base font-semibold px-8 py-3.5">
                Get Started Free
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto text-base font-medium px-8 py-3.5 rounded-full bg-slate-900/80 border-slate-700">
                Log In to Workspace
              </Button>
            </Link>
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-center gap-6 pt-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Atomic JSON Storage</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Real-time Chat</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Password Security</span>
          </div>
        </div>

        {/* Dashboard Visualization Mockup */}
        <div className="mt-14 relative max-w-5xl mx-auto">
          <div className="rounded-3xl p-3 bg-gradient-to-b from-indigo-500/30 via-slate-800/40 to-slate-900/80 border border-indigo-500/30 shadow-2xl backdrop-blur-2xl glass-card">
            <div className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-800">
              {/* Window Controls Header */}
              <div className="h-10 bg-slate-900/90 px-4 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-xs font-semibold text-slate-400">trackcraft.app/dashboard/project/smart-ai</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-indigo-400 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" /> Hackathon Countdown: 3 Days Left
                </div>
              </div>

              {/* Mockup Workspace Grid */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-950/80">
                {/* Left Card: Progress Gauges */}
                <div className="bg-slate-900/70 p-5 rounded-2xl border border-slate-800/80 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Project Progress</h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">Healthy</span>
                  </div>
                  <div className="flex flex-col items-center py-2">
                    <div className="w-24 h-24 rounded-full border-8 border-indigo-500 border-t-emerald-400 flex flex-col items-center justify-center">
                      <span className="text-2xl font-black text-white">75%</span>
                      <span className="text-[10px] text-slate-400 font-bold">COMPLETED</span>
                    </div>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-300"><span>Frontend (React)</span><span className="text-indigo-400 font-bold">85%</span></div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden"><div className="bg-indigo-500 h-full w-[85%]" /></div>
                    <div className="flex justify-between text-slate-300"><span>Backend (Node REST)</span><span className="text-purple-400 font-bold">70%</span></div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden"><div className="bg-purple-500 h-full w-[70%]" /></div>
                  </div>
                </div>

                {/* Center Card: Team Member Roles */}
                <div className="bg-slate-900/70 p-5 rounded-2xl border border-slate-800/80 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Active Teammates</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-xs text-white">DP</div>
                        <div>
                          <p className="text-xs font-bold text-slate-100">Debnil Paul</p>
                          <p className="text-[10px] text-indigo-400">Frontend Developer</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-400">85%</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center font-bold text-xs text-white">RS</div>
                        <div>
                          <p className="text-xs font-bold text-slate-100">Rahul Sharma</p>
                          <p className="text-[10px] text-purple-400">Backend Developer</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-amber-400">70%</span>
                    </div>
                  </div>
                </div>

                {/* Right Card: Meetings & Activity */}
                <div className="bg-slate-900/70 p-5 rounded-2xl border border-slate-800/80 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Upcoming Sync</h4>
                  <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs space-y-2">
                    <div className="flex items-center justify-between font-bold text-slate-100">
                      <span>Hackathon Mid-Way Sync</span>
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    </div>
                    <p className="text-[11px] text-slate-300">Tomorrow at 7:30 PM</p>
                    <button className="w-full py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 font-bold text-white text-[11px] transition-colors">
                      Join Google Meet
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Badges */}
          <div className="absolute -top-6 -left-6 bg-slate-900/90 border border-slate-700 p-3 rounded-2xl shadow-glow hidden sm:flex items-center gap-3 backdrop-blur-xl animate-float">
            <Activity className="w-5 h-5 text-indigo-400" />
            <div className="text-xs">
              <p className="font-bold text-white">Daily Updates</p>
              <p className="text-slate-400 text-[10px]">Real-time Role Sync</p>
            </div>
          </div>

          <div className="absolute -bottom-6 -right-6 bg-slate-900/90 border border-slate-700 p-3 rounded-2xl shadow-glow hidden sm:flex items-center gap-3 backdrop-blur-xl">
            <Users className="w-5 h-5 text-emerald-400" />
            <div className="text-xs">
              <p className="font-bold text-white">Protected Password</p>
              <p className="text-slate-400 text-[10px]">Strict Access Control</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
