import React from 'react';

interface Props {
  insights: string[];
}

const ProfLynxInsight = ({ insights }: Props) => (
  <div className="bg-white rounded shadow p-4 mt-4">
    <h2 className="text-lg font-semibold mb-2">ProfLynx Insights</h2>
    <ul className="list-disc pl-5 text-sm text-gray-700">
      {insights.length === 0 ? (
        <li>No insights available.</li>
      ) : (
        insights.map((insight, idx) => <li key={idx}>{insight}</li>)
      )}
    </ul>
  </div>
);

export default ProfLynxInsight;
