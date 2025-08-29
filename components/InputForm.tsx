
import React, { useState, useCallback } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import type { AnalysisOptions, ViewerType } from '../types';
import { AVAILABLE_VIEWERS, SAMPLE_GENE_LIST } from '../constants';
import { UploadIcon } from './icons/UploadIcon';
import { DnaIcon } from './icons/DnaIcon';
import { CheckIcon } from './icons/CheckIcon';


interface InputFormProps {
  onSubmit: (options: AnalysisOptions) => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [geneList, setGeneList] = useState('');
  const [selectedViewers, setSelectedViewers] = useState<ViewerType[]>(AVAILABLE_VIEWERS);

  const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setGeneList(event.target?.result as string);
      };
      reader.readAsText(file);
    }
  }, []);

  const handleViewerChange = useCallback((viewer: ViewerType) => {
    setSelectedViewers(prev => 
      prev.includes(viewer) 
        ? prev.filter(v => v !== viewer) 
        : [...prev, viewer]
    );
  }, []);

  const handleSubmit = useCallback((e: FormEvent) => {
    e.preventDefault();
    onSubmit({ geneList, viewers: selectedViewers });
  }, [onSubmit, geneList, selectedViewers]);
  
  const handleLoadSample = useCallback(() => {
    setGeneList(SAMPLE_GENE_LIST);
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="gene-list" className="block text-sm font-medium text-slate-700">
              Gene/Protein Identifiers
            </label>
            <button
              type="button"
              onClick={handleLoadSample}
              className="text-sm font-medium text-sky-600 hover:text-sky-800 transition-colors"
              aria-label="Load sample gene list"
            >
              Load Sample
            </button>
          </div>
          <textarea
            id="gene-list"
            rows={8}
            className="w-full p-3 border border-slate-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 transition"
            placeholder="Paste your list here, e.g.,&#10;AT1G01010&#10;AT1G01020&#10;AT1G01030"
            value={geneList}
            onChange={(e) => setGeneList(e.target.value)}
          />
          <label htmlFor="file-upload" className="mt-2 text-sm text-slate-600 flex items-center justify-center w-full px-4 py-2 border-2 border-dashed border-slate-300 rounded-md cursor-pointer hover:bg-slate-50 transition">
            <UploadIcon className="h-5 w-5 mr-2 text-slate-400"/>
            <span>or Upload a .txt file</span>
            <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".txt" onChange={handleFileChange} />
          </label>
        </div>

        <div>
          <h3 className="text-sm font-medium text-slate-700 mb-2">
            ePlant Visualizations
          </h3>
          <div className="space-y-2">
            {AVAILABLE_VIEWERS.map(viewer => (
              <label key={viewer} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="hidden peer"
                  checked={selectedViewers.includes(viewer)}
                  onChange={() => handleViewerChange(viewer)}
                />
                 <div className="w-5 h-5 border-2 border-slate-300 rounded peer-checked:bg-sky-600 peer-checked:border-sky-600 flex items-center justify-center transition-all duration-200">
                    <CheckIcon className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100" />
                 </div>
                <span className="text-slate-700">{viewer}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !geneList.trim()}
          className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </>
          ) : (
             <>
              <DnaIcon className="h-5 w-5 mr-2"/>
              Generate Report
             </>
          )}
        </button>
      </form>
    </div>
  );
};
