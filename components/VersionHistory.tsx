import React from 'react';
import { OptimizationReport } from '../types';
import { HistoryIcon } from './icons/HistoryIcon';

interface VersionHistoryProps {
  history: OptimizationReport[];
  currentIndex: number | null;
  onSelect: (index: number) => void;
  onReuse: (promptText: string) => void;
}

export const VersionHistory: React.FC<VersionHistoryProps> = ({ history, currentIndex, onSelect, onReuse }) => {
  if (history.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-gray-800/50 border border-gray-700 rounded-xl shadow-lg p-6 space-y-4 animate-fade-in">
      <h2 className="flex items-center gap-3 text-lg font-semibold text-gray-300">
        <HistoryIcon className="w-6 h-6 text-brand-secondary" />
        Lịch sử Tối ưu hóa
      </h2>
      <div className="max-h-48 overflow-y-auto pr-2">
        <ul className="space-y-2">
          {history.map((report, index) => (
            <li
              key={report.id}
              className={`p-3 rounded-lg transition-colors duration-200 cursor-pointer flex justify-between items-center
                ${currentIndex === index
                  ? 'bg-brand-primary/20 border border-brand-secondary'
                  : 'bg-gray-700/50 hover:bg-gray-700'
                }`}
              onClick={() => onSelect(index)}
            >
              <div>
                <p className="font-semibold text-sm text-gray-200">
                  Phiên bản {index + 1}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(report.timestamp).toLocaleString('vi-VN')}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onReuse(report.optimizedPrompt);
                }}
                className="px-3 py-1 text-xs bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-md transition-colors"
              >
                Tái sử dụng
              </button>
            </li>
          )).reverse()}
        </ul>
      </div>
    </div>
  );
};
