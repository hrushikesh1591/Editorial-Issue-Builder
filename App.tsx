import React, { useState, useMemo } from 'react';
import { Article, Filters } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ArticleTable from './components/ArticleTable';
import DownloadQueue from './components/DownloadQueue';
import FileUploader from './components/FileUploader';
import { processRawData, exportToExcel, exportCategorizedSheet } from './utils/dataUtils';
import { categorizeArticles } from './utils/aiUtils';

const App: React.FC = () => {

  const [articles, setArticles] = useState<Article[]>([]);
  const [isCategorizing, setIsCategorizing] = useState(false);
  const [isCategorizationDone, setIsCategorizationDone] = useState(false);
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
    setIsCategorizationDone(false);

    try {
      const titles = processed.map(a => a.article_title);
      const topicMap = await categorizeArticles(titles);

      setArticles(current =>
        current.map(art => ({
          ...art,
          topic: topicMap[art.article_title] || 'General Oral Surgery'
        }))
      );

    } catch (err) {
      console.error("Categorization failed", err);

      setArticles(current =>
        current.map(art => ({
          ...art,
          topic: art.topic === 'Analyzing...' ? 'General Oral Surgery' : art.topic
        }))
      );

    } finally {
      setIsCategorizing(false);
      setIsCategorizationDone(true);
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

      let dateMatch = true;
      if (filters.dateRange[0] || filters.dateRange[1]) {
        if (!article.onlineFirstTimestamp) {
          dateMatch = false;
        } else {
          const articleDate = new Date(article.onlineFirstTimestamp);
          articleDate.setHours(0, 0, 0, 0);

          if (filters.dateRange[0]) {
            const startDate = new Date(filters.dateRange[0]);
            startDate.setHours(0, 0, 0, 0);
            if (articleDate < startDate) dateMatch = false;
          }

          if (filters.dateRange[1]) {
            const endDate = new Date(filters.dateRange[1]);
            endDate.setHours(23, 59, 59, 999);
            if (articleDate > endDate) dateMatch = false;
          }
        }
      }

      return rubricMatch && stateMatch && topicMatch && dateMatch;
    });
  }, [articles, filters]);

  const queueArticles = useMemo(() => articles.filter(a => a.selected || a.downloaded), [articles]);

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">

      {articles.length > 0 && (
        <Sidebar
          articles={articles}
          filters={filters}
          setFilters={setFilters}
          onExport={() => exportToExcel(articles)}
          onExportCategorized={() => exportCategorizedSheet(articles)}
          isCategorizationDone={isCategorizationDone}
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
                  <button onClick={() => setActiveTab('table')} className="px-5 py-2 rounded-md text-sm font-semibold bg-white shadow-sm">
                    <i className="fas fa-table mr-2"></i>Table
                  </button>
                </div>

                {isCategorizing && (
                  <div className="text-xs font-bold text-slate-500 animate-pulse flex items-center">
                    <i className="fas fa-magic mr-2"></i> AI Sorting clinical domains...
                  </div>
                )}

              </div>

              <ArticleTable
                articles={filteredArticles}
                onToggleSelect={toggleArticleSelection}
                onToggleDownloaded={toggleArticleDownloaded}
                onUpdateTopic={updateArticleTopic}
              />

            </>
          )}

        </div>
      </main>
    </div>
  );
};

export default App;
