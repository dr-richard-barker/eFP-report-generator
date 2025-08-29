
import React, { forwardRef } from 'react';
import type { AnalysisResult } from '../types';
import { GoEnrichmentTable } from './GoEnrichmentTable';
import { GeneResultCard } from './GeneResultCard';
import { DownloadIcon } from './icons/DownloadIcon';

interface ReportViewProps {
  results: AnalysisResult;
  onDownloadPdf: () => void;
}

export const ReportView = forwardRef<HTMLDivElement, ReportViewProps>(({ results, onDownloadPdf }, ref) => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-800">Analysis Report</h2>
        <button
          onClick={onDownloadPdf}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        >
          <DownloadIcon className="h-5 w-5 mr-2" />
          Download PDF
        </button>
      </div>

      <div ref={ref} className="bg-white p-8 rounded-lg shadow-lg report-container">
        <div className="space-y-12">
          <section>
            <h3 className="text-2xl font-semibold text-slate-700 border-b-2 border-slate-200 pb-2 mb-4">
              Gene Ontology Enrichment Summary
            </h3>
            <GoEnrichmentTable data={results.goEnrichment} />
          </section>

          <section>
            <h3 className="text-2xl font-semibold text-slate-700 border-b-2 border-slate-200 pb-2 mb-4">
              Individual Gene Analysis
            </h3>
            <div className="space-y-8">
              {results.geneResults.map(geneResult => (
                <GeneResultCard key={geneResult.id} result={geneResult} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
});
