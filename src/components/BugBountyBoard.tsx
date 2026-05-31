import React from 'react';
import { motion } from 'motion/react';
import { Bug, DollarSign, Target, Award, ArrowUpRight, TrendingUp, Search } from 'lucide-react';
import { mockBounties } from '../data';
import StatCard from './StatCard';
import { cn } from '@/src/lib/utils';

export default function BugBountyBoard() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Active Programs" 
          value={mockBounties.length} 
          icon={Bug} 
          description="Managed intelligence campaigns"
        />
        <StatCard 
          title="Avg Payout" 
          value="$3,200" 
          icon={DollarSign} 
          trend={{ value: 15, isUp: true }}
          description="Market-aligned incentive rates"
        />
        <StatCard 
          title="Bounty Efficiency" 
          value="84" 
          icon={Award} 
          description="Bounty Efficiency Score™ avg"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Bug Bounty Prioritization</h2>
            <p className="text-sm text-zinc-500">Autonomous surface mapping & vulnerability forecasting</p>
          </div>
          <button className="px-6 py-2 bg-indigo-600 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-indigo-500 transition-colors">
            <Target className="w-4 h-4" />
            Launch New Target
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {mockBounties.sort((a, b) => b.bountyEfficiencyScore - a.bountyEfficiencyScore).map((bounty, idx) => (
            <motion.div
              key={bounty.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group bg-[#0f0f12] border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-all flex flex-col md:flex-row items-start md:items-center gap-6"
            >
              <div className="p-4 bg-zinc-800 rounded-xl group-hover:bg-indigo-600/10 group-hover:text-indigo-400 transition-colors shrink-0">
                <Target className="w-6 h-6" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-bold text-zinc-100 truncate">{bounty.programName}</h3>
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-[0.1em]",
                    bounty.criticality === 'critical' ? "bg-red-500/10 text-red-500" : "bg-orange-500/10 text-orange-500"
                  )}>
                    {bounty.criticality}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-zinc-500 font-mono">
                  <span>Target: {bounty.target}</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:inline">Active since {new Date(bounty.discoveryDate).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-12 shrink-0">
                <div className="text-center w-24">
                  <p className="text-[10px] uppercase font-bold text-zinc-500 mb-1">Potential Reward</p>
                  <p className="text-xl font-bold text-white">${bounty.reward.toLocaleString()}</p>
                </div>
                
                <div className="text-center w-24 relative">
                  <p className="text-[10px] uppercase font-bold text-zinc-500 mb-1">BES Score™</p>
                  <div className="flex items-center justify-center gap-1 text-green-500">
                    <TrendingUp className="w-3 h-3" />
                    <p className="text-xl font-bold">{bounty.bountyEfficiencyScore}</p>
                  </div>
                  {bounty.bountyEfficiencyScore > 90 && (
                    <motion.div 
                      className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-500 rounded-full"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    />
                  )}
                </div>

                <button className="p-3 rounded-xl bg-zinc-800 text-zinc-400 group-hover:bg-white group-hover:text-zinc-900 transition-all">
                  <ArrowUpRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-indigo-600/5 border border-indigo-500/20 flex flex-col md:flex-row items-center gap-6">
        <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-600/20">
          <Award className="w-6 h-6 text-white" />
        </div>
        <div>
          <h4 className="font-bold text-zinc-100">Bounty Efficiency Score™ Formula</h4>
          <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
            T&F SOC+Offensive autonomously calculates BES™ by correlating asset criticality, historical vulnerability density, and current exploitability metrics in the wild.
          </p>
        </div>
        <button className="md:ml-auto px-6 py-2 bg-zinc-100 text-zinc-900 rounded-xl text-sm font-bold hover:bg-white transition-colors">
          Audit Formula
        </button>
      </div>
    </div>
  );
}
