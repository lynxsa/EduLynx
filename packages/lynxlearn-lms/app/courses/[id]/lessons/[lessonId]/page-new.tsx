'use client';

import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Download,
  FileText,
  MessageSquare,
  Pause,
  Play,
  Volume2,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Button } from '../../../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../components/ui/card';
import ChatWidget from '../../../../../components/ui/chat-widget';
import { Progress } from '../../../../../components/ui/progress';

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  videoUrl?: string;
  content: string;
  resources: Array<{
    id: string;
    title: string;
    type: 'pdf' | 'video' | 'link' | 'document';
    url: string;
    size?: string;
  }>;
  quiz?: {
    questions: Array<{
      id: string;
      question: string;
      options: string[];
      correct: number;
      explanation: string;
    }>;
  };
}

interface Course {
  id: string;
  title: string;
  lessons: Array<{
    id: string;
    title: string;
    completed: boolean;
  }>;
}

// Mock lesson data with South African CAPS content
const mockLessons: Record<string, Lesson> = {
  '1': {
    id: '1',
    title: 'Introduction to Algebraic Expressions',
    description: 'Learn the fundamentals of algebraic expressions according to CAPS curriculum',
    duration: '45 minutes',
    videoUrl: 'https://www.youtube.com/embed/ZKehlWpnT2E',
    content: `
      <h2>What is an algebraic expression?</h2>
      <p>An algebraic expression is a mathematical phrase that contains variables, numbers, and operations. This forms part of the core CAPS Mathematics curriculum for Grade 10.</p>
      
      <h3>Components of algebraic expressions:</h3>
      <ul>
        <li><strong>Variables:</strong> Letters that represent unknown values (x, y, z, etc.)</li>
        <li><strong>Constants:</strong> Fixed numerical values</li>
        <li><strong>Operators:</strong> Mathematical operations (+, -, ×, ÷)</li>
        <li><strong>Exponents:</strong> Powers to which a value is raised</li>
      </ul>
      
      <h3>Examples from South African curriculum:</h3>
      <ul>
        <li>3x + 5 (Linear expression)</li>
        <li>2x² - 4y + 7 (Quadratic expression)</li>
        <li>a/b - 3c (Rational expression)</li>
      </ul>
      
      <h2>Terms and Coefficients</h2>
      <p>A term is a part of an expression separated by + or - signs.</p>
      <p>The coefficient is the numerical factor of a term.</p>
      
      <h3>Example:</h3>
      <p>In the expression <strong>5x² + 3xy - 7y + 2</strong></p>
      <ul>
        <li>5x² is a term with coefficient 5</li>
        <li>3xy is a term with coefficient 3</li>
        <li>-7y is a term with coefficient -7</li>
        <li>2 is a constant term</li>
      </ul>
      
      <h2>Real-world Applications in South Africa</h2>
      <p>Algebraic expressions are used in:</p>
      <ul>
        <li>Calculating exchange rates (R to $)</li>
        <li>Engineering projects (bridge construction)</li>
        <li>Agricultural planning (crop yield calculations)</li>
        <li>Economics (inflation models)</li>
      </ul>
    `,
    resources: [
      {
        id: 'r1',
        title: 'CAPS Mathematics Grade 10 Textbook Chapter 3',
        type: 'pdf',
        url: '/resources/caps-math-g10-ch3.pdf',
        size: '2.4 MB',
      },
      {
        id: 'r2',
        title: 'Algebraic Expressions Worksheet',
        type: 'pdf',
        url: '/resources/algebra-worksheet.pdf',
        size: '1.2 MB',
      },
      {
        id: 'r3',
        title: 'Interactive GeoGebra Tool',
        type: 'link',
        url: 'https://www.geogebra.org/algebra',
      },
    ],
    quiz: {
      questions: [
        {
          id: 'q1',
          question: 'Identify the coefficient of x² in the expression: 7x² - 4xy + 9',
          options: ['7', '-4', '9', 'x²'],
          correct: 0,
          explanation:
            'The coefficient is the numerical factor in front of the variable term. For 7x², the coefficient is 7.',
        },
        {
          id: 'q2',
          question: 'How many terms are in the expression: 3a - 5b + 2c - 8?',
          options: ['2', '3', '4', '5'],
          correct: 2,
          explanation:
            'Terms are separated by + or - signs. The terms are: 3a, -5b, 2c, and -8, making 4 terms total.',
        },
        {
          id: 'q3',
          question: 'Which of the following is a constant term in: 2x + 5y - 7?',
          options: ['2x', '5y', '-7', '2'],
          correct: 2,
          explanation:
            'A constant term has no variable. In this expression, -7 is the constant term.',
        },
      ],
    },
  },
};

