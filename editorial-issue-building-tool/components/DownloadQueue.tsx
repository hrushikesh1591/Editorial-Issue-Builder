
import React from 'react';
import { Article } from '../types';

interface DownloadQueueProps {
  selectedArticles: Article[];
  onToggleDownloaded: (id: string) => void;
}

const DownloadQueue: React.FC<DownloadQueueProps> = ({ selectedArticles, onToggleDownloaded }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
      <div className="mb-8">
        <h2 className="font-serif text-2xl font-bold mb-2">Download Queue</h2>
        <p className="text-slate-500 text-sm">
          Navigate to each DOI quickly to download PDFs from the journal portal.
        </p>
      </div>

      {selectedArticles.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400 space-y-4 border-2 border-dashed border-slate-100 rounded-xl">
          <i className="fas fa-list-check text-4xl opacity-20"></i>
          <p className="text-lg">Your queue is empty.</p>
          <p className="text-sm">Go to 'Curation Table' and select articles to add them here.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {selectedArticles.map(article => (
            <div 
              key={article.id}
              className={`p-4 rounded-lg border flex items-center justify-between transition-all ${
                article.downloaded ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
              }`}
            >
              <div className="flex-1 min-w-0 mr-4">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="bg-slate-100 text-[9px] font-bold px-1.5 py-0.5 rounded text-slate-500">
                    {article.editorial_ms_number}
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">
                    {article.rubric}
                  </span>
                </div>
                <h4 className="font-semibold text-slate-900 truncate" title={article.article_title}>
                  {article.article_title}
                </h4>
                <p className="text-xs text-slate-500">{article.fullAuthor}</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => onToggleDownloaded(article.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                    article.downloaded 
                      ? 'text-emerald-700 bg-emerald-100' 
                      : 'text-slate-400 bg-slate-100 hover:text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <i className={`fas ${article.downloaded ? 'fa-check-circle' : 'fa-circle'}`}></i>
                  <span>{article.downloaded ? 'Downloaded' : 'Mark DL'}</span>
                </button>

                <a 
                  href={`https://doi.org/${article.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    // Auto-mark as downloaded if clicking (optional UX preference)
                    // onToggleDownloaded(article.id);
                  }}
                  className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-800 transition-all flex items-center space-x-2 shadow-sm"
                >
                  <span>Open DOI</span>
                  <i className="fas fa-external-link-alt text-[10px]"></i>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedArticles.length > 0 && (
        <div className="mt-8 p-4 bg-amber-50 rounded-lg border border-amber-100 flex items-start space-x-3">
          <i className="fas fa-info-circle text-amber-500 mt-1"></i>
          <div>
            <p className="text-xs text-amber-800 font-bold mb-1">Curation Note</p>
            <p className="text-xs text-amber-700 leading-relaxed">
              Ensure you are logged into the Journal CMS in a separate tab for seamless PDF access. 
              The DOI links will open in new browser tabs.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DownloadQueue;
