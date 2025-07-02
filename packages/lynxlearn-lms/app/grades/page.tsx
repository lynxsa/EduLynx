'use client';

import { Card } from '@edulynx/ui-primitives';
import { useState } from 'react';

interface Grade {
  id: number;
  assignment: string;
  course: string;
  courseId: number;
  dueDate: string;
  submittedDate: string;
  grade: string;
  score: number;
  totalPoints: number;
  feedback?: string;
}

export default function GradesPage() {
  const [activeTab, setActiveTab] = useState('term2');

  // Mock grades data
  const grades: Record<string, Grade[]> = {
    term1: [
      {
        id: 1,
        assignment: 'Math Quiz 1',
        course: 'Mathematics - Grade 10',
        courseId: 1,
        dueDate: 'January 20, 2025',
        submittedDate: 'January 19, 2025',
        grade: 'A',
        score: 19,
        totalPoints: 20,
        feedback: 'Excellent work! You demonstrated a strong understanding of linear equations.',
      },
      {
        id: 2,
        assignment: 'English Essay: Literary Analysis',
        course: 'English Literature',
        courseId: 3,
        dueDate: 'January 25, 2025',
        submittedDate: 'January 24, 2025',
        grade: 'B+',
        score: 85,
        totalPoints: 100,
        feedback: 'Good analysis, but could use stronger evidence to support your claims.',
      },
      {
        id: 3,
        assignment: 'Science Lab: Physics',
        course: 'Physical Science',
        courseId: 2,
        dueDate: 'February 5, 2025',
        submittedDate: 'February 4, 2025',
        grade: 'A-',
        score: 45,
        totalPoints: 50,
        feedback:
          'Well-structured lab report with accurate calculations. Minor errors in conclusion.',
      },
      {
        id: 4,
        assignment: 'History Project: Pre-Colonial Africa',
        course: 'History',
        courseId: 4,
        dueDate: 'February 15, 2025',
        submittedDate: 'February 14, 2025',
        grade: 'A',
        score: 98,
        totalPoints: 100,
        feedback: 'Outstanding research and presentation. Your analysis shows deep understanding.',
      },
      {
        id: 5,
        assignment: 'Programming Assignment 1',
        course: 'Computer Science',
        courseId: 5,
        dueDate: 'February 20, 2025',
        submittedDate: 'February 18, 2025',
        grade: 'B',
        score: 42,
        totalPoints: 50,
        feedback: 'Your code works correctly but needs better documentation and efficiency.',
      },
      {
        id: 6,
        assignment: 'Math Midterm Exam',
        course: 'Mathematics - Grade 10',
        courseId: 1,
        dueDate: 'March 10, 2025',
        submittedDate: 'March 10, 2025',
        grade: 'B+',
        score: 85,
        totalPoints: 100,
        feedback: 'Good problem-solving skills. Work on time management for future exams.',
      },
    ],
    term2: [
      {
        id: 7,
        assignment: 'Math Assignment: Quadratic Equations',
        course: 'Mathematics - Grade 10',
        courseId: 1,
        dueDate: 'April 15, 2025',
        submittedDate: 'April 14, 2025',
        grade: 'A-',
        score: 23,
        totalPoints: 25,
        feedback: 'Very good work. Minor calculation error on problem 5.',
      },
      {
        id: 8,
        assignment: 'Science Quiz: Chemical Reactions',
        course: 'Physical Science',
        courseId: 2,
        dueDate: 'April 20, 2025',
        submittedDate: 'April 20, 2025',
        grade: 'B+',
        score: 17,
        totalPoints: 20,
        feedback: 'Good understanding of concepts. Review balanced equations.',
      },
      {
        id: 9,
        assignment: 'English: Poetry Analysis',
        course: 'English Literature',
        courseId: 3,
        dueDate: 'May 5, 2025',
        submittedDate: 'May 4, 2025',
        grade: 'A',
        score: 48,
        totalPoints: 50,
        feedback: 'Excellent analysis with strong evidence. Your writing is well-structured.',
      },
      {
        id: 10,
        assignment: 'History Essay: Apartheid Era',
        course: 'History',
        courseId: 4,
        dueDate: 'May 15, 2025',
        submittedDate: 'May 15, 2025',
        grade: 'A',
        score: 95,
        totalPoints: 100,
        feedback: 'Outstanding research and critical analysis. Well-sourced arguments.',
      },
      {
        id: 11,
        assignment: 'Programming Assignment 2',
        course: 'Computer Science',
        courseId: 5,
        dueDate: 'May 25, 2025',
        submittedDate: 'May 23, 2025',
        grade: 'A-',
        score: 47,
        totalPoints: 50,
        feedback: 'Very good solution with efficient code. Could use more comments.',
      },
      {
        id: 12,
        assignment: 'Math Quiz 2',
        course: 'Mathematics - Grade 10',
        courseId: 1,
        dueDate: 'June 10, 2025',
        submittedDate: 'June 10, 2025',
        grade: 'B+',
        score: 17,
        totalPoints: 20,
        feedback: 'Good work. Pay attention to the signs in your calculations.',
      },
    ],
  };

  const activeGrades = grades[activeTab] || [];

  // Calculate summary statistics for the selected term
  const courseGrades = activeGrades.reduce(
    (acc, grade) => {
      if (!acc[grade.course]) {
        acc[grade.course] = {
          totalScore: 0,
          totalPoints: 0,
          assignments: 0,
        };
      }

      acc[grade.course].totalScore += grade.score;
      acc[grade.course].totalPoints += grade.totalPoints;
      acc[grade.course].assignments += 1;

      return acc;
    },
    {} as Record<string, { totalScore: number; totalPoints: number; assignments: number }>
  );

  // Calculate overall average
  const overallTotal = Object.values(courseGrades).reduce(
    (sum, course) => sum + course.totalScore,
    0
  );
  const overallPossible = Object.values(courseGrades).reduce(
    (sum, course) => sum + course.totalPoints,
    0
  );
  const overallPercentage =
    overallPossible > 0 ? Math.round((overallTotal / overallPossible) * 100) : 0;

  // Helper function to get letter grade from percentage
  const getLetterGrade = (percentage: number): string => {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  };

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">My Grades</h1>
        <div>
          <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="2025">Academic Year 2025</option>
            <option value="2024">Academic Year 2024</option>
          </select>
        </div>
      </div>

      {/* GPA and Summary */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-1">Overall Average</h3>
            <div className="text-4xl font-bold text-blue-600">{overallPercentage}%</div>
            <div className="mt-1 text-xl font-semibold text-gray-600">
              Grade: {getLetterGrade(overallPercentage)}
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-1">Assignments Completed</h3>
            <div className="text-4xl font-bold text-blue-600">{activeGrades.length}</div>
            <div className="mt-1 text-sm text-gray-500">
              {activeTab === 'term1' ? 'Term 1' : 'Term 2'} Academic Period
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-1">Current Rank</h3>
            <div className="text-4xl font-bold text-blue-600">3rd</div>
            <div className="mt-1 text-sm text-gray-500">Out of 35 students</div>
          </div>
        </div>
      </Card>

      {/* Term tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('term1')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'term1'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Term 1 (Jan-Mar)
          </button>
          <button
            onClick={() => setActiveTab('term2')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'term2'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Term 2 (Apr-Jun)
          </button>
          <button
            onClick={() => setActiveTab('term3')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'term3'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Term 3 (Jul-Sep)
          </button>
          <button
            onClick={() => setActiveTab('term4')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'term4'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Term 4 (Oct-Dec)
          </button>
        </nav>
      </div>

      {/* Course summaries */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(courseGrades).map(([course, data]) => {
          const percentage = Math.round((data.totalScore / data.totalPoints) * 100);
          return (
            <Card key={course} className="p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-1">{course}</h3>
              <p className="text-sm text-gray-500">{data.assignments} assignments</p>

              <div className="flex items-center justify-between mt-3">
                <span className="text-2xl font-bold text-blue-600">{percentage}%</span>
                <span className="text-lg font-semibold text-gray-700">
                  Grade: {getLetterGrade(percentage)}
                </span>
              </div>

              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-500 flex justify-between">
                <span>
                  Score: {data.totalScore} / {data.totalPoints}
                </span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Detailed grades table */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Detailed Assignments</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Assignment
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Grade
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {activeGrades.map(grade => (
                <tr key={grade.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">
                    {grade.assignment}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">{grade.course}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{grade.dueDate}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {grade.score} / {grade.totalPoints}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${grade.grade === 'A' ? 'bg-green-100 text-green-800' : ''}
                      ${grade.grade === 'A-' ? 'bg-green-100 text-green-800' : ''}
                      ${grade.grade === 'B+' ? 'bg-blue-100 text-blue-800' : ''}
                      ${grade.grade === 'B' ? 'bg-blue-100 text-blue-800' : ''}
                      ${grade.grade === 'C' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${grade.grade === 'D' ? 'bg-orange-100 text-orange-800' : ''}
                      ${grade.grade === 'F' ? 'bg-red-100 text-red-800' : ''}
                    `}
                    >
                      {grade.grade}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
