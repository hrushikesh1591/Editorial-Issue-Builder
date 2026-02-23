
import React from 'react';
import { Article } from '../types';

interface DashboardProps {
  articles: Article[];
}

const Dashboard: React.FC<DashboardProps> = ({ articles }) => {
  const activeArticles = articles.filter(a => a.selected || a.downloaded);
  const totalPages = activeArticles.reduce((sum, a) => sum + (Number(a.article_last_page) || 0), 0);
  
  const rubricCount = activeArticles.reduce((acc, a) => {
    acc[a.rubric] = (acc[a.rubric] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topicCount = activeArticles.reduce((acc, a) => {
    acc[a.topic] = (acc[a.topic] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const rubricsList = (Object.entries(rubricCount) as [string, number][]).sort((a, b) => b[1] - a[1]);
  const topicsList = (Object.entries(topicCount) as [string, number][]).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Articles in Scope</p>
          <div className="flex items-end justify-between">
            <h4 className="text-4xl font-serif font-bold text-slate-900">{activeArticles.length}</h4>
            <div className="text-emerald-500 bg-emerald-50 px-2 py-1 rounded text-[10px] font-bold">
              {Math.round((activeArticles.length / (articles.length || 1)) * 100)}% of total
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Estimated Page Count</p>
          <div className="flex items-end justify-between">
            <h4 className="text-4xl font-serif font-bold text-slate-900">{totalPages}</h4>
            <p className="text-slate-400 text-xs mb-1">Approx. volume</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Download Progress</p>
          <div className="flex items-end justify-between">
            <h4 className="text-4xl font-serif font-bold text-slate-900">
              {activeArticles.filter(a => a.downloaded).length}/{activeArticles.length}
            </h4>
            <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
              <div 
                className="bg-slate-900 h-full transition-all duration-500" 
                style={{ width: `${(activeArticles.filter(a => a.downloaded).length / (activeArticles.length || 1)) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
          <h5 className="font-serif text-lg font-bold mb-6 flex items-center">
            <i className="fas fa-tags mr-3 text-slate-400"></i>
            Rubric Breakdown
          </h5>
          {activeArticles.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-slate-400 space-y-2">
              <p className="text-sm italic">Select articles or mark for download to see distribution</p>
            </div>
          ) : (
            <div className="space-y-4">
              {rubricsList.map(([name, count]) => (
                <div key={name}>
                  <div className="flex justify-between text-[10px] font-bold uppercase mb-1">
                    <span className="text-slate-600">{name || 'Uncategorized'}</span>
                    <span className="text-slate-400">{count} articles</span>
                  </div>
                  <div className="h-2 bg-slate-50 rounded-full overflow-hidden flex">
                    <div 
                      className="bg-slate-300 h-full transition-all duration-500"
                      style={{ width: `${(count / activeArticles.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
          <h5 className="font-serif text-lg font-bold mb-6 flex items-center">
            <i className="fas fa-stethoscope mr-3 text-slate-400"></i>
            Clinical Topic Distribution
          </h5>
          {activeArticles.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-slate-400 space-y-2">
              <p className="text-sm italic">Categorization stats will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {topicsList.map(([name, count]) => (
                <div key={name}>
                  <div className="flex justify-between text-[10px] font-bold uppercase mb-1">
                    <span className="text-slate-600">{name}</span>
                    <span className="text-slate-400">{count} papers</span>
                  </div>
                  <div className="h-2 bg-slate-50 rounded-full overflow-hidden flex">
                    <div 
                      className="bg-indigo-400 h-full transition-all duration-500"
                      style={{ width: `${(count / activeArticles.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
