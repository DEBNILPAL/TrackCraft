import React from 'react';
import { UserPlus, KeyRound, UserCheck, Activity, Award } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      icon: UserPlus,
      title: 'Create Account',
      desc: 'Sign up with your email and set up your developer profile.',
    },
    {
      num: '02',
      icon: KeyRound,
      title: 'Create or Join Project',
      desc: 'Start a new project with a password, or enter an existing project password.',
    },
    {
      num: '03',
      icon: UserCheck,
      title: 'Select Role',
      desc: 'Pick your project role (Frontend, Backend, ML, AI, DevOps, Designer, etc.).',
    },
    {
      num: '04',
      icon: Activity,
      title: 'Log Daily Progress',
      desc: 'Submit daily completion percentages, blockers, and completed items.',
    },
    {
      num: '05',
      icon: Award,
      title: 'Collaborate & Deliver',
      desc: 'Use project chat, schedule Google Meet syncs, and hit hackathon deadlines.',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-slate-900/50 border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2">
            Seamless Workflow
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            How TrackCraft Power Teams
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="glass-card p-6 rounded-3xl border border-slate-800 relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-indigo-500/40">{step.num}</span>
                    <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h4 className="text-base font-bold text-slate-100 mb-1">{step.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
