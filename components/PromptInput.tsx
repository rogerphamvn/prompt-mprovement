import React from 'react';
import { DetailLevel } from '../App';
import { TemplateIcon } from './icons/TemplateIcon';

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  detailLevel: DetailLevel;
  setDetailLevel: (level: DetailLevel) => void;
  selectedTechniques: string[];
  setSelectedTechniques: (techniques: string[]) => void;
  selectedFramework: string | null;
  setSelectedFramework: (framework: string | null) => void;
  onRecommend: () => void;
  onOptimize: () => void;
  isRecommending: boolean;
  isLoading: boolean;
}

const availableTechniques = [
  'Chain of Thought (CoT)', 'Tree of Thought (ToT)', 'Meta Prompt',
  'Few-Shot Learning', 'Self Consistency', 'Progressive Prompting',
  'Role Playing', 'Analogical Reasoning', 'Critique & Revise', 'Socratic Method'
];

const availableFrameworks = [
  'CARE Framework (Context, Action, Result, Example)',
  '4R Basic Framework (Role, Request, Result, Reference)',
  '4R Advance Framework (Reframe, Reason, Refine, Reflect)'
];

const promptTemplates = [
    { name: "Persona", content: "Hãy đóng vai một [Chuyên gia/Nhân vật] và [Thực hiện nhiệm vụ] về [Chủ đề]." },
    { name: "So sánh", content: "So sánh và đối chiếu [Đối tượng A] và [Đối tượng B] dựa trên các tiêu chí: [Tiêu chí 1], [Tiêu chí 2], và [Tiêu chí 3]." },
    { name: "Hướng dẫn", content: "Tạo một hướng dẫn từng bước để [Thực hiện một công việc phức tạp]." },
];

const PromptTemplates: React.FC<{ onSelect: (content: string) => void, disabled: boolean }> = ({ onSelect, disabled }) => (
    <div className="mb-4">
        <h4 className="flex items-center gap-2 text-xs font-semibold text-gray-400 mb-2">
            <TemplateIcon className="w-4 h-4" />
            <span>Mẫu Bắt Đầu Nhanh</span>
        </h4>
        <div className="flex flex-wrap gap-2">
            {promptTemplates.map(template => (
                <button
                    key={template.name}
                    onClick={() => onSelect(template.content)}
                    disabled={disabled}
                    className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded-md transition-colors duration-200 disabled:opacity-50"
                >
                    {template.name}
                </button>
            ))}
        </div>
    </div>
);

const DetailSelector: React.FC<{ selected: DetailLevel, onSelect: (level: DetailLevel) => void, disabled: boolean }> = ({ selected, onSelect, disabled }) => {
  const options: { id: DetailLevel, label: string }[] = [
    { id: 'short', label: 'Ngắn - Trọng tâm' },
    { id: 'medium', label: 'Trung bình - Cân bằng' },
    { id: 'long', label: 'Dài - Chi tiết' },
  ];

  return (
    <div className="flex items-center bg-gray-900/50 rounded-lg p-1 border border-gray-700">
      {options.map(opt => (
        <button
          key={opt.id}
          onClick={() => onSelect(opt.id)}
          disabled={disabled}
          className={`w-full text-center px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 focus:outline-none disabled:cursor-not-allowed
            ${selected === opt.id 
              ? 'bg-brand-primary text-white shadow' 
              : 'text-gray-400 hover:bg-gray-700/50'
            }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
};

export const PromptInput: React.FC<PromptInputProps> = (props) => {
    const {
        prompt, setPrompt, detailLevel, setDetailLevel,
        selectedTechniques, setSelectedTechniques, selectedFramework, setSelectedFramework,
        onRecommend, onOptimize, isRecommending, isLoading
    } = props;
    const isDisabled = isRecommending || isLoading;

  const toggleTechnique = (tech: string) => {
    const newSelection = selectedTechniques.includes(tech)
      ? selectedTechniques.filter(t => t !== tech)
      : [...selectedTechniques, tech];
    setSelectedTechniques(newSelection);
  };

  const toggleFramework = (framework: string) => {
    setSelectedFramework(selectedFramework === framework ? null : framework);
  };

  const renderButtons = (items: string[], selectedItems: string[] | string | null, toggleFn: (item: string) => void) => {
    return items.map(item => {
        const isSelected = Array.isArray(selectedItems) ? selectedItems.includes(item) : selectedItems === item;
        return (
            <button
                key={item}
                onClick={() => toggleFn(item)}
                disabled={isDisabled}
                className={`px-3 py-1.5 text-sm border rounded-full transition-all duration-200 focus:outline-none disabled:opacity-50
                    ${isSelected 
                        ? 'bg-brand-secondary/80 border-brand-light text-white font-semibold'
                        : 'bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-600/50 hover:border-gray-500'
                    }`}
            >
                {item}
            </button>
        );
    });
  };

  return (
    <div className="w-full bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6 space-y-6">
      <div>
        <label htmlFor="prompt-input" className="block text-lg font-semibold mb-3 text-gray-300">
          Nhập Prompt Cần Tối Ưu
        </label>
        <div className="relative">
            <textarea
                id="prompt-input"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ví dụ: Viết 1 bài post về AI"
                className="w-full h-48 p-4 bg-gray-900 border border-gray-600 rounded-md resize-y focus:ring-2 focus:ring-brand-primary focus:outline-none transition duration-200 text-gray-200 placeholder-gray-500"
                disabled={isDisabled}
            />
            <div className="absolute top-2 right-2">
                 <PromptTemplates onSelect={setPrompt} disabled={isDisabled} />
            </div>
        </div>
      </div>

      <div>
        <label className="block text-base font-semibold mb-2 text-gray-300">Mức độ chi tiết của Prompt đầu ra</label>
        <DetailSelector selected={detailLevel} onSelect={setDetailLevel} disabled={isDisabled} />
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-gray-300">Chọn Kỹ Thuật (Techniques)</h3>
            <button
              onClick={onRecommend}
              disabled={isDisabled}
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-500 disabled:bg-gray-600 flex items-center gap-2 transition-colors"
            >
              {isRecommending 
                ? <><svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg> Đang đề xuất...</> 
                : 'AI Đề xuất'}
            </button>
        </div>
        <div className="flex flex-wrap gap-2">{renderButtons(availableTechniques, selectedTechniques, toggleTechnique)}</div>
      </div>

      <div>
        <h3 className="text-base font-semibold mb-3 text-gray-300">Chọn Framework (chỉ chọn 1)</h3>
        <div className="flex flex-wrap gap-2">{renderButtons(availableFrameworks, selectedFramework, toggleFramework)}</div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={onOptimize}
          disabled={isDisabled || !prompt.trim()}
          className="px-8 py-3 bg-brand-primary text-white font-bold rounded-lg hover:bg-brand-light disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:scale-100 flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang tối ưu...
            </>
          ) : (
            'Tối ưu hóa Prompt'
          )}
        </button>
      </div>
    </div>
  );
};
