import React, { useState } from 'react';
import { OptimizationReport, CustomizationOptions } from '../types';
import { ClipboardIcon } from './icons/ClipboardIcon';

interface OptimizationReportDisplayProps {
  report: OptimizationReport;
  customization: CustomizationOptions;
}

const ReportSection: React.FC<{ title: string; children: React.ReactNode, customization: CustomizationOptions }> = ({ title, children, customization }) => (
  <div className="border-t border-gray-700/50 pt-4" style={{ borderColor: 'rgba(55, 65, 81, 0.5)' }}>
    <h3 className="text-xl font-bold mb-3" style={{ color: customization.themeColor }}>{title}</h3>
    <div className="space-y-2" style={{ color: customization.textColor }}>{children}</div>
  </div>
);

export const OptimizationReportDisplay: React.FC<OptimizationReportDisplayProps> = ({ report, customization }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(report.optimizedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!report) return null;

  return (
    <div 
        className="border border-gray-700/50 rounded-xl shadow-lg p-6 backdrop-blur-sm animate-fade-in space-y-6" 
        style={{ 
            backgroundColor: customization.backgroundColor,
            fontFamily: customization.fontFamily,
            borderColor: 'rgba(55, 65, 81, 0.5)' 
        }}
    >
      
      <ReportSection title="📊 PHÂN TÍCH PROMPT GỐC" customization={customization}>
        <p><strong>Mục đích:</strong> {report.analysis.purpose}</p>
        <p><strong>Điểm mạnh:</strong> {report.analysis.strengths}</p>
        <p><strong>Điểm yếu:</strong> {report.analysis.weaknesses}</p>
      </ReportSection>

      <ReportSection title="🔧 KỸ THUẬT ĐÃ ÁP DỤNG" customization={customization}>
        <ul className="list-disc list-inside space-y-2">
          {report.appliedTechniques.map((tech, index) => (
            <li key={index}>
              <strong>{tech.name}:</strong> {tech.reason}
            </li>
          ))}
        </ul>
      </ReportSection>

      <div className="border-t border-gray-700/50 pt-4" style={{ borderColor: 'rgba(55, 65, 81, 0.5)' }}>
        <div className="flex justify-between items-center mb-3">
            <h3 className="text-xl font-bold" style={{ color: customization.themeColor }}>✨ PROMPT ĐÃ TỐI ƯU</h3>
            <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 rounded-md transition-colors duration-200"
            >
            <ClipboardIcon className="w-4 h-4" />
            {copied ? 'Đã sao chép!' : 'Sao chép'}
            </button>
        </div>
        <pre 
            className="p-4 rounded-lg overflow-x-auto whitespace-pre-wrap text-sm leading-relaxed"
            style={{ 
                backgroundColor: customization.codeBackgroundColor,
                color: customization.textColor,
                fontFamily: customization.fontFamily === 'monospace' ? 'monospace' : 'inherit'
            }}
        >
            <code>{report.optimizedPrompt}</code>
        </pre>
      </div>

      <ReportSection title="📈 CẢI THIỆN ĐÃ THỰC HIỆN" customization={customization}>
        <p>{report.improvementsSummary}</p>
      </ReportSection>

    </div>
  );
};
