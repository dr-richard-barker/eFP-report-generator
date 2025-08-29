
import React from 'react';
import type { GeneResult } from '../types';

interface GeneResultCardProps {
  result: GeneResult;
}

export const GeneResultCard: React.FC<GeneResultCardProps> = ({ result }) => {
  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden gene-card break-inside-avoid">
      <div className="bg-slate-50 px-6 py-4">
        <h4 className="text-lg font-bold text-sky-800">{result.id}</h4>
      </div>
      <div className="p-6 space-y-6">
        {result.visuals.map((visual) => (
          <div key={visual.viewerType}>
            <h5 className="font-semibold text-slate-600 mb-2">{visual.viewerType}</h5>
            <div className="bg-slate-100 rounded-md p-1 border border-slate-200">
                <img 
                    src={visual.imageUrl} 
                    alt={`Visualization for ${result.id} - ${visual.viewerType}`}
                    className="w-full h-auto rounded object-cover"
                />
            </div>
            <p className="text-sm text-slate-500 mt-3 italic">{visual.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
