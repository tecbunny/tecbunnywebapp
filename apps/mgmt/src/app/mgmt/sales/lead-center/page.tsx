'use client';

import * as React from 'react';
import { Flame, ThermometerSun, Snowflake, Skull, TrendingUp, Users, Target, PhoneCall } from 'lucide-react';
import { Card, Button, Badge } from '@tecbunny/ui';

const MOCK_LEADS = [
  { id: '1', name: 'Rajesh Kumar', req: 'Office CCTV 16 Ch', heat: 'HOT', score: 95, status: 'QUALIFIED' },
  { id: '2', name: 'Sneha Patel', req: 'Home Biometric Lock', heat: 'WARM', score: 65, status: 'CONTACTED' },
  { id: '3', name: 'TechCorp IT', req: 'Enterprise Network Setup', heat: 'HOT', score: 88, status: 'NEW' },
  { id: '4', name: 'Ajay Singh', req: 'Query about AMC', heat: 'COLD', score: 30, status: 'NEW' },
];

export default function LeadCenter() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8 p-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground tech-heading">Revenue Engine: Lead Center</h1>
          <p className="text-xs text-muted-foreground font-light mt-0.5 font-sans">
            AI-Qualified leads prioritized by heat level and conversion likelihood.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><PhoneCall className="w-4 h-4 mr-2" /> Start Dialing</Button>
        </div>
      </div>

      {/* Intelligence Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-orange-600 uppercase">Hot Leads</p>
              <h3 className="text-2xl font-bold text-orange-700 mt-1">24</h3>
            </div>
            <Flame className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-[10px] text-orange-600/70 mt-2">Needs immediate follow-up</p>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-amber-600 uppercase">Warm Leads</p>
              <h3 className="text-2xl font-bold text-amber-700 mt-1">56</h3>
            </div>
            <ThermometerSun className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-[10px] text-amber-600/70 mt-2">Nurture sequence active</p>
        </Card>

        <Card className="p-4 bg-slate-50 border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-600 uppercase">Total Pipeline</p>
              <h3 className="text-2xl font-bold text-slate-700 mt-1">₹4.2M</h3>
            </div>
            <TrendingUp className="w-5 h-5 text-slate-500" />
          </div>
          <p className="text-[10px] text-slate-500/70 mt-2">Estimated from requirements</p>
        </Card>

        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-blue-600 uppercase">Conversion</p>
              <h3 className="text-2xl font-bold text-blue-700 mt-1">18.5%</h3>
            </div>
            <Target className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-[10px] text-blue-500/70 mt-2">+2% this week</p>
        </Card>
      </div>

      {/* Lead Heat Map Kanban */}
      <div>
        <h2 className="text-lg font-semibold text-foreground tech-heading mb-4">Lead Heat Map</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[600px]">
          {/* HOT */}
          <div className="bg-orange-50/50 rounded-lg p-3 border border-orange-100 flex flex-col gap-3">
            <h3 className="text-xs font-bold text-orange-700 flex items-center gap-2 uppercase tracking-wider mb-2">
              <Flame className="w-4 h-4" /> Hot (Score &gt; 80)
            </h3>
            {MOCK_LEADS.filter(l => l.heat === 'HOT').map(lead => (
              <Card key={lead.id} className="p-3 shadow-sm border-orange-200 cursor-pointer hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-semibold text-sm">{lead.name}</span>
                  <span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded font-mono">{lead.score}/100</span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{lead.req}</p>
                <div className="mt-3 flex justify-between items-center">
                  <span className="text-[9px] uppercase font-semibold text-slate-500">{lead.status}</span>
                  <Button size="sm" variant="ghost" className="h-6 text-xs text-indigo-600">Action</Button>
                </div>
              </Card>
            ))}
          </div>
          
          {/* WARM */}
          <div className="bg-amber-50/50 rounded-lg p-3 border border-amber-100 flex flex-col gap-3">
            <h3 className="text-xs font-bold text-amber-700 flex items-center gap-2 uppercase tracking-wider mb-2">
              <ThermometerSun className="w-4 h-4" /> Warm (50-80)
            </h3>
            {MOCK_LEADS.filter(l => l.heat === 'WARM').map(lead => (
              <Card key={lead.id} className="p-3 shadow-sm border-amber-200 cursor-pointer hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-semibold text-sm">{lead.name}</span>
                  <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-mono">{lead.score}/100</span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{lead.req}</p>
                <div className="mt-3 flex justify-between items-center">
                  <span className="text-[9px] uppercase font-semibold text-slate-500">{lead.status}</span>
                  <Button size="sm" variant="ghost" className="h-6 text-xs text-indigo-600">Action</Button>
                </div>
              </Card>
            ))}
          </div>

          {/* COLD */}
          <div className="bg-slate-50/50 rounded-lg p-3 border border-slate-100 flex flex-col gap-3">
            <h3 className="text-xs font-bold text-slate-700 flex items-center gap-2 uppercase tracking-wider mb-2">
              <Snowflake className="w-4 h-4" /> Cold (20-49)
            </h3>
            {MOCK_LEADS.filter(l => l.heat === 'COLD').map(lead => (
              <Card key={lead.id} className="p-3 shadow-sm border-slate-200 cursor-pointer hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-semibold text-sm">{lead.name}</span>
                  <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono">{lead.score}/100</span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{lead.req}</p>
                <div className="mt-3 flex justify-between items-center">
                  <span className="text-[9px] uppercase font-semibold text-slate-500">{lead.status}</span>
                  <Button size="sm" variant="ghost" className="h-6 text-xs text-indigo-600">Action</Button>
                </div>
              </Card>
            ))}
          </div>

          {/* DEAD */}
          <div className="bg-zinc-50/50 rounded-lg p-3 border border-zinc-100 flex flex-col gap-3 opacity-70">
            <h3 className="text-xs font-bold text-zinc-500 flex items-center gap-2 uppercase tracking-wider mb-2">
              <Skull className="w-4 h-4" /> Dead (&lt;20)
            </h3>
            {/* Dead leads will appear here */}
          </div>
        </div>
      </div>
    </div>
  );
}
