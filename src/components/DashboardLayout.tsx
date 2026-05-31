import React from 'react';
import { motion } from 'motion/react';
import { Shield, Target, Activity, Bug, LayoutDashboard, Settings, Bell, Menu, X, LogOut } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useAuth } from './FirebaseProvider';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const tabs = [
  { id: 'overview', name: 'SOC Overview', icon: LayoutDashboard },
  { id: 'attack-surface', name: 'Attack Surface', icon: Target },
  { id: 'drift', name: 'AI Behavior Drift', icon: Activity },
  { id: 'bounty', name: 'Bug Bounty', icon: Bug },
];

export default function DashboardLayout({ children, activeTab, setActiveTab }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen bg-[#0a0a0c] text-zinc-100 font-sans">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 260 : 80 }}
        className="border-r border-zinc-800 bg-[#0f0f12] flex flex-col relative"
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          {isSidebarOpen && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-bold text-xl tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent"
            >
              T&F SOC+Offensive
            </motion.span>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
                  isActive 
                    ? "bg-indigo-600/10 text-indigo-400 border border-indigo-600/20" 
                    : "text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-300"
                )}
              >
                <Icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", isActive && "text-indigo-400")} />
                {isSidebarOpen && (
                  <span className="font-medium text-sm tracking-wide">{tab.name}</span>
                )}
                {isActive && isSidebarOpen && (
                  <motion.div 
                    layoutId="active-pill"
                    className="ml-auto w-1 h-4 bg-indigo-500 rounded-full"
                  />
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-zinc-800/50 space-y-2">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-zinc-500 hover:text-zinc-300 transition-colors">
            <Settings className="w-5 h-5" />
            {isSidebarOpen && <span className="text-sm font-medium">Settings</span>}
          </button>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            {isSidebarOpen && <span className="text-sm font-medium">Collapse</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto flex flex-col bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-950/10 via-[#0a0a0c] to-[#0a0a0c]">
        {/* Header */}
        <header className="h-16 border-b border-zinc-800/50 flex items-center justify-between px-8 bg-[#0a0a0c]/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <h1 className="text-zinc-400 font-medium text-sm">
              Dashboard / <span className="text-white capitalize">{activeTab.replace('-', ' ')}</span>
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative">
              <Bell className="w-5 h-5 text-zinc-500 cursor-pointer hover:text-indigo-400 transition-colors" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-zinc-900" />
            </div>
            <div className="flex items-center gap-3 pl-6 border-l border-zinc-800">
              <div className="text-right">
                <p className="text-sm font-medium text-zinc-200">{user?.displayName || 'SOC Analyst'}</p>
                <div className="flex items-center gap-2 justify-end">
                  <button 
                    onClick={logout}
                    className="text-[10px] text-zinc-500 hover:text-red-400 font-mono tracking-tighter uppercase flex items-center gap-1 transition-colors"
                  >
                    <LogOut className="w-3 h-3" />
                    Sign Out
                  </button>
                  <span className="text-[10px] text-green-500 font-mono tracking-tighter uppercase">● System Live</span>
                </div>
              </div>
              <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600" />
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-[1600px] mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
