
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-10">
      <div className="flex items-center justify-between max-w-[1600px] mx-auto">
        <div className="flex items-center space-x-3">
          <div className="bg-slate-900 text-white p-2 rounded">
            <i className="fas fa-feather-alt text-xl"></i>
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold tracking-tight">Editorial Issue Builder</h1>
            <p className="text-slate-500 text-xs uppercase tracking-widest font-semibold">Curation Dashboard v2.0</p>
          </div>
        </div>
        <div className="flex items-center space-x-6 text-sm text-slate-500">
          <div className="flex items-center">
            <i className="far fa-calendar-alt mr-2"></i>
            <span>{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} Issue</span>
          </div>
          <div className="h-4 w-[1px] bg-slate-200"></div>
          <button className="hover:text-slate-900 transition-colors">
            <i className="fas fa-cog"></i>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
