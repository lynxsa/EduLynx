import React, { useState } from 'react';

// Enhanced Tabbed Card Component with live data support
const TabbedCard = ({
  title,
  tabs,
  children,
  actions,
  className = '',
}: {
  title: string;
  tabs: string[];
  children: React.ReactNode[];
  actions?: React.ReactNode;
  className?: string;
}) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div
      title={title}
      className={`overflow-hidden ${className} p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700`}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        {actions && <div>{actions}</div>}
      </div>
      <div className="-mx-8 -mt-8">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50">
          {tabs.map((tab, index) => (
            <button
              key={tab}
              onClick={() => setActiveTab(index)}
              className={`px-6 py-4 text-sm font-semibold transition-all duration-200 ${
                activeTab === index
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-white dark:bg-gray-800'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-8">
          {children[activeTab] || (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No content available for this tab
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TabbedCard;
