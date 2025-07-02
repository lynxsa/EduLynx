'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Clock, Play, Star, Trophy, XCircle } from 'lucide-react';
import { useState } from 'react';

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  options?: string[];
  correctAnswer: string | number;
  explanation?: string;
  points: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  subject: string;
  grade: string;
  duration: number; // in minutes
  totalPoints: number;
  questions: QuizQuestion[];
  difficulty: 'easy' | 'medium' | 'hard';
  attempts?: number;
  bestScore?: number;
}

interface QuizCardProps {
  quiz: Quiz;
  onStart: (quiz: Quiz) => void;
}

export function QuizCard({ quiz, onStart }: QuizCardProps) {
  const difficultyColors = {
    easy: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    hard: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return '⭐';
      case 'medium':
        return '⭐⭐';
      case 'hard':
        return '⭐⭐⭐';
      default:
        return '⭐';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="quiz-card glass-card p-6 rounded-xl border border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{quiz.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{quiz.description}</p>

          <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-lg">{quiz.subject}</span>
            <span>Grade {quiz.grade}</span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {quiz.duration}min
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span
            className={`px-2 py-1 rounded-lg text-xs font-medium ${difficultyColors[quiz.difficulty]}`}
          >
            {getDifficultyIcon(quiz.difficulty)} {quiz.difficulty}
          </span>
          {quiz.bestScore && (
            <div className="flex items-center gap-1 text-sm text-amber-600">
              <Trophy className="w-4 h-4" />
              {quiz.bestScore}%
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {quiz.questions.length} questions • {quiz.totalPoints} points
          {quiz.attempts && <span> • {quiz.attempts} attempts</span>}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onStart(quiz)}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors"
        >
          <Play className="w-4 h-4" />
          Start Quiz
        </motion.button>
      </div>
    </motion.div>
  );
}

interface QuizTakingProps {
  quiz: Quiz;
  onComplete: (score: number, answers: Record<string, any>) => void;
  onExit: () => void;
}

export function QuizTaking({ quiz, onComplete, onExit }: QuizTakingProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeLeft, setTimeLeft] = useState(quiz.duration * 60); // Convert to seconds
  const [showResults, setShowResults] = useState(false);

  // Timer effect
  useState(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  });

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    let score = 0;
    let totalPoints = 0;

    quiz.questions.forEach(question => {
      totalPoints += question.points;
      const userAnswer = answers[question.id];

      if (question.type === 'multiple-choice') {
        if (userAnswer === question.correctAnswer) {
          score += question.points;
        }
      } else if (question.type === 'true-false') {
        if (userAnswer === question.correctAnswer) {
          score += question.points;
        }
      } else if (question.type === 'short-answer') {
        // Simple string comparison - in real app, you'd want more sophisticated checking
        if (
          userAnswer?.toLowerCase().trim() ===
          question.correctAnswer.toString().toLowerCase().trim()
        ) {
          score += question.points;
        }
      }
    });

    const percentage = Math.round((score / totalPoints) * 100);
    onComplete(percentage, answers);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQ = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl border border-gray-200/50 dark:border-gray-700/50">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{quiz.title}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-orange-600">
            <Clock className="w-5 h-5" />
            <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
          </div>

          <button
            onClick={onExit}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Exit Quiz
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <motion.div
            className="bg-primary h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question */}
      <motion.div
        key={currentQuestion}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-6 mb-6"
      >
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-lg">
              {currentQ.points} points
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              {currentQ.type.replace('-', ' ')}
            </span>
          </div>

          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            {currentQ.question}
          </h3>

          {/* Answer Options */}
          <div className="space-y-3">
            {currentQ.type === 'multiple-choice' && currentQ.options && (
              <div className="grid gap-3">
                {currentQ.options.map((option, index) => (
                  <motion.label
                    key={index}
                    whileHover={{ scale: 1.01 }}
                    className="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  >
                    <input
                      type="radio"
                      name={`question-${currentQ.id}`}
                      value={index}
                      checked={answers[currentQ.id] === index}
                      onChange={e => handleAnswerChange(currentQ.id, parseInt(e.target.value))}
                      className="mr-3 text-primary focus:ring-primary"
                    />
                    <span className="text-gray-900 dark:text-white">{option}</span>
                  </motion.label>
                ))}
              </div>
            )}

            {currentQ.type === 'true-false' && (
              <div className="grid grid-cols-2 gap-3">
                {['True', 'False'].map((option, index) => (
                  <motion.label
                    key={option}
                    whileHover={{ scale: 1.01 }}
                    className="flex items-center justify-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  >
                    <input
                      type="radio"
                      name={`question-${currentQ.id}`}
                      value={option}
                      checked={answers[currentQ.id] === option}
                      onChange={e => handleAnswerChange(currentQ.id, e.target.value)}
                      className="mr-3 text-primary focus:ring-primary"
                    />
                    <span className="text-gray-900 dark:text-white font-medium">{option}</span>
                  </motion.label>
                ))}
              </div>
            )}

            {currentQ.type === 'short-answer' && (
              <textarea
                value={answers[currentQ.id] || ''}
                onChange={e => handleAnswerChange(currentQ.id, e.target.value)}
                placeholder="Type your answer here..."
                className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-primary"
                rows={4}
              />
            )}
          </div>
        </div>
      </motion.div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="px-6 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>

        <div className="flex items-center gap-2">
          {quiz.questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                index === currentQuestion
                  ? 'bg-primary text-white'
                  : answers[quiz.questions[index].id] !== undefined
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {currentQuestion === quiz.questions.length - 1 ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          >
            Submit Quiz
          </motion.button>
        ) : (
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}

interface QuizResultsProps {
  quiz: Quiz;
  score: number;
  answers: Record<string, any>;
  onRetry: () => void;
  onExit: () => void;
}

export function QuizResults({ quiz, score, answers, onRetry, onExit }: QuizResultsProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return 'Excellent work! 🎉';
    if (score >= 80) return 'Great job! 👏';
    if (score >= 70) return 'Good effort! 👍';
    if (score >= 60) return 'Keep practicing! 📚';
    return 'Need more study time 💪';
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className={`text-6xl font-bold mb-4 ${getScoreColor(score)}`}>{score}%</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {getScoreMessage(score)}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          You scored {score}% on {quiz.title}
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="text-center p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl border border-gray-200/50 dark:border-gray-700/50">
          <Trophy className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{score}%</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Final Score</div>
        </div>

        <div className="text-center p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl border border-gray-200/50 dark:border-gray-700/50">
          <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {Object.keys(answers).length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Questions Answered</div>
        </div>

        <div className="text-center p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl border border-gray-200/50 dark:border-gray-700/50">
          <Star className="w-8 h-8 text-purple-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{quiz.totalPoints}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Points</div>
        </div>
      </div>

      {/* Question Review */}
      <div className="space-y-4 mb-8">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Review Your Answers</h3>
        {quiz.questions.map((question, index) => {
          const userAnswer = answers[question.id];
          const isCorrect = userAnswer === question.correctAnswer;

          return (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl border border-gray-200/50 dark:border-gray-700/50"
            >
              <div className="flex items-start gap-3">
                <div className={`p-1 rounded-full ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
                  {isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>

                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    {question.question}
                  </h4>

                  <div className="space-y-1 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Your answer: </span>
                      <span className={isCorrect ? 'text-green-600' : 'text-red-600'}>
                        {question.type === 'multiple-choice' && question.options
                          ? question.options[userAnswer as number] || 'Not answered'
                          : userAnswer || 'Not answered'}
                      </span>
                    </div>

                    {!isCorrect && (
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Correct answer: </span>
                        <span className="text-green-600">
                          {question.type === 'multiple-choice' && question.options
                            ? question.options[question.correctAnswer as number]
                            : question.correctAnswer}
                        </span>
                      </div>
                    )}

                    {question.explanation && (
                      <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                        <span className="text-blue-800 dark:text-blue-400 text-sm">
                          💡 {question.explanation}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {isCorrect ? question.points : 0} / {question.points} pts
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors"
        >
          Retry Quiz
        </button>
        <button
          onClick={onExit}
          className="px-6 py-3 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Back to Quizzes
        </button>
      </div>
    </div>
  );
}

const QuizComponents = { QuizCard, QuizTaking, QuizResults };

export default QuizComponents;
