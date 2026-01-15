
import React from 'react';
import { Article, SURGICAL_TOPICS } from '../types';

interface ArticleTableProps {
  articles: Article[];
  onToggleSelect: (id: string) => void;
  onToggleDownloaded: (id: string) => void;
  onUpdateTopic: (id: string, newTopic: string) => void;
}

const ArticleTable: React.FC<ArticleTableProps> = ({ articles, onToggleSelect, onToggleDownloaded, onUpdateTopic }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 w-12 text-center">Issue</th>
              <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 w-12 text-center">DL</th>
              <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 min-w-[150px]">Author</th>
              <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 min-w-[250px]">Article Title</th>
              <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Surgical Topic</th>
              <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Rubric</th>
              <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Status</th>
              <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">DOI</th>
            </tr>
          </thead>
          <tbody>
            {articles.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-slate-400 italic">
                  No articles found matching the current filters.
                </td>
              </tr>
            ) : (
              articles.map(article => (
                <tr 
                  key={article.id} 
                  className={`article-table-row border-b border-slate-100 transition-colors ${article.selected ? 'selected-row' : ''}`}
                >
                  <td className="px-4 py-3 text-center">
                    <input 
                      type="checkbox" 
                      className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 w-5 h-5 cursor-pointer"
                      checked={article.selected}
                      onChange={() => onToggleSelect(article.id)}
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <input 
                      type="checkbox" 
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-5 h-5 cursor-pointer"
                      checked={article.downloaded}
                      onChange={() => onToggleDownloaded(article.id)}
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900 truncate max-w-[150px]">
                    {article.fullAuthor}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-serif text-sm leading-tight text-slate-800 line-clamp-2" title={article.article_title}>
                      {article.article_title}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <select 
                      value={article.topic}
                      onChange={(e) => onUpdateTopic(article.id, e.target.value)}
                      className={`text-[11px] font-bold uppercase py-1 px-2 rounded border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-slate-900 focus:outline-none cursor-pointer hover:bg-white transition-colors ${
                        article.topic === 'Analyzing...' ? 'text-slate-400 animate-pulse' : 'text-slate-700'
                      }`}
                    >
                      {article.topic === 'Analyzing...' && <option value="Analyzing...">Analyzing...</option>}
                      {SURGICAL_TOPICS.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                      {!SURGICAL_TOPICS.includes(article.topic) && article.topic !== 'Analyzing...' && (
                        <option value={article.topic}>{article.topic}</option>
                      )}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-block bg-slate-100 text-slate-700 text-[10px] px-2 py-1 rounded font-bold uppercase whitespace-nowrap">
                      {article.rubric || 'Uncategorized'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] font-semibold flex items-center ${
                      article.production_state?.toLowerCase().includes('done') ? 'text-emerald-600' : 'text-amber-600'
                    }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current mr-2"></span>
                      {article.production_state || 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <a 
                      href={`https://doi.org/${article.doi}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline text-[11px] flex items-center group"
                    >
                      <span>DOI Link</span>
                      <i className="fas fa-external-link-alt ml-1 text-[9px] opacity-50 group-hover:opacity-100"></i>
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 text-[11px] text-slate-500 flex justify-between">
        <span>Showing {articles.length} articles</span>
        <span className="italic font-serif">Selected items are highlighted for clarity</span>
      </div>
    </div>
  );
};

export default ArticleTable;
