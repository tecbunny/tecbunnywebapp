'use client';

import * as React from 'react';
import { Trophy, Medal, Star, TrendingUp, DollarSign } from 'lucide-react';
import { Card, Badge } from '@tecbunny/ui';

const LEADERBOARD_DATA = [
  { id: '1', name: 'Rahul Sharma', revenue: 1850000, target: 2000000, leads_closed: 24, rank: 1, avatar: 'RS' },
  { id: '2', name: 'Sneha Patel', revenue: 1520000, target: 2000000, leads_closed: 18, rank: 2, avatar: 'SP' },
  { id: '3', name: 'Ajay Singh', revenue: 1240000, target: 1500000, leads_closed: 15, rank: 3, avatar: 'AS' },
  { id: '4', name: 'Vikram Mehta', revenue: 850000, target: 1500000, leads_closed: 9, rank: 4, avatar: 'VM' },
];

export default function SalesLeaderboard() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8 p-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground tech-heading">Sales Leaderboard</h1>
          <p className="text-xs text-muted-foreground font-light mt-0.5 font-sans">
            Monthly performance and revenue gamification.
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary" className="px-3 py-1 bg-amber-100 text-amber-800 border-amber-200">
            <Trophy className="w-3 h-3 mr-2" /> July 2026 Sprint
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Top 3 podium */}
        {LEADERBOARD_DATA.slice(0, 3).map((exec, idx) => (
          <Card key={exec.id} className={`p-6 relative overflow-hidden ${
            idx === 0 ? 'bg-gradient-to-b from-amber-50 to-amber-100 border-amber-300 transform md:-translate-y-4' : 
            idx === 1 ? 'bg-gradient-to-b from-slate-50 to-slate-100 border-slate-300' : 
            'bg-gradient-to-b from-orange-50 to-orange-100 border-orange-300 transform md:translate-y-4'
          }`}>
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Trophy className="w-24 h-24" />
            </div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-lg mb-4 ${
                idx === 0 ? 'bg-amber-500' : idx === 1 ? 'bg-slate-400' : 'bg-orange-500'
              }`}>
                {exec.avatar}
              </div>
              
              <div className="flex items-center gap-2 mb-1">
                {idx === 0 ? <Medal className="w-5 h-5 text-amber-600" /> : 
                 idx === 1 ? <Medal className="w-5 h-5 text-slate-500" /> : 
                 <Medal className="w-5 h-5 text-orange-600" />}
                <h2 className="text-lg font-bold text-slate-800">{exec.name}</h2>
              </div>
              
              <div className="text-2xl font-black text-slate-900 my-2 font-mono">
                ₹{(exec.revenue / 100000).toFixed(1)}L
              </div>
              
              <div className="w-full mt-4 space-y-1">
                <div className={`flex justify-between text-[10px] uppercase font-semibold ${
                  idx === 0 ? 'text-amber-700/70' : idx === 1 ? 'text-slate-600/70' : 'text-orange-700/70'
                }`}>
                  <span>Target</span>
                  <span>{Math.round((exec.revenue / exec.target) * 100)}%</span>
                </div>
                <div className={`w-full h-2 rounded-full overflow-hidden ${
                  idx === 0 ? 'bg-amber-200' : idx === 1 ? 'bg-slate-200' : 'bg-orange-200'
                }`}>
                  <div 
                    className={`h-full rounded-full ${
                      idx === 0 ? 'bg-amber-500' : idx === 1 ? 'bg-slate-500' : 'bg-orange-500'
                    }`}
                    style={{ width: `${Math.min(100, (exec.revenue / exec.target) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="bg-white rounded-xl border shadow-sm mt-12">
        <div className="px-6 py-4 border-b">
          <h3 className="font-semibold flex items-center gap-2">
            <Star className="w-4 h-4 text-indigo-500" /> Full Rankings
          </h3>
        </div>
        <div className="divide-y">
          {LEADERBOARD_DATA.map(exec => (
            <div key={exec.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-xs">
                  #{exec.rank}
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{exec.name}</h4>
                  <p className="text-xs text-muted-foreground">{exec.leads_closed} deals closed</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-mono font-bold text-indigo-600">
                  ₹{(exec.revenue).toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  Target: ₹{(exec.target).toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
