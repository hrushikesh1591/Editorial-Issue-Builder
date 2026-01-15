import React, { useState, useMemo } from 'react';
import { Article, Filters, SURGICAL_TOPICS } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ArticleTable from './components/ArticleTable';
import DownloadQueue from './components/DownloadQueue';
import FileUploader from './components/FileUploader';
import { processRawData, exportToExcel } from './utils/dataUtils';
import { categorizeArticles } from './utils/aiUtils';

const TabButton: React.FC<{ active: boolean; onClick: () => void; label: string; icon: string; badge?: number }> = ({ active, onClick, label, icon, badge }) => (
  <button 
    onClick={onClick}
    className={`px-5 py-2 rounded-md text-sm font-semibold transition-all flex items-center space-x-2 ${
      active ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
    }`}
  >
    <i className={`fas ${icon}`}></i>
    <span>{label}</span>
    {badge !== undefined && badge > 0 && (
      <span className="bg-slate-900 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full ml-1 animate-pulse">
        {badge}
      </span>
    )}
  </button>
);

const App: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isCategorizing, setIsCategorizing] = useState(false);
  const [activeTab, setActiveTab] = useState<'table' | 'dashboard' | 'queue'>('table');
  const [filters, setFilters] = useState<Filters>({
    rubrics: [],
    productionStates: [],
    topics: [],
    dateRange: ['', '']
  });

  const handleFileUpload = async (data: any[]) => {
    const processed = processRawData(data);
    setArticles(processed.map(a => ({ ...a, topic: 'Analyzing...' })));
    
    setIsCategorizing(true);
    try {
      const titles = processed.map(a => a.article_title);
      const topicMap = await categorizeArticles(titles);
      
      setArticles(current => current.map(art => ({
        ...art,
        topic: topicMap[art.article_title] || 'General Oral Surgery'
      })));
    } catch (err) {
      console.error("Categorization failed", err);
      setArticles(current => current.map(art => ({
        ...art,
        topic: art.topic === 'Analyzing...' ? 'General Oral Surgery' : art.topic
      })));
    } finally {
      setIsCategorizing(false);
    }
  };

  const updateArticleTopic = (id: string, newTopic: string) => {
    setArticles(prev => prev.map(a => a.id === id ? { ...a, topic: newTopic } : a));
  };

  const toggleArticleSelection = (id: string) => {
    setArticles(prev => prev.map(a => a.id === id ? { ...a, selected: !a.selected } : a));
  };

  const toggleArticleDownloaded = (id: string) => {
    setArticles(prev => prev.map(a => a.id === id ? { ...a, downloaded: !a.downloaded } : a));
  };

  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const rubricMatch = filters.rubrics.length === 0 || filters.rubrics.includes(article.rubric);
      const stateMatch = filters.productionStates.length === 0 || filters.productionStates.includes(article.production_state);
      const topicMatch = filters.topics.length === 0 || filters.topics.includes(article.topic);
      return rubricMatch && stateMatch && topicMatch;
    });
  }, [articles, filters]);

  const selectedArticles = useMemo(() => articles.filter(a => a.selected), [articles]);

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {articles.length > 0 && (
        <Sidebar 
          articles={articles} 
          filters={filters} 
          setFilters={setFilters} 
          onExport={() => exportToExcel(articles)}
        />
      )}

      <main className="flex-1 flex flex-col min-w-0">
        <Header />
        <div className="p-8 flex-1 max-w-[1600px] mx-auto w-full">
          {articles.length === 0 ? (
            <div className="h-[75vh] flex items-center justify-center">
              <FileUploader onDataLoaded={handleFileUpload} />
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <div className="flex space-x-1 bg-slate-200 p-1 rounded-lg">
                  <TabButton active={activeTab === 'table'} onClick={() => setActiveTab('table')} label="Table" icon="fa-table" />
                  <TabButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} label="Dashboard" icon="fa-chart-pie" />
                  <TabButton active={activeTab === 'queue'} onClick={() => setActiveTab('queue')} label="Queue" icon="fa-cloud-download-alt" badge={selectedArticles.length} />
                </div>
                {isCategorizing && (
                  <div className="text-xs font-bold text-slate-500 animate-pulse flex items-center">
                    <i className="fas fa-magic mr-2"></i> AI Sorting clinical domains...
                  </div>
                )}
              </div>

              {activeTab === 'table' && (
                <ArticleTable articles={filteredArticles} onToggleSelect={toggleArticleSelection} onToggleDownloaded={toggleArticleDownloaded} onUpdateTopic={updateArticleTopic} />
              )}
              {activeTab === 'dashboard' && <Dashboard articles={articles} />}
              {activeTab === 'queue' && <DownloadQueue selectedArticles={selectedArticles} onToggleDownloaded={toggleArticleDownloaded} />}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;