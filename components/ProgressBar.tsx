
import React from 'react';

interface ProgressBarProps {
  value: number;
  message: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, message }) => {
  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between mb-1">
        <span className="text-base font-medium text-sky-700">{message}</span>
        <span className="text-sm font-medium text-sky-700">{Math.round(value)}%</span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2.5">
        <div 
          className="bg-sky-600 h-2.5 rounded-full transition-all duration-300 ease-out" 
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );
};
