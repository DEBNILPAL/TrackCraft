import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  MessageSquare,
  Video,
  FileCode2,
  Globe,
  Clock,
  PlusCircle,
  Lock,
  Calendar,
  Layers,
  ChevronRight,
  ShieldCheck,
  Send,
  Upload,
} from 'lucide-react';
import {
  Project,
  Membership,
  ProgressLog,
  RoleProgressBreakdown,
  ProjectHealthSummary,
  Meeting,
  DocumentItem,
  ReferenceLink,
  ActivityItem,
  UserRole,
} from '../types';
import { useAuth } from '../context/AuthContext';
import { useProject } from '../context/ProjectContext';
import api from '../services/api';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { CircularProgress } from '../components/common/CircularProgress';
import { HealthBadge } from '../components/project/HealthBadge';
import { DeadlineCountdown } from '../components/project/DeadlineCountdown';
import { RoleProgressList } from '../components/project/RoleProgressList';
import { ProgressChart } from '../components/project/ProgressChart';
import { PasswordModal } from '../components/project/PasswordModal';
import { DailyProgressModal } from '../components/project/DailyProgressModal';
import { ChatRoom } from '../components/chat/ChatRoom';
import { MeetingCard } from '../components/meetings/MeetingCard';
import { ScheduleMeetingModal } from '../components/meetings/ScheduleMeetingModal';
import { DocumentList } from '../components/docs/DocumentList';
import { ArchitectureGallery } from '../components/docs/ArchitectureGallery';
import { DocumentUploader } from '../components/docs/DocumentUploader';
import { LinkList } from '../components/links/LinkList';
import { AddLinkModal } from '../components/links/AddLinkModal';
import { Avatar } from '../components/common/Avatar';

type WorkspaceTab = 'overview' | 'team' | 'progress' | 'chat' | 'meetings' | 'docs' | 'links' | 'info';

