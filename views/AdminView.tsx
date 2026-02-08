
import React from 'react';
import { ArrowLeft, Users, AlertCircle, TrendingUp, Filter, Search, ChevronRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TREND_DATA = [
  { week: 'W1', attendance: 85 },
  { week: 'W2', attendance: 82 },
  { week: 'W3', attendance: 78 },
  { week: 'W4', attendance: 88 },
  { week: 'W5', attendance: 75 },
  { week: 'W6', attendance: 70 },
];

const AT_RISK_STUDENTS = [
  { id: '1', name: 'James Morrison', module: 'COMP3001', risk: 'Critical', score: 35 },
  { id: '2', name: 'Sarah Finch', module: 'LUBS1000', risk: 'High', score: 48 },
  { id: '3', name: 'Daniel Park', module: 'COMP3220', risk: 'High', score: 52 },
];

interface AdminViewProps {
  onBack: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ onBack }) => {
  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 pb-24">
      <div className="bg-white dark:bg-gray-800 p-4 shadow-sm flex items-center justify-between sticky top-0 z-40 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-1">
            <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>
          <h2 className="text-xl font-bold">Staff Hub</h2>
        </div>
        <button className="p-2 text-gray-500"><Filter className="w-5 h-5" /></button>
      </div>

      <div className="p-4 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <Users className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">Total Students</span>
            </div>
            <div className="text-2xl font-black text-gray-900 dark:text-white">1,248</div>
            <div className="text-[10px] text-green-600 font-bold">+12% from last term</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 text-red-500 mb-1">
              <AlertCircle className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">At Risk</span>
            </div>
            <div className="text-2xl font-black text-gray-900 dark:text-white text-red-600">42</div>
            <div className="text-[10px] text-red-500 font-bold">+5 since yesterday</div>
          </div>
        </div>

        {/* Line Chart */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-leeds-blue" />
            Attendance Trends
          </h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={TREND_DATA} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis 
                  dataKey="week" 
                  tick={{fontSize: 10}} 
                  axisLine={false} 
                  tickLine={false} 
                  dy={10}
                />
                <YAxis hide domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                  cursor={{stroke: '#ccc', strokeWidth: 1}}
                />
                <Line 
                  type="monotone" 
                  dataKey="attendance" 
                  stroke="#0057B8" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#0057B8', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* At Risk List */}
        <div>
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="font-bold text-gray-900 dark:text-white">High Priority Students</h3>
            <button className="text-xs text-leeds-blue font-bold">View All</button>
          </div>
          <div className="space-y-3">
            {AT_RISK_STUDENTS.map(student => (
              <button key={student.id} className="w-full bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between active:scale-95 transition-all">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${student.risk === 'Critical' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                    {student.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">{student.name}</h4>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{student.module}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className={`text-xs font-black ${student.risk === 'Critical' ? 'text-red-600' : 'text-orange-600'}`}>{student.risk}</div>
                    <div className="text-[10px] text-gray-400">{student.score}% Engagement</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
