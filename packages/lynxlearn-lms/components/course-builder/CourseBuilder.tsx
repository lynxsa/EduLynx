'use client';

import {
  BookMarked,
  BookOpen,
  CheckCircle,
  Clock,
  Download,
  Edit3,
  Eye,
  FileText,
  Image,
  Layers,
  Mic,
  Plus,
  Save,
  Settings,
  Trash2,
  Upload,
  Video,
} from 'lucide-react';
import { useRef, useState } from 'react';
import { Button } from '../ui/button';

interface LessonContent {
  id: string;
  type: 'text' | 'video' | 'image' | 'audio' | 'quiz' | 'assignment' | 'document';
  title: string;
  content: any;
  order: number;
  duration?: number;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  content: LessonContent[];
  prerequisites: string[];
  learningObjectives: string[];
}

interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  estimatedHours: number;
}

interface Course {
  id: string;
  title: string;
  description: string;
  subject: string;
  grade: number;
  modules: Module[];
  thumbnailUrl?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  language: 'english' | 'afrikaans';
}

export default function CourseBuilder() {
  const [course, setCourse] = useState<Course>({
    id: '',
    title: '',
    description: '',
    subject: '',
    grade: 8,
    modules: [],
    difficulty: 'beginner',
    tags: [],
    language: 'english',
  });

  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'settings' | 'preview'>(
    'overview'
  );
  const [draggedContent, setDraggedContent] = useState<LessonContent | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const subjects = [
    'Mathematics',
    'Physical Sciences',
    'Life Sciences',
    'English Home Language',
    'English First Additional Language',
    'Afrikaans Home Language',
    'Afrikaans First Additional Language',
    'History',
    'Geography',
    'Life Orientation',
    'Business Studies',
    'Economics',
    'Accounting',
    'Information Technology',
    'Computer Applications Technology',
    'Engineering Graphics and Design',
    'Technical Mathematics',
    'Technical Sciences',
  ];

  const contentTypes = [
    { type: 'text', icon: FileText, label: 'Text Content', color: 'blue' },
    { type: 'video', icon: Video, label: 'Video Lesson', color: 'red' },
    { type: 'image', icon: Image, label: 'Image/Diagram', color: 'green' },
    { type: 'audio', icon: Mic, label: 'Audio Recording', color: 'purple' },
    { type: 'quiz', icon: CheckCircle, label: 'Interactive Quiz', color: 'yellow' },
    { type: 'assignment', icon: BookMarked, label: 'Assignment', color: 'indigo' },
    { type: 'document', icon: Download, label: 'Document/PDF', color: 'gray' },
  ];

  const addModule = () => {
    const newModule: Module = {
      id: `module-${Date.now()}`,
      title: 'New Module',
      description: '',
      lessons: [],
      estimatedHours: 0,
    };
    setCourse(prev => ({
      ...prev,
      modules: [...prev.modules, newModule],
    }));
    setSelectedModule(newModule.id);
  };

  const addLesson = (moduleId: string) => {
    const newLesson: Lesson = {
      id: `lesson-${Date.now()}`,
      title: 'New Lesson',
      description: '',
      duration: 30,
      difficulty: 'beginner',
      content: [],
      prerequisites: [],
      learningObjectives: [],
    };

    setCourse(prev => ({
      ...prev,
      modules: prev.modules.map(module =>
        module.id === moduleId ? { ...module, lessons: [...module.lessons, newLesson] } : module
      ),
    }));
    setSelectedLesson(newLesson.id);
  };

  const addContent = (lessonId: string, type: LessonContent['type']) => {
    const newContent: LessonContent = {
      id: `content-${Date.now()}`,
      type,
      title: `New ${type} content`,
      content: type === 'text' ? '' : null,
      order: 0,
    };

    // Update the specific lesson
    setCourse(prev => ({
      ...prev,
      modules: prev.modules.map(module => ({
        ...module,
        lessons: module.lessons.map(lesson => {
          if (lesson.id === lessonId) {
            const newOrder = lesson.content.length;
            return {
              ...lesson,
              content: [...lesson.content, { ...newContent, order: newOrder }],
            };
          }
          return lesson;
        }),
      })),
    }));
  };

  const updateCourse = (updates: Partial<Course>) => {
    setCourse(prev => ({ ...prev, ...updates }));
  };

  const getCurrentModule = () => {
    return course.modules.find(m => m.id === selectedModule);
  };

  const getCurrentLesson = () => {
    const currentModule = getCurrentModule();
    return currentModule?.lessons.find(l => l.id === selectedLesson);
  };

  const saveCourse = async () => {
    try {
      // Here you would integrate with your backend API
      console.log('Saving course:', course);
      alert('Course saved successfully!');
    } catch (error) {
      console.error('Error saving course:', error);
      alert('Error saving course. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-violet-50/20 dark:from-slate-900 dark:via-purple-900/10 dark:to-violet-900/5">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl p-6 border border-white/20 dark:border-slate-700/50 shadow-xl shadow-purple-500/5 mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-violet-500 rounded-2xl text-white">
                <BookOpen className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
                  Course Builder
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Create engaging CAPS-aligned educational content
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={saveCourse}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Course
              </Button>
              <Button variant="outline" className="border-purple-200 dark:border-purple-700">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 mt-6 bg-gray-100/50 dark:bg-slate-700/50 rounded-xl p-1">
            {[
              { id: 'overview', label: 'Course Overview', icon: BookOpen },
              { id: 'content', label: 'Content Builder', icon: Layers },
              { id: 'settings', label: 'Settings', icon: Settings },
              { id: 'preview', label: 'Preview', icon: Eye },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Course Structure */}
          <div className="lg:col-span-1">
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl p-6 border border-white/20 dark:border-slate-700/50 shadow-xl shadow-purple-500/5 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Course Structure
                </h3>
                <Button onClick={addModule} size="sm" variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-3">
                {course.modules.map(module => (
                  <div
                    key={module.id}
                    className="border border-gray-200 dark:border-slate-600 rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() =>
                        setSelectedModule(selectedModule === module.id ? null : module.id)
                      }
                      className={`w-full p-3 text-left transition-colors ${
                        selectedModule === module.id
                          ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                          : 'bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium truncate">{module.title}</span>
                        <div className="flex items-center space-x-1">
                          <span className="text-xs text-gray-500">{module.lessons.length}</span>
                          <Button
                            onClick={e => {
                              e.stopPropagation();
                              addLesson(module.id);
                            }}
                            size="sm"
                            variant="ghost"
                            className="w-6 h-6 p-0"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </button>

                    {selectedModule === module.id && (
                      <div className="bg-gray-50 dark:bg-slate-600/50">
                        {module.lessons.map(lesson => (
                          <button
                            key={lesson.id}
                            onClick={() => setSelectedLesson(lesson.id)}
                            className={`w-full p-3 text-left text-sm transition-colors border-t border-gray-200 dark:border-slate-500 ${
                              selectedLesson === lesson.id
                                ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                                : 'hover:bg-gray-100 dark:hover:bg-slate-500/50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="truncate">{lesson.title}</span>
                              <div className="flex items-center space-x-2 text-xs text-gray-500">
                                <Clock className="w-3 h-3" />
                                <span>{lesson.duration}m</span>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {course.modules.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No modules yet</p>
                    <p className="text-sm">Click + to add your first module</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {activeTab === 'overview' && (
              <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-slate-700/50 shadow-xl shadow-purple-500/5">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Course Overview
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Course Title
                    </label>
                    <input
                      type="text"
                      value={course.title}
                      onChange={e => updateCourse({ title: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                      placeholder="Enter course title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Subject
                    </label>
                    <select
                      value={course.subject}
                      onChange={e => updateCourse({ subject: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Select Subject</option>
                      {subjects.map(subject => (
                        <option key={subject} value={subject}>
                          {subject}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Grade Level
                    </label>
                    <select
                      value={course.grade}
                      onChange={e => updateCourse({ grade: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    >
                      {[8, 9, 10, 11, 12].map(grade => (
                        <option key={grade} value={grade}>
                          Grade {grade}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Difficulty Level
                    </label>
                    <select
                      value={course.difficulty}
                      onChange={e =>
                        updateCourse({ difficulty: e.target.value as Course['difficulty'] })
                      }
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Course Description
                  </label>
                  <textarea
                    value={course.description}
                    onChange={e => updateCourse({ description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    placeholder="Describe what students will learn in this course..."
                  />
                </div>
              </div>
            )}

            {activeTab === 'content' && selectedLesson && (
              <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-slate-700/50 shadow-xl shadow-purple-500/5">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {getCurrentLesson()?.title || 'Lesson Content'}
                  </h2>
                  <div className="flex items-center space-x-2">
                    {contentTypes.map(type => (
                      <Button
                        key={type.type}
                        onClick={() =>
                          addContent(selectedLesson, type.type as LessonContent['type'])
                        }
                        size="sm"
                        variant="outline"
                        className="flex items-center space-x-2"
                      >
                        <type.icon className="w-4 h-4" />
                        <span className="hidden sm:inline">{type.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  {getCurrentLesson()?.content.map(content => (
                    <div
                      key={content.id}
                      className="p-4 border border-gray-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          {contentTypes.find(t => t.type === content.type)?.icon && (
                            <div
                              className={`p-2 rounded-lg bg-${contentTypes.find(t => t.type === content.type)?.color}-100 dark:bg-${contentTypes.find(t => t.type === content.type)?.color}-900/30`}
                            >
                              {/* Icon would go here */}
                            </div>
                          )}
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {content.title}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {contentTypes.find(t => t.type === content.type)?.label}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="ghost">
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {content.type === 'text' && (
                        <textarea
                          value={content.content || ''}
                          onChange={e => {
                            // Update content here
                          }}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                          rows={4}
                          placeholder="Enter your content here..."
                        />
                      )}

                      {content.type === 'video' && (
                        <div className="p-6 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg text-center">
                          <Video className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                          <p className="text-gray-500 dark:text-gray-400 mb-3">
                            Upload or link a video
                          </p>
                          <Button size="sm" variant="outline">
                            <Upload className="w-4 h-4 mr-2" />
                            Choose File
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}

                  {!getCurrentLesson()?.content.length && (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                      <Layers className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">No content yet</p>
                      <p>Add content blocks to build your lesson</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'content' && !selectedLesson && (
              <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-slate-700/50 shadow-xl shadow-purple-500/5">
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">Select a lesson to edit content</p>
                  <p>Choose a lesson from the course structure on the left</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
