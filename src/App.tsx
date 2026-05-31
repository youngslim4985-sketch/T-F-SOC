import React from 'react';
import { motion } from 'motion/react';
import DashboardLayout from './components/DashboardLayout';
import SOCOverview from './components/SOCOverview';
import AttackSurface from './components/AttackSurface';
import AIDriftMonitor from './components/AIDriftMonitor';
import BugBountyBoard from './components/BugBountyBoard';
import { useAuth } from './components/FirebaseProvider';
import { Shield, Lock } from 'lucide-react';

export default function App() {
  const { user, loading, signIn } = useAuth();
  const [activeTab, setActiveTab] = React.useState('overview');

  if (loading) {
    return (
      <div className="h-screen bg-[#0a0a0c] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen bg-[#0a0a0c] flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-950/20 via-[#0a0a0c] to-[#0a0a0c]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-[#0f0f12] border border-zinc-800 p-10 rounded-3xl text-center space-y-8 shadow-2xl"
        >
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <Shield className="w-10 h-10 text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white tracking-tight">T & F SOC+Offensive</h1>
            <p className="text-zinc-500 text-sm">Autonomous SOC Intelligence & Threat Detection</p>
          </div>
          <div className="flex items-center gap-3 justify-center text-xs text-zinc-600 font-mono uppercase tracking-widest bg-zinc-900/50 py-3 rounded-xl border border-zinc-800">
            <Lock className="w-3 h-3" />
            <span>Secure Access Point</span>
          </div>
          <button 
            onClick={signIn}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98]"
          >
            Authenticate with Google
          </button>
          <p className="text-[10px] text-zinc-700 leading-relaxed uppercase tracking-tighter">
            Internal use only • Property of Sentinel Security Corp • Unauthorized access monitored
          </p>
        </motion.div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <SOCOverview />;
      case 'attack-surface':
        return <AttackSurface />;
      case 'drift':
        return <AIDriftMonitor />;
      case 'bounty':
        return <BugBountyBoard />;
      default:
        return <SOCOverview />;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <motion.div 
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {renderContent()}
      </motion.div>
    </DashboardLayout>
  );
}
