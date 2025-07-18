'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Bookmark,
  Brain,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  FileText,
  HelpCircle,
  Lightbulb,
  Maximize,
  Menu,
  MessageSquare,
  Pause,
  Play,
  Settings,
  Share2,
  SkipBack,
  SkipForward,
  Target,
  ThumbsDown,
  ThumbsUp,
  User,
  Volume2,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { courses, sampleLessons } from '../../data';

export default function LearnPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(2700); // 45 minutes in seconds
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showNotes, setShowNotes] = useState(false);

  const course = courses.find(c => c.id === courseId);

  if (!course) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
          <Link href="/courses">
            <Button>Back to Courses</Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentLesson = sampleLessons[currentLessonIndex];
  const progress = (currentTime / duration) * 100;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNextLesson = () => {
    if (currentLessonIndex < sampleLessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
      setCurrentTime(0);
    }
  };

  const handlePrevLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
      setCurrentTime(0);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex">
        {/* Sidebar */}
        <div
          className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 bg-gray-800 overflow-hidden`}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-bold text-lg text-white">{course.title}</h2>
                <p className="text-sm text-gray-400">{course.lessons} lessons</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-2">
              {sampleLessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    index === currentLessonIndex
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  }`}
                  onClick={() => setCurrentLessonIndex(index)}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      {lesson.completed ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : index === currentLessonIndex ? (
                        <Play className="w-5 h-5" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{lesson.title}</p>
                      <p className="text-xs opacity-75">{lesson.duration}</p>
                    </div>
                    <div className="text-xs opacity-75">{index + 1}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-gray-400">35%</span>
              </div>
              <Progress value={35} className="h-2" />
              <p className="text-xs text-gray-400 mt-2">
                {Math.round(sampleLessons.length * 0.35)} of {sampleLessons.length} lessons
                completed
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Navigation */}
          <div className="bg-gray-800 p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {!sidebarOpen && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(true)}
                  className="text-gray-400 hover:text-white"
                >
                  <Menu className="w-4 h-4" />
                </Button>
              )}
              <Link href={`/courses/${courseId}`}>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back to Course
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Bookmark className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
                onClick={() => setShowNotes(!showNotes)}
              >
                <FileText className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Video Player */}
          <div className="flex-1 flex">
            <div className="flex-1 flex flex-col">
              <div className="relative bg-black aspect-video">
                <iframe
                  src={currentLesson.videoUrl}
                  className="w-full h-full"
                  allowFullScreen
                  title={currentLesson.title}
                />

                {/* Custom Video Controls Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="space-y-2">
                    <Progress value={progress} className="h-1" />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handlePrevLesson}
                            disabled={currentLessonIndex === 0}
                            className="text-white hover:bg-white/20"
                          >
                            <SkipBack className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handlePlayPause}
                            className="text-white hover:bg-white/20"
                          >
                            {isPlaying ? (
                              <Pause className="w-5 h-5" />
                            ) : (
                              <Play className="w-5 h-5" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleNextLesson}
                            disabled={currentLessonIndex === sampleLessons.length - 1}
                            className="text-white hover:bg-white/20"
                          >
                            <SkipForward className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2">
                          <Volume2 className="w-4 h-4" />
                          <div className="w-20 h-1 bg-gray-600 rounded-full">
                            <div className="w-3/4 h-full bg-white rounded-full"></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                        <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                          <Settings className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                          <Maximize className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lesson Info */}
              <div className="bg-gray-800 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold mb-2">{currentLesson.title}</h1>
                    <p className="text-gray-400 mb-4">{currentLesson.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{currentLesson.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{course.teacher}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        <span>
                          Lesson {currentLessonIndex + 1} of {sampleLessons.length}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="text-gray-400 border-gray-600">
                      <ThumbsUp className="w-4 h-4 mr-2" />
                      Like
                    </Button>
                    <Button variant="outline" size="sm" className="text-gray-400 border-gray-600">
                      <ThumbsDown className="w-4 h-4 mr-2" />
                      Dislike
                    </Button>
                  </div>
                </div>

                <Tabs defaultValue="resources" className="w-full">
                  <TabsList className="bg-gray-700">
                    <TabsTrigger value="resources">Resources</TabsTrigger>
                    <TabsTrigger value="discussion">Discussion</TabsTrigger>
                    <TabsTrigger value="ai-help">AI Help</TabsTrigger>
                  </TabsList>

                  <TabsContent value="resources" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {currentLesson.resources.map((resource, index) => (
                        <Card key={index} className="bg-gray-700 border-gray-600">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-600 rounded-lg">
                                {resource.type === 'PDF' && <FileText className="w-4 h-4" />}
                                {resource.type === 'Practice' && <Target className="w-4 h-4" />}
                                {resource.type === 'Quiz' && <HelpCircle className="w-4 h-4" />}
                                {resource.type === 'Video' && <Play className="w-4 h-4" />}
                                {resource.type === 'Simulation' && (
                                  <Lightbulb className="w-4 h-4" />
                                )}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-sm">{resource.title}</h4>
                                <p className="text-xs text-gray-400">{resource.type}</p>
                              </div>
                              <Button variant="ghost" size="sm">
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="discussion">
                    <Card className="bg-gray-700 border-gray-600">
                      <CardContent className="p-4">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                              JD
                            </div>
                            <div>
                              <p className="font-medium text-sm">John Doe</p>
                              <p className="text-xs text-gray-400">2 hours ago</p>
                            </div>
                          </div>
                          <p className="text-sm">
                            Great explanation of the chain rule! The examples really helped me
                            understand the concept better.
                          </p>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="text-gray-400">
                              <ThumbsUp className="w-3 h-3 mr-1" />5
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gray-400">
                              Reply
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="ai-help">
                    <Card className="bg-gray-700 border-gray-600">
                      <CardContent className="p-4">
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 mb-4">
                            <Brain className="w-5 h-5 text-purple-400" />
                            <h4 className="font-semibold">AI Learning Assistant</h4>
                          </div>
                          <p className="text-sm text-gray-400">
                            Ask questions about this lesson and get instant help from our AI tutor.
                          </p>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Ask a question about this lesson..."
                              className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-sm"
                            />
                            <Button size="sm">
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Ask
                            </Button>
                          </div>
                          <div className="space-y-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-gray-400 border-gray-600"
                            >
                              Explain the chain rule again
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-gray-400 border-gray-600"
                            >
                              Give me practice problems
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-gray-400 border-gray-600"
                            >
                              Show step-by-step solution
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            {/* Notes Panel */}
            {showNotes && (
              <div className="w-80 bg-gray-800 border-l border-gray-700 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">My Notes</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowNotes(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <textarea
                  placeholder="Take notes while watching..."
                  className="w-full h-64 p-3 bg-gray-900 border border-gray-600 rounded-lg text-sm resize-none"
                />
                <div className="flex gap-2 mt-3">
                  <Button size="sm" className="flex-1">
                    Save
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-600">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Navigation */}
          <div className="bg-gray-800 p-4 border-t border-gray-700">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handlePrevLesson}
                disabled={currentLessonIndex === 0}
                className="border-gray-600 text-gray-400"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous Lesson
              </Button>

              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  className="border-gray-600 text-gray-400"
                  onClick={() => setCurrentTime(0)}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Restart
                </Button>
                <Button className="bg-green-600 hover:bg-green-700">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark Complete
                </Button>
              </div>

              <Button
                onClick={handleNextLesson}
                disabled={currentLessonIndex === sampleLessons.length - 1}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Next Lesson
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
