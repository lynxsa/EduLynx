'use client';

import { debounce } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';

// Types for performance data
export interface PerformanceMetrics {
  overall: {
    averageGrade: number;
    totalStudents: number;
    passRate: number;
    improvementRate: number;
  };
  byGrade: Array<{
    grade: string;
    averageScore: number;
    studentCount: number;
    passRate: number;
  }>;
  bySubject: Array<{
    subject: string;
    averageScore: number;
    studentCount: number;
    passRate: number;
    teacher: string;
  }>;
  trends: Array<{
    period: string;
    averageScore: number;
    passRate: number;
    improvement: number;
  }>;
}

export interface StudentData {
  id: string;
  name: string;
  grade: string;
  class: string;
  studentId: string;
  averageGrade: number;
  subjects: Array<{
    name: string;
    grade: number;
    teacher: string;
  }>;
}

export interface TeacherData {
  id: string;
  name: string;
  email: string;
  subjects: string[];
  classes: string[];
  totalStudents: number;
  averageClassPerformance: number;
}

export interface ParentData {
  id: string;
  name: string;
  email: string;
  phone: string;
  students: Array<{
    id: string;
    name: string;
    grade: string;
    class: string;
    averageGrade: number;
  }>;
}

interface UseDataOptions {
  refreshInterval?: number;
  enabled?: boolean;
  filter?: Record<string, any>;
}

