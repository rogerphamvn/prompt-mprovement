import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

export const Header: React.FC = () => {
  return (
    <header className="text-center w-full">
      <div className="flex items-center justify-center gap-4">
        <SparklesIcon className="w-10 h-10 text-brand-primary" />
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-secondary to-brand-primary">
          Trợ Lý Tối Ưu Prompt
        </h1>
      </div>
      <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
        Chọn các kỹ thuật hoặc để AI đề xuất, sau đó tối ưu hóa prompt của bạn để đạt hiệu quả cao nhất.
      </p>
    </header>
  );
};