export const ProjectDetailPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setLockedProjectToJoin } = useProject();

  const [activeTab, setActiveTab] = useState<WorkspaceTab>('overview');
  const [project, setProject] = useState<Project | null>(null);
  const [members, setMembers] = useState<Membership[]>([]);
  const [progressLogs, setProgressLogs] = useState<ProgressLog[]>([]);
  const [roleBreakdown, setRoleBreakdown] = useState<RoleProgressBreakdown[]>([]);
  const [healthSummary, setHealthSummary] = useState<ProjectHealthSummary | null>(null);
  const [meetings, setMeetings] = useState<{ upcoming: Meeting[]; past: Meeting[] }>({ upcoming: [], past: [] });
  const [docsData, setDocsData] = useState<{ architectureDiagrams: DocumentItem[]; standardDocuments: DocumentItem[] }>({
    architectureDiagrams: [],
    standardDocuments: [],
  });
  const [links, setLinks] = useState<ReferenceLink[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals state
  const [showDailyModal, setShowDailyModal] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [showDocModal, setShowDocModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);

  const fetchProjectDetails = useCallback(async () => {
    if (!projectId) return;
    setIsLoading(true);
    setError('');
    try {
      // 1. Fetch Project Details
      const projRes = await api.get(`/projects/${projectId}`);
      if (projRes.data.success) {
        setProject(projRes.data.data);
      }

      // 2. Fetch Members
      const memRes = await api.get(`/projects/${projectId}/members`);
      if (memRes.data.success) {
        setMembers(memRes.data.data);
      }

      // 3. Fetch Progress Analytics
      const progRes = await api.get(`/projects/${projectId}/progress`);
      if (progRes.data.success) {
        setProgressLogs(progRes.data.data.logs);
        setRoleBreakdown(progRes.data.data.roleBreakdown);
        setHealthSummary(progRes.data.data.healthSummary);
      }

      // 4. Fetch Meetings
      const meetRes = await api.get(`/projects/${projectId}/meetings`);
      if (meetRes.data.success) {
        setMeetings({ upcoming: meetRes.data.data.upcoming, past: meetRes.data.data.past });
      }

      // 5. Fetch Docs
      const docRes = await api.get(`/projects/${projectId}/documents`);
      if (docRes.data.success) {
        setDocsData({
          architectureDiagrams: docRes.data.data.architectureDiagrams,
          standardDocuments: docRes.data.data.standardDocuments,
        });
      }

      // 6. Fetch Links
      const linkRes = await api.get(`/projects/${projectId}/links`);
      if (linkRes.data.success) {
        setLinks(linkRes.data.data);
      }

      // 7. Fetch Activity
      const actRes = await api.get(`/projects/${projectId}/activity`);
      if (actRes.data.success) {
        setActivity(actRes.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Access Denied to this project.');
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchProjectDetails();
  }, [fetchProjectDetails]);

  const userMembership = members.find((m) => m.userId === user?.id);
  const currentRole: UserRole = userMembership?.role || 'Frontend Developer';

  if (isLoading) {
    return (
      <div className="p-12 text-center text-slate-400">
        <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-semibold">Loading project workspace...</p>
      </div>
    );
  }

  if (error || !project?.isMember) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 glass-panel rounded-3xl text-center border border-slate-800 space-y-4">
        <Lock className="w-12 h-12 text-amber-400 mx-auto" />
        <h3 className="text-xl font-bold text-slate-100">Protected Project Workspace</h3>
        <p className="text-xs text-slate-400">
          {error || 'This project is protected by a project password. Enter the password to join.'}
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button variant="secondary" size="md" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
          {project && (
            <Button
              variant="glow"
              size="md"
              onClick={() => setLockedProjectToJoin(project)}
              icon={ShieldCheck}
            >
              Enter Password
            </Button>
          )}
        </div>
      </div>
    );
  }

  const tabs: { id: WorkspaceTab; name: string; icon: any }[] = [
    { id: 'overview', name: 'Overview', icon: LayoutDashboard },
    { id: 'team', name: 'Team Roles', icon: Users },
    { id: 'progress', name: 'Daily Progress', icon: TrendingUp },
    { id: 'chat', name: 'Team Chat', icon: MessageSquare },
    { id: 'meetings', name: 'Meetings', icon: Video },
    { id: 'docs', name: 'Docs & Architecture', icon: FileCode2 },
    { id: 'links', name: 'Reference Links', icon: Globe },
    { id: 'info', name: 'Activity & Info', icon: Layers },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Project Banner Header */}
      <div className="p-6 lg:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl glass-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <img
            src={project.logoUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(project.name)}`}
            alt={project.name}
            className="w-16 h-16 rounded-2xl border border-slate-700 bg-slate-800 p-1.5 shrink-0 shadow-lg"
          />
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold text-slate-100">{project.name}</h1>
              <Badge status={project.status} size="sm" />
              {healthSummary && <HealthBadge health={healthSummary.health} reason={healthSummary.healthReason} />}
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">{project.description}</p>
            <div className="flex items-center gap-4 text-xs text-slate-400 mt-3">
              <span>Your Role: <strong className="text-indigo-400">{currentRole}</strong></span>
              <span>Your Progress: <strong className="text-emerald-400">{userMembership?.currentProgress || 0}%</strong></span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <Button
            variant="glow"
            size="md"
            icon={PlusCircle}
            onClick={() => setShowDailyModal(true)}
          >
            Update Daily Progress
          </Button>
        </div>
      </div>

      {/* Sub-Tab Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-glow'
                  : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Workspace Tab Contents */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Gauges & Role Breakdown */}
          <div className="lg:col-span-2 space-y-6">
            <Card glass className="p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <CircularProgress progress={project.overallProgress} label="COMPLETED" />
                <div>
                  <h3 className="text-lg font-bold text-slate-100">Overall Project Completion</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm">
                    Calculated automatically from member role progress updates across the development squad.
                  </p>
                  <div className="mt-4 flex items-center gap-4 text-xs font-semibold text-slate-300">
                    <span>Teammates: <strong className="text-white">{members.length}</strong></span>
                    <span>Recent Logs: <strong className="text-white">{progressLogs.length}</strong></span>
                  </div>
                </div>
              </div>

              <Button variant="secondary" size="sm" onClick={() => setShowDailyModal(true)} icon={PlusCircle}>
                Log Today's Work
              </Button>
            </Card>

            {/* Role Breakdown Bar Chart */}
            <Card glass className="p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4">
                Role Completion Percentages
              </h3>
              <ProgressChart data={roleBreakdown} />
            </Card>

            {/* Role Progress List */}
            <Card glass className="p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4">
                Team Role Breakdown
              </h3>
              <RoleProgressList breakdown={roleBreakdown} />
            </Card>
          </div>

          {/* Sidebar Widgets: Countdown & Meetings */}
          <div className="space-y-6">
            {project.hackathon && <DeadlineCountdown hackathon={project.hackathon} />}

            {/* Next Meeting Card */}
            <Card glass className="p-5 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Upcoming Sync</h4>
                <Button variant="ghost" size="sm" onClick={() => setShowMeetingModal(true)}>
                  + Schedule
                </Button>
              </div>
              {meetings.upcoming.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-2">No upcoming meetings scheduled.</p>
              ) : (
                <MeetingCard meeting={meetings.upcoming[0]} />
              )}
            </Card>

            {/* Tech Stack Box */}
            {project.techStack && (
              <Card glass className="p-5 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Technology Stack</h4>
                <div className="space-y-2 text-xs">
                  {project.techStack.frontend && <div className="p-2 rounded-xl bg-slate-950 border border-slate-800"><span className="text-slate-400">Frontend:</span> <strong className="text-indigo-300">{project.techStack.frontend}</strong></div>}
                  {project.techStack.backend && <div className="p-2 rounded-xl bg-slate-950 border border-slate-800"><span className="text-slate-400">Backend:</span> <strong className="text-purple-300">{project.techStack.backend}</strong></div>}
                  {project.techStack.ai && <div className="p-2 rounded-xl bg-slate-950 border border-slate-800"><span className="text-slate-400">AI / ML:</span> <strong className="text-emerald-300">{project.techStack.ai}</strong></div>}
                  {project.techStack.database && <div className="p-2 rounded-xl bg-slate-950 border border-slate-800"><span className="text-slate-400">Storage:</span> <strong className="text-sky-300">{project.techStack.database}</strong></div>}
                </div>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Tab: Team Roles */}
      {activeTab === 'team' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-100">Project Teammates & Assigned Roles</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {members.map((mem) => (
              <Card key={mem.id} glass className="p-5 flex items-center gap-4">
                <Avatar name={mem.user?.fullName || 'Teammate'} src={mem.user?.avatarUrl} size="lg" />
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-slate-100 truncate">{mem.user?.fullName}</h4>
                  <p className="text-xs text-indigo-400 font-semibold">{mem.role}</p>
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Progress:</span>
                    <span className="font-extrabold text-emerald-400">{mem.currentProgress}%</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Daily Progress Logs */}
      {activeTab === 'progress' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-100">Daily Progress Update Stream</h3>
            <Button variant="glow" size="sm" icon={PlusCircle} onClick={() => setShowDailyModal(true)}>
              Submit Update
            </Button>
          </div>

          <div className="space-y-4">
            {progressLogs.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No daily progress logs submitted yet.</p>
            ) : (
              progressLogs.map((log) => (
                <Card key={log.id} glass className="p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={log.userName} size="sm" />
                      <div>
                        <h4 className="text-sm font-bold text-slate-100">{log.userName}</h4>
                        <p className="text-[11px] text-indigo-400 font-medium">{log.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-black text-emerald-400">{log.progressPercentage}%</span>
                      <p className="text-[10px] text-slate-400">{log.date}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">Completed Today</p>
                      <p className="text-slate-200 mt-1 whitespace-pre-wrap">{log.completedToday}</p>
                    </div>
                    <div>
                      <p className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">Currently Working On</p>
                      <p className="text-slate-200 mt-1 whitespace-pre-wrap">{log.currentlyWorkingOn}</p>
                    </div>
                  </div>

                  {log.blockers && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
                      <strong>Blocker Flagged ({log.blockerStatus}):</strong> {log.blockers}
                    </div>
                  )}
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab: Team Chat */}
      {activeTab === 'chat' && (
        <ChatRoom projectId={project.id} projectName={project.name} isMember={project.isMember} />
      )}

      {/* Tab: Meetings */}
      {activeTab === 'meetings' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-100">Scheduled Team Syncs</h3>
            <Button variant="glow" size="sm" icon={Video} onClick={() => setShowMeetingModal(true)}>
              Schedule Meeting
            </Button>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Upcoming Meetings</h4>
              {meetings.upcoming.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No upcoming meetings scheduled.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {meetings.upcoming.map((m) => (
                    <MeetingCard key={m.id} meeting={m} />
                  ))}
                </div>
              )}
            </div>

            {meetings.past.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Past Meetings</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {meetings.past.map((m) => (
                    <MeetingCard key={m.id} meeting={m} isPast />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Docs & Architecture */}
      {activeTab === 'docs' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-100">Project Documentation & Architecture Diagrams</h3>
            <Button variant="glow" size="sm" icon={Upload} onClick={() => setShowDocModal(true)}>
              Upload Document
            </Button>
          </div>

          {/* Architecture Gallery */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-3">
              Architecture Diagrams
            </h4>
            <ArchitectureGallery
              diagrams={docsData.architectureDiagrams}
              projectId={project.id}
              onRefresh={fetchProjectDetails}
            />
          </div>

          {/* Standard Documents */}
          <div className="pt-4 border-t border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Standard Manuals & Requirements
            </h4>
            <DocumentList
              documents={docsData.standardDocuments}
              projectId={project.id}
              onRefresh={fetchProjectDetails}
            />
          </div>
        </div>
      )}

      {/* Tab: Reference Links */}
      {activeTab === 'links' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-100">External Reference Links & APIs</h3>
            <Button variant="glow" size="sm" icon={Globe} onClick={() => setShowLinkModal(true)}>
              Add Link
            </Button>
          </div>
          <LinkList links={links} projectId={project.id} onRefresh={fetchProjectDetails} />
        </div>
      )}

      {/* Tab: Activity Timeline & Project Info */}
      {activeTab === 'info' && (
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-100">Project Activity Timeline</h3>
          <div className="space-y-3">
            {activity.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No activity recorded yet.</p>
            ) : (
              activity.map((item) => (
                <div key={item.id} className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-200">
                      {item.userName} <span className="font-normal text-slate-400">{item.action}</span>
                    </p>
                    {item.details && <p className="text-slate-400 mt-0.5 italic">{item.details}</p>}
                    <p className="text-[10px] text-slate-500 mt-1">{new Date(item.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Daily Progress Modal */}
      {showDailyModal && (
        <DailyProgressModal
          projectId={project.id}
          currentRole={currentRole}
          isOpen={showDailyModal}
          onClose={() => setShowDailyModal(false)}
          onSuccess={fetchProjectDetails}
        />
      )}

      {/* Schedule Meeting Modal */}
      {showMeetingModal && (
        <ScheduleMeetingModal
          projectId={project.id}
          isOpen={showMeetingModal}
          onClose={() => setShowMeetingModal(false)}
          onSuccess={fetchProjectDetails}
        />
      )}

      {/* Upload Document Modal */}
      {showDocModal && (
        <DocumentUploader
          projectId={project.id}
          isOpen={showDocModal}
          onClose={() => setShowDocModal(false)}
          onSuccess={fetchProjectDetails}
        />
      )}

      {/* Add Link Modal */}
      {showLinkModal && (
        <AddLinkModal
          projectId={project.id}
          isOpen={showLinkModal}
          onClose={() => setShowLinkModal(false)}
          onSuccess={fetchProjectDetails}
        />
      )}
    </div>
  );
};
