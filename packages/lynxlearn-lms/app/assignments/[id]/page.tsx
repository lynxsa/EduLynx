'use client';

import { Card } from '@edulynx/ui-primitives';
import { Calendar, Upload } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Assignment, assignments } from '../data';

export default function AssignmentDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const assignment = assignments.find((a: Assignment) => a.id === id);
  const [file, setFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(!!assignment?.submittedFile);

  if (!assignment) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Assignment not found.</p>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    // TODO: integrate with API
    if (file) {
      alert(`Submitted ${file.name}`);
      setSubmitted(true);
      // Optionally redirect or refresh
      router.refresh();
    }
  };

  return (
    <main className="min-h-screen pt-20 bg-slate-50 dark:bg-slate-900 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            {assignment.title}
          </h1>
          <a href="/assignments" className="text-purple-600 hover:underline">
            ← Back
          </a>
        </div>

        <Card className="p-6 space-y-4">
          <p className="text-sm text-gray-700">Course: {assignment.course}</p>
          <p className="text-sm text-gray-700">Description: {assignment.description}</p>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-5 h-5 mr-1" />
            <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
          </div>
        </Card>

        <Card className="p-6">
          {submitted ? (
            <div className="space-y-4">
              <p className="text-gray-800">You have submitted this assignment.</p>
              {assignment.submittedFile && (
                <a
                  href={assignment.submittedFile}
                  target="_blank"
                  rel="noreferrer"
                  className="text-purple-600 hover:underline"
                >
                  View Submitted File
                </a>
              )}
              {assignment.grade && <p className="text-green-600">Grade: {assignment.grade}</p>}
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-800">Upload your work below:</p>
              <div>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-gray-300 file:text-sm file:font-medium file:bg-white file:text-gray-700 hover:file:bg-gray-100"
                />
              </div>
              <Button onClick={handleSubmit} disabled={!file} className="flex items-center">
                Submit <Upload className="w-5 h-5 ml-2" />
              </Button>
            </div>
          )}
        </Card>
      </div>
    </main>
  );
}
