import React, { useState } from 'react';
import { Header } from './components/Header';
import { PromptInput } from './components/PromptInput';
import { OptimizationReportDisplay } from './components/OptimizationReportDisplay';
import { Loader } from './components/Loader';
import { VersionHistory } from './components/VersionHistory';
import { recommendTechniques, optimizePrompt } from './services/geminiService';
import { OptimizationReport, CustomizationOptions } from './types';

export type DetailLevel = 'short' | 'medium' | 'long';

const themes: Record<string, CustomizationOptions> = {
  default: {
    name: 'Mặc định',
    themeColor: '#89CFF3', // brand-secondary
    backgroundColor: 'rgba(55, 65, 81, 0.5)', // bg-gray-700/50
    textColor: '#d1d5db', // text-gray-300
    codeBackgroundColor: 'rgba(17, 24, 39, 0.7)', // bg-gray-900/70
    fontFamily: 'sans-serif',
  },
  oceanic: {
    name: 'Đại dương',
    themeColor: '#2dd4bf', // teal-400
    backgroundColor: 'rgba(15, 23, 42, 0.5)', // bg-slate-900/50
    textColor: '#94a3b8', // slate-400
    codeBackgroundColor: 'rgba(2, 6, 23, 0.7)', // bg-slate-950/70
    fontFamily: 'sans-serif',
  },
  highContrast: {
    name: 'Tương phản cao',
    themeColor: '#fde047', // yellow-300
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // bg-black/70
    textColor: '#e5e7eb', // gray-200
    codeBackgroundColor: 'rgba(10, 10, 10, 1)', // near-black
    fontFamily: 'monospace',
  }
};


const ThemeSelector: React.FC<{ selectedTheme: string; onThemeChange: (themeKey: string) => void; }> = ({ selectedTheme, onThemeChange }) => {
  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col items-center gap-2 mb-6 animate-fade-in">
        <h2 className="text-sm font-semibold text-gray-500">Giao diện báo cáo</h2>
        <div className="flex items-center bg-gray-800 rounded-lg p-1 border border-gray-700">
        {Object.entries(themes).map(([key, theme]) => (
            <button
            key={key}
            onClick={() => onThemeChange(key)}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors duration-200 focus:outline-none
                ${selectedTheme === key
                ? 'bg-brand-primary text-white shadow'
                : 'text-gray-400 hover:bg-gray-700/50'
                }`}
            >
            {theme.name}
            </button>
        ))}
        </div>
    </div>
  );
};


const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [detailLevel, setDetailLevel] = useState<DetailLevel>('medium');
  const [selectedTechniques, setSelectedTechniques] = useState<string[]>([]);
  const [selectedFramework, setSelectedFramework] = useState<string | null>(null);
  const [theme, setTheme] = useState<string>('default');
  
  const [optimizationHistory, setOptimizationHistory] = useState<OptimizationReport[]>([]);
  const [currentReportIndex, setCurrentReportIndex] = useState<number | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRecommending, setIsRecommending] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleRecommend = async () => {
    if (!prompt.trim()) {
      setError('Vui lòng nhập prompt để AI có thể đưa ra đề xuất.');
      return;
    }
    setIsRecommending(true);
    setError('');

    try {
      const result = await recommendTechniques(prompt);
      setSelectedTechniques(result.techniques || []);
      setSelectedFramework(result.framework || null);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi khi nhận đề xuất từ AI.');
    } finally {
      setIsRecommending(false);
    }
  };

  const handleOptimize = async () => {
    if (!prompt.trim()) {
      setError('Vui lòng nhập prompt để tiến hành tối ưu.');
      return;
    }
    setIsLoading(true);
    setError('');
    setCurrentReportIndex(null);

    try {
      const result = await optimizePrompt(prompt, selectedTechniques, selectedFramework, detailLevel);
      if (result && result.optimizedPrompt) {
        const newReport: OptimizationReport = {
            ...result,
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
        }
        setOptimizationHistory(prev => [...prev, newReport]);
        setCurrentReportIndex(optimizationHistory.length);
      } else {
        throw new Error('Cấu trúc phản hồi từ API không hợp lệ.');
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định. Vui lòng kiểm tra console và đảm bảo API key của bạn đã được thiết lập.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectVersion = (index: number) => {
    setCurrentReportIndex(index);
  };

  const handleReusePrompt = (promptText: string) => {
    setPrompt(promptText);
    setCurrentReportIndex(null); // Hide report display to start a new iteration
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const currentReport = currentReportIndex !== null ? optimizationHistory[currentReportIndex] : null;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center p-4 sm:p-6 md:p-8">
      <Header />
      <main className="w-full max-w-6xl mx-auto flex flex-col gap-8 mt-8">
        <PromptInput
          prompt={prompt}
          setPrompt={setPrompt}
          detailLevel={detailLevel}
          setDetailLevel={setDetailLevel}
          selectedTechniques={selectedTechniques}
          setSelectedTechniques={setSelectedTechniques}
          selectedFramework={selectedFramework}
          setSelectedFramework={setSelectedFramework}
          onRecommend={handleRecommend}
          onOptimize={handleOptimize}
          isRecommending={isRecommending}
          isLoading={isLoading}
        />
        
        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg text-center animate-fade-in">
            <p><strong>Lỗi:</strong> {error}</p>
          </div>
        )}
        
        {optimizationHistory.length > 0 && !isLoading && (
            <VersionHistory
                history={optimizationHistory}
                currentIndex={currentReportIndex}
                onSelect={handleSelectVersion}
                onReuse={handleReusePrompt}
            />
        )}

        {isLoading && <Loader message="AI đang phân tích và tối ưu prompt của bạn..." />}
        
        {currentReport && !isLoading && (
          <>
            <ThemeSelector selectedTheme={theme} onThemeChange={setTheme} />
            <OptimizationReportDisplay report={currentReport} customization={themes[theme]} />
          </>
        )}
      </main>
    </div>
  );
};

export default App;
