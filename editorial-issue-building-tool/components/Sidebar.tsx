
import React from 'react';
import { Article, Filters, SURGICAL_TOPICS } from '../types';

interface SidebarProps {
  articles: Article[];
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  onExport: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ articles, filters, setFilters, onExport }) => {
  const rubrics = Array.from(new Set(articles.map(a => a.rubric))).filter((r): r is string => !!r).sort();
  const productionStates = Array.from(new Set(articles.map(a => a.production_state))).filter((s): s is string => !!s).sort();

  const handleRubricToggle = (rubric: string) => {
    setFilters(prev => ({
      ...prev,
      rubrics: prev.rubrics.includes(rubric) 
        ? prev.rubrics.filter(r => r !== rubric)
        : [...prev.rubrics, rubric]
    }));
  };

  const handleStateToggle = (state: string) => {
    setFilters(prev => ({
      ...prev,
      productionStates: prev.productionStates.includes(state)
        ? prev.productionStates.filter(s => s !== state)
        : [...prev.productionStates, state]
    }));
  };

  const handleTopicToggle = (topic: string) => {
    setFilters(prev => ({
      ...prev,
      topics: prev.topics.includes(topic)
        ? prev.topics.filter(t => t !== topic)
        : [...prev.topics, topic]
    }));
  };

  const clearFilters = () => {
    setFilters({ rubrics: [], productionStates: [], topics: [], dateRange: ['', ''] });
  };

  return (
    <aside className="w-72 bg-white border-r border-slate-200 h-screen sticky top-0 overflow-y-auto p-6 flex flex-col shrink-0">
      <div className="mb-8">
        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Filters</h3>
        
        <div className="space-y-6">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2">Surgical Topic</label>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-2">
              {SURGICAL_TOPICS.map(topic => (
                <label key={topic} className="flex items-center text-sm cursor-pointer hover:text-slate-600">
                  <input 
                    type="checkbox" 
                    className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 mr-2"
                    checked={filters.topics.includes(topic)}
                    onChange={() => handleTopicToggle(topic)}
                  />
                  <span className="truncate">{topic}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2">Rubric</label>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-2">
              {rubrics.map(rubric => (
                <label key={rubric} className="flex items-center text-sm cursor-pointer hover:text-slate-600">
                  <input 
                    type="checkbox" 
                    className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 mr-2"
                    checked={filters.rubrics.includes(rubric)}
                    onChange={() => handleRubricToggle(rubric)}
                  />
                  <span className="truncate">{rubric}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2">Production State</label>
            <div className="space-y-1">
              {productionStates.map(state => (
                <label key={state} className="flex items-center text-sm cursor-pointer hover:text-slate-600">
                  <input 
                    type="checkbox" 
                    className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 mr-2"
                    checked={filters.productionStates.includes(state)}
                    onChange={() => handleStateToggle(state)}
                  />
                  <span>{state}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2">Online First Date Range</label>
            <div className="space-y-2">
              <input 
                type="date" 
                className="w-full text-sm border-slate-200 rounded p-1"
                value={filters.dateRange[0]}
                onChange={e => setFilters(prev => ({ ...prev, dateRange: [e.target.value, prev.dateRange[1]] }))}
              />
              <input 
                type="date" 
                className="w-full text-sm border-slate-200 rounded p-1"
                value={filters.dateRange[1]}
                onChange={e => setFilters(prev => ({ ...prev, dateRange: [prev.dateRange[0], e.target.value] }))}
              />
            </div>
          </div>
        </div>

        <button 
          onClick={clearFilters}
          className="mt-6 text-xs text-slate-400 hover:text-slate-900 font-medium transition-colors"
        >
          Clear all filters
        </button>
      </div>

      <div className="mt-auto pt-6 border-t border-slate-100">
        <button 
          onClick={onExport}
          className="w-full bg-slate-900 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-slate-800 transition-all shadow-lg active:scale-95"
        >
          <i className="fas fa-file-excel"></i>
          <span>Export Plan</span>
        </button>
        <p className="text-[10px] text-center text-slate-400 mt-3 italic">
          Final_Issue_Plan_{new Date().toISOString().split('T')[0]}
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