interface DataState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// Generic data fetching hook
function useDataFetch<T>(
  fetchFn: () => Promise<T>,
  options: UseDataOptions = {}
): DataState<T> & { refetch: () => Promise<void> } {
  const { refreshInterval, enabled = true } = options;
  const [state, setState] = useState<DataState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const debouncedFetch = useMemo(
    () =>
      debounce(async () => {
        if (!enabled) return;

        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
          const result = await fetchFn();
          setState({ data: result, loading: false, error: null });
        } catch (error) {
          setState({
            data: null,
            loading: false,
            error: error instanceof Error ? error.message : 'An error occurred',
          });
        }
      }, 300),
    [fetchFn, enabled]
  );

  const refetch = useCallback(async () => {
    await debouncedFetch();
  }, [debouncedFetch]);

  useEffect(() => {
    debouncedFetch();
  }, [debouncedFetch, enabled]);

  useEffect(() => {
    if (refreshInterval && enabled) {
      const interval = setInterval(debouncedFetch, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [debouncedFetch, refreshInterval, enabled]);

  useEffect(() => {
    return () => {
      debouncedFetch.cancel();
    };
  }, [debouncedFetch]);

  return { ...state, refetch };
}

// Performance metrics hook
export function usePerformanceMetrics(
  filter: {
    type: 'overall' | 'grade' | 'subject' | 'trends';
    period: 'week' | 'month' | 'semester' | 'year';
    gradeLevel?: string;
    subject?: string;
  },
  options: UseDataOptions = {}
): DataState<PerformanceMetrics> & { refetch: () => Promise<void> } {
  const fetchPerformanceMetrics = useCallback(async (): Promise<PerformanceMetrics> => {
    const queryParams = new URLSearchParams({
      type: filter.type,
      period: filter.period,
      ...(filter.gradeLevel && { gradeLevel: filter.gradeLevel }),
      ...(filter.subject && { subject: filter.subject }),
    });

    const response = await fetch(`/api/analytics/performance?${queryParams}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch performance metrics: ${response.statusText}`);
    }

    return response.json();
  }, [filter]);

  return useDataFetch(fetchPerformanceMetrics, options);
}

// Students data hook
export function useStudents(
  options: UseDataOptions = {}
): DataState<StudentData[]> & { refetch: () => Promise<void> } {
  const fetchStudents = useCallback(async (): Promise<StudentData[]> => {
    const response = await fetch('/api/students?include=grade,class,subjects');
    if (!response.ok) {
      throw new Error(`Failed to fetch students: ${response.statusText}`);
    }

    const data = await response.json();
    return data.map((student: any) => ({
      id: student.id,
      name: `${student.name} ${student.surname}`,
      grade: student.class?.grade?.level || 'Unknown',
      class: student.class?.name || 'No Class',
      studentId: student.username,
      averageGrade:
        student.results?.reduce((sum: number, result: any) => sum + (result.score || 0), 0) /
          (student.results?.length || 1) || 0,
      subjects:
        student.results?.map((result: any) => ({
          name:
            result.exam?.lesson?.subject?.name ||
            result.assignment?.lesson?.subject?.name ||
            'Unknown',
          grade: result.score || 0,
          teacher:
            result.exam?.lesson?.teacher?.name ||
            result.assignment?.lesson?.teacher?.name ||
            'Unknown',
        })) || [],
    }));
  }, []);

  return useDataFetch(fetchStudents, options);
}

// Teachers data hook
export function useTeachers(
  options: UseDataOptions = {}
): DataState<TeacherData[]> & { refetch: () => Promise<void> } {
  const fetchTeachers = useCallback(async (): Promise<TeacherData[]> => {
    const response = await fetch('/api/teachers?include=subjects,classes');
    if (!response.ok) {
      throw new Error(`Failed to fetch teachers: ${response.statusText}`);
    }

    const data = await response.json();
    return data.map((teacher: any) => ({
      id: teacher.id,
      name: `${teacher.name} ${teacher.surname}`,
      email: teacher.email,
      subjects: teacher.subjects?.map((s: any) => s.name) || [],
      classes: teacher.lessons?.map((l: any) => l.class?.name).filter(Boolean) || [],
      totalStudents:
        teacher.lessons?.reduce(
          (sum: number, lesson: any) => sum + (lesson.class?.students?.length || 0),
          0
        ) || 0,
      averageClassPerformance: 0, // Calculate from results if needed
    }));
  }, []);

  return useDataFetch(fetchTeachers, options);
}

// Parents data hook
export function useParents(
  options: UseDataOptions = {}
): DataState<ParentData[]> & { refetch: () => Promise<void> } {
  const fetchParents = useCallback(async (): Promise<ParentData[]> => {
    const response = await fetch('/api/parents?include=students');
    if (!response.ok) {
      throw new Error(`Failed to fetch parents: ${response.statusText}`);
    }

    const data = await response.json();
    return data.map((parent: any) => ({
      id: parent.id,
      name: `${parent.name} ${parent.surname}`,
      email: parent.email,
      phone: parent.phone || '',
      students:
        parent.students?.map((student: any) => ({
          id: student.id,
          name: `${student.name} ${student.surname}`,
          grade: student.class?.grade?.level || 'Unknown',
          class: student.class?.name || 'No Class',
          averageGrade:
            student.results?.reduce((sum: number, result: any) => sum + (result.score || 0), 0) /
              (student.results?.length || 1) || 0,
        })) || [],
    }));
  }, []);

  return useDataFetch(fetchParents, options);
}

// Weather data hook for TimeWeatherCard
export function useWeather(
  location: string = 'Cape Town',
  options: UseDataOptions = {}
): DataState<{
  temperature: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}> & { refetch: () => Promise<void> } {
  const fetchWeather = useCallback(async () => {
    // Mock weather data - replace with actual weather API
    const conditions = ['sunny', 'cloudy', 'rainy', 'windy'];
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];

    return {
      temperature: Math.floor(Math.random() * 30) + 10, // 10-40°C
      condition: randomCondition,
      icon: randomCondition,
      humidity: Math.floor(Math.random() * 50) + 30, // 30-80%
      windSpeed: Math.floor(Math.random() * 20) + 5, // 5-25 km/h
    };
  }, []);

  return useDataFetch(fetchWeather, {
    ...options,
    refreshInterval: options.refreshInterval || 10 * 60 * 1000, // 10 minutes
  });
}

// Real-time notifications hook
export function useNotifications(options: UseDataOptions = {}): DataState<
  Array<{
    id: string;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'error' | 'success';
    timestamp: Date;
    read: boolean;
  }>
> & { refetch: () => Promise<void> } {
  const fetchNotifications = useCallback(async () => {
    const response = await fetch('/api/notifications');
    if (!response.ok) {
      throw new Error(`Failed to fetch notifications: ${response.statusText}`);
    }

    const data = await response.json();
    return data.map((notification: any) => ({
      ...notification,
      timestamp: new Date(notification.createdAt),
    }));
  }, []);

  return useDataFetch(fetchNotifications, {
    ...options,
    refreshInterval: options.refreshInterval || 30 * 1000, // 30 seconds
  });
}

const performanceHooks = {
  usePerformanceMetrics,
  useStudents,
  useTeachers,
  useParents,
  useWeather,
  useNotifications,
};

export default performanceHooks;
