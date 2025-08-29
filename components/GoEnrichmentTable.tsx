
import React from 'react';
import type { GoTerm } from '../types';

interface GoEnrichmentTableProps {
  data: GoTerm[];
}

export const GoEnrichmentTable: React.FC<GoEnrichmentTableProps> = ({ data }) => {
  if (data.length === 0) {
    return <p className="text-slate-500">No significant GO enrichment terms found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              GO Term
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Description
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              P-Value
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Study Count
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {data.map((term) => (
            <tr key={term.go_id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{term.go_id}</td>
              <td className="px-6 py-4 whitespace-normal text-sm text-slate-500">{term.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{term.p_value.toExponential(2)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{term.study_count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
