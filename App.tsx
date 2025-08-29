
import React, { useState, useCallback, useRef } from 'react';
import { InputForm } from './components/InputForm';
import { ReportView } from './components/ReportView';
import { ProgressBar } from './components/ProgressBar';
import { LogoIcon } from './components/icons/LogoIcon';
import type { AnalysisOptions, AnalysisResult, GoTerm } from './types';
import { AnalysisState } from './types';
import { generateGoEnrichment, generateGeneVisuals } from './services/geminiService';
import { generatePdf } from './services/pdfService';

const App: React.FC = () => {
  const [analysisState, setAnalysisState] = useState<AnalysisState>(AnalysisState.Idle);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [progress, setProgress] = useState({ value: 0, message: '' });
  const [error, setError] = useState<string | null>(null);
  
  const reportRef = useRef<HTMLDivElement>(null);

  const handleGenerateReport = useCallback(async (options: AnalysisOptions) => {
    setAnalysisState(AnalysisState.Loading);
    setResults(null);
    setError(null);
    setProgress({ value: 0, message: 'Starting analysis...' });

    try {
      const genes = options.geneList.split(/[,\s\n]+/).filter(g => g.trim() !== '');
      if (genes.length === 0) {
        throw new Error("Gene list is empty. Please provide at least one gene identifier.");
      }

      setProgress({ value: 5, message: 'Generating GO Enrichment summary...' });
      const goTerms: GoTerm[] = await generateGoEnrichment(genes.join(', '));
      
      const geneResults = [];
      const totalSteps = genes.length + 2; // 1 for GO, 1 for final PDF, plus each gene
      let currentStep = 2;

      for (const gene of genes) {
        setProgress({ 
            value: (currentStep / totalSteps) * 100, 
            message: `Analyzing ${gene}...` 
        });
        const visuals = await generateGeneVisuals(gene, options.viewers);
        geneResults.push({ id: gene, visuals });
        currentStep++;
      }
      
      setResults({ goEnrichment: goTerms, geneResults });
      setAnalysisState(AnalysisState.Success);
      setProgress({ value: 100, message: 'Analysis complete!' });

    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(errorMessage);
      setAnalysisState(AnalysisState.Error);
    }
  }, []);

  const handleDownloadPdf = useCallback(async () => {
    if (!reportRef.current) return;
    setAnalysisState(AnalysisState.Loading);
    setProgress({ value: 0, message: 'Generating PDF...' });
    try {
      await generatePdf(reportRef.current, 'gene-analysis-report');
      setProgress({ value: 100, message: 'PDF generated!' });
    } catch (e) {
      console.error('PDF Generation Error:', e);
      setError('Failed to generate PDF.');
    } finally {
       setAnalysisState(AnalysisState.Success); // revert back to success state
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LogoIcon className="h-10 w-10 text-sky-600" />
            <h1 className="text-2xl font-bold text-slate-800">
              Gene Analysis eFP Report Generator
            </h1>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <InputForm 
              onSubmit={handleGenerateReport} 
              isLoading={analysisState === AnalysisState.Loading}
            />
          </div>
          <div className="lg:col-span-2">
            {analysisState === AnalysisState.Loading && <ProgressBar value={progress.value} message={progress.message} />}
            
            {analysisState === AnalysisState.Error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
                <p className="font-bold">Error</p>
                <p>{error}</p>
              </div>
            )}

            {analysisState === AnalysisState.Idle && (
              <div className="flex flex-col items-center justify-center bg-white p-8 rounded-lg shadow-md h-full">
                  <LogoIcon className="h-24 w-24 text-slate-300 mb-4" />
                  <h2 className="text-xl font-semibold text-slate-600">Your Report Awaits</h2>
                  <p className="text-slate-500 mt-2 text-center">
                    Enter a list of genes and select your desired visualizations to generate a comprehensive report.
                  </p>
              </div>
            )}
            
            {analysisState === AnalysisState.Success && results && (
              <ReportView 
                ref={reportRef} 
                results={results} 
                onDownloadPdf={handleDownloadPdf}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
