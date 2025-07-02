'use client';

import { Card } from '@edulynx/ui-primitives';
import { useState } from 'react';

interface Resource {
  id: number;
  title: string;
  description: string;
  type: string;
  course: string;
  size?: string;
  downloadUrl?: string;
  viewUrl?: string;
  dateAdded: string;
}

export default function ResourcesPage() {
  const [activeFilter, setActiveFilter] = useState('all');

  // Mock resources
  const resources: Resource[] = [
    {
      id: 1,
      title: 'Mathematics Textbook Chapter 5',
      description: 'Complete PDF of Chapter 5 covering quadratic equations',
      type: 'pdf',
      course: 'Mathematics - Grade 10',
      size: '4.2 MB',
      downloadUrl: '#',
      viewUrl: '#',
      dateAdded: 'June 10, 2025',
    },
    {
      id: 2,
      title: 'Chemical Reactions Video Tutorial',
      description: 'Video explaining the basics of chemical reactions',
      type: 'video',
      course: 'Physical Science',
      size: '156 MB',
      downloadUrl: '#',
      viewUrl: '#',
      dateAdded: 'June 15, 2025',
    },
    {
      id: 3,
      title: 'Essay Writing Guide',
      description: 'Step-by-step guide for writing analytical essays',
      type: 'doc',
      course: 'English Literature',
      size: '1.8 MB',
      downloadUrl: '#',
      viewUrl: '#',
      dateAdded: 'May 28, 2025',
    },
    {
      id: 4,
      title: 'South African History Timeline',
      description: 'Interactive timeline of key historical events',
      type: 'link',
      course: 'History',
      viewUrl: '#',
      dateAdded: 'June 5, 2025',
    },
    {
      id: 5,
      title: 'Programming Practice Problems',
      description: 'Set of problems for practicing basic programming concepts',
      type: 'pdf',
      course: 'Computer Science',
      size: '2.4 MB',
      downloadUrl: '#',
      viewUrl: '#',
      dateAdded: 'June 20, 2025',
    },
    {
      id: 6,
      title: 'Algebra Practice Worksheet',
      description: 'Additional practice problems for algebraic expressions',
      type: 'doc',
      course: 'Mathematics - Grade 10',
      size: '1.2 MB',
      downloadUrl: '#',
      viewUrl: '#',
      dateAdded: 'June 22, 2025',
    },
  ];

  const filteredResources =
    activeFilter === 'all'
      ? resources
      : resources.filter(resource => resource.course.toLowerCase().includes(activeFilter));

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Learning Resources</h1>
        <div className="flex items-center space-x-3">
          <select
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={activeFilter}
            onChange={e => setActiveFilter(e.target.value)}
          >
            <option value="all">All Subjects</option>
            <option value="mathematics">Mathematics</option>
            <option value="science">Physical Science</option>
            <option value="english">English Literature</option>
            <option value="history">History</option>
            <option value="computer">Computer Science</option>
          </select>
          <div className="relative">
            <input
              type="text"
              placeholder="Search resources..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400 absolute left-3 top-2.5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Resource types filter */}
      <div className="flex overflow-x-auto space-x-4 pb-2">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium">
          All Resources
        </button>
        <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-full text-sm hover:bg-gray-50">
          PDFs
        </button>
        <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-full text-sm hover:bg-gray-50">
          Videos
        </button>
        <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-full text-sm hover:bg-gray-50">
          Documents
        </button>
        <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-full text-sm hover:bg-gray-50">
          Links
        </button>
        <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-full text-sm hover:bg-gray-50">
          Recently Added
        </button>
      </div>

      {/* Resources grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map(resource => (
          <Card
            key={resource.id}
            className="p-6 border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start">
              {/* Icon based on type */}
              <div
                className={`
                w-12 h-12 rounded-lg flex items-center justify-center 
                ${resource.type === 'pdf' ? 'bg-red-100 text-red-600' : ''}
                ${resource.type === 'video' ? 'bg-purple-100 text-purple-600' : ''}
                ${resource.type === 'doc' ? 'bg-blue-100 text-blue-600' : ''}
                ${resource.type === 'link' ? 'bg-green-100 text-green-600' : ''}
              `}
              >
                {resource.type === 'pdf' && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                )}
                {resource.type === 'video' && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                )}
                {resource.type === 'doc' && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                )}
                {resource.type === 'link' && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                )}
              </div>

              <div className="ml-4 flex-1">
                <h3 className="text-lg font-semibold text-gray-800">{resource.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{resource.description}</p>

                <div className="mt-3 flex flex-wrap items-center text-sm text-gray-500 gap-y-1">
                  <span className="mr-3">{resource.course}</span>
                  {resource.size && (
                    <>
                      <span className="mx-1">•</span>
                      <span className="mr-3">{resource.size}</span>
                    </>
                  )}
                  <span className="mx-1">•</span>
                  <span>{resource.dateAdded}</span>
                </div>

                <div className="mt-4 flex space-x-2">
                  {resource.viewUrl && (
                    <a
                      href={resource.viewUrl}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded"
                    >
                      View
                    </a>
                  )}
                  {resource.downloadUrl && (
                    <a
                      href={resource.downloadUrl}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm rounded"
                    >
                      Download
                    </a>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No resources found for the selected filter.</p>
        </div>
      )}
    </div>
  );
}