const mockCourse: Course = {
  id: '1',
  title: 'Mathematics Grade 10 - CAPS',
  lessons: [
    { id: '1', title: 'Introduction to Algebraic Expressions', completed: false },
    { id: '2', title: 'Simplifying Algebraic Expressions', completed: false },
    { id: '3', title: 'Factorisation', completed: false },
    { id: '4', title: 'Linear Equations', completed: false },
    { id: '5', title: 'Simultaneous Equations', completed: false },
  ],
};

export default function LessonPage() {
  const params = useParams();
  const courseId = params.id as string;
  const lessonId = params.lessonId as string;

  const [currentSection, setCurrentSection] = useState<'video' | 'content' | 'quiz'>('video');
  const [videoProgress, setVideoProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const lesson = mockLessons[lessonId];
  const course = mockCourse;

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Lesson Not Found</h1>
          <p className="text-gray-600 mb-6">The lesson you're looking for doesn't exist.</p>
          <Link href={`/courses/${courseId}`}>
            <Button>Return to Course</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const currentLessonIndex = course.lessons.findIndex(l => l.id === lessonId);
  const nextLesson = course.lessons[currentLessonIndex + 1];
  const prevLesson = course.lessons[currentLessonIndex - 1];

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
  };

  const getQuizScore = () => {
    if (!lesson.quiz) return 0;
    let correct = 0;
    lesson.quiz.questions.forEach(q => {
      if (quizAnswers[q.id] === q.correct) correct++;
    });
    return Math.round((correct / lesson.quiz.questions.length) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href={`/courses/${courseId}`}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Course
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{lesson.title}</h1>
                <p className="text-sm text-gray-600">{course.title}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-1" />
                {lesson.duration}
              </div>
              <Progress value={videoProgress} className="w-32" />
              <span className="text-sm font-medium">{Math.round(videoProgress)}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Section Tabs */}
            <Card>
              <CardContent className="p-0">
                <div className="flex border-b">
                  {[
                    { id: 'video', label: 'Video Lesson', icon: Play },
                    { id: 'content', label: 'Study Material', icon: BookOpen },
                    { id: 'quiz', label: 'Quiz', icon: Brain },
                  ].map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setCurrentSection(id as any)}
                      className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                        currentSection === id
                          ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Video Section */}
            {currentSection === 'video' && (
              <Card>
                <CardContent className="p-0">
                  <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    {lesson.videoUrl ? (
                      <iframe
                        src={lesson.videoUrl}
                        className="w-full h-full"
                        allowFullScreen
                        title={lesson.title}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white">
                        <div className="text-center">
                          <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
                          <p className="text-lg">Video content coming soon</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Video Controls */}
                  <div className="p-4 border-t bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsPlaying(!isPlaying)}
                        >
                          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <Button variant="outline" size="sm">
                          <Volume2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Progress:</span>
                        <Progress value={videoProgress} className="w-32" />
                        <span className="text-sm font-medium">{Math.round(videoProgress)}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Content Section */}
            {currentSection === 'content' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5" />
                    <span>Study Material</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: lesson.content }}
                  />
                </CardContent>
              </Card>
            )}

            {/* Quiz Section */}
            {currentSection === 'quiz' && lesson.quiz && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Brain className="h-5 w-5" />
                    <span>Knowledge Check</span>
                  </CardTitle>
                  <p className="text-gray-600">Test your understanding of the lesson material</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {lesson.quiz.questions.map((question, index) => (
                    <div key={question.id} className="border rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-4">
                        {index + 1}. {question.question}
                      </h3>
                      <div className="space-y-2">
                        {question.options.map((option, optionIndex) => (
                          <label
                            key={optionIndex}
                            className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                              quizAnswers[question.id] === optionIndex
                                ? 'border-purple-500 bg-purple-50'
                                : 'border-gray-200 hover:bg-gray-50'
                            } ${
                              quizSubmitted
                                ? optionIndex === question.correct
                                  ? 'border-green-500 bg-green-50'
                                  : quizAnswers[question.id] === optionIndex
                                    ? 'border-red-500 bg-red-50'
                                    : ''
                                : ''
                            }`}
                          >
                            <input
                              type="radio"
                              name={question.id}
                              value={optionIndex}
                              checked={quizAnswers[question.id] === optionIndex}
                              onChange={e =>
                                setQuizAnswers(prev => ({
                                  ...prev,
                                  [question.id]: parseInt(e.target.value),
                                }))
                              }
                              disabled={quizSubmitted}
                              className="text-purple-600"
                            />
                            <span className="text-gray-700">{option}</span>
                            {quizSubmitted && optionIndex === question.correct && (
                              <CheckCircle className="h-4 w-4 text-green-600 ml-auto" />
                            )}
                          </label>
                        ))}
                      </div>
                      {quizSubmitted && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-sm text-blue-800">
                            <strong>Explanation:</strong> {question.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}

                  {!quizSubmitted ? (
                    <Button
                      onClick={handleQuizSubmit}
                      disabled={Object.keys(quizAnswers).length < lesson.quiz.questions.length}
                      className="w-full"
                    >
                      Submit Quiz
                    </Button>
                  ) : (
                    <div className="text-center">
                      <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-lg">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-medium">Quiz Complete! Score: {getQuizScore()}%</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Navigation */}
            <div className="flex justify-between">
              <div>
                {prevLesson && (
                  <Link href={`/courses/${courseId}/lessons/${prevLesson.id}`}>
                    <Button variant="outline" className="flex items-center space-x-2">
                      <ArrowLeft className="h-4 w-4" />
                      <span>Previous: {prevLesson.title}</span>
                    </Button>
                  </Link>
                )}
              </div>
              <div>
                {nextLesson && (
                  <Link href={`/courses/${courseId}/lessons/${nextLesson.id}`}>
                    <Button className="flex items-center space-x-2">
                      <span>Next: {nextLesson.title}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Resources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Resources</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowResources(!showResources)}
                  >
                    {showResources ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </CardTitle>
              </CardHeader>
              {showResources && (
                <CardContent className="space-y-3">
                  {lesson.resources.map(resource => (
                    <div
                      key={resource.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{resource.title}</p>
                          {resource.size && (
                            <p className="text-xs text-gray-500">{resource.size}</p>
                          )}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              )}
            </Card>

            {/* ProfLynx AI Chat */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5" />
                    <span>ProfLynx AI Tutor</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setShowChat(!showChat)}>
                    {showChat ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </CardTitle>
              </CardHeader>
              {showChat && (
                <CardContent className="p-0">
                  <ChatWidget
                    courseId={courseId}
                    lessonId={lessonId}
                    context={{
                      lessonTitle: lesson.title,
                      currentTopic: 'Algebraic Expressions',
                    }}
                  />
                </CardContent>
              )}
            </Card>

            {/* Progress Tracker */}
            <Card>
              <CardHeader>
                <CardTitle>Course Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {course.lessons.map(courseLesson => (
                    <div
                      key={courseLesson.id}
                      className={`flex items-center space-x-3 p-2 rounded-lg ${
                        courseLesson.id === lessonId
                          ? 'bg-purple-50 border border-purple-200'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          courseLesson.completed ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      />
                      <Link
                        href={`/courses/${courseId}/lessons/${courseLesson.id}`}
                        className="text-sm font-medium text-gray-900 hover:text-purple-600 flex-1"
                      >
                        {courseLesson.title}
                      </Link>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
