import { renderHook, waitFor } from '@testing-library/react';
import { usePerformanceMetrics, useStudents, useTeachers } from '../usePerformanceData';

// Mock fetch
global.fetch = jest.fn();

// Mock lodash debounce
jest.mock('lodash', () => ({
  debounce: (fn: any) => fn,
}));

describe('Performance Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('usePerformanceMetrics', () => {
    it('fetches performance metrics successfully', async () => {
      const mockData = {
        overall: {
          averageGrade: 75,
          totalStudents: 100,
          passRate: 85,
          improvementRate: 5,
        },
        byGrade: [],
        bySubject: [],
        trends: [],
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const { result } = renderHook(() =>
        usePerformanceMetrics({
          type: 'overall',
          period: 'month',
        })
      );

      await waitFor(() => {
        expect(result.current.data).toEqual(mockData);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
      });
    });

    it('handles fetch errors', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

      const { result } = renderHook(() =>
        usePerformanceMetrics({
          type: 'overall',
          period: 'month',
        })
      );

      await waitFor(() => {
        expect(result.current.data).toBeNull();
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe('API Error');
      });
    });

    it('updates when filter changes', async () => {
      const mockData1 = { overall: { averageGrade: 75 } };
      const mockData2 = { overall: { averageGrade: 80 } };

      (fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockData1,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockData2,
        });

      const { result, rerender } = renderHook(
        ({ filter }: { filter: any }) => usePerformanceMetrics(filter),
        {
          initialProps: {
            filter: { type: 'overall' as const, period: 'month' as const },
          },
        }
      );

      await waitFor(() => {
        expect(result.current.data).toEqual(mockData1);
      });

      rerender({
        filter: { type: 'grade' as const, period: 'month' as const },
      });

      await waitFor(() => {
        expect(result.current.data).toEqual(mockData2);
      });
    });
  });

  describe('useStudents', () => {
    it('fetches and transforms student data', async () => {
      const mockApiData = [
        {
          id: '1',
          name: 'John',
          surname: 'Doe',
          username: 'STU001',
          class: { name: 'Class A', grade: { level: '10' } },
          results: [{ score: 85 }, { score: 90 }],
        },
      ];

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiData,
      });

      const { result } = renderHook(() => useStudents());

      await waitFor(() => {
        expect(result.current.data).toHaveLength(1);
        expect(result.current.data![0]).toEqual({
          id: '1',
          name: 'John Doe',
          grade: '10',
          class: 'Class A',
          studentId: 'STU001',
          averageGrade: 87.5,
          subjects: expect.any(Array),
        });
      });
    });

    it('handles missing student data gracefully', async () => {
      const mockApiData = [
        {
          id: '1',
          name: 'Jane',
          surname: 'Smith',
          username: 'STU002',
          class: null,
          results: null,
        },
      ];

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiData,
      });

      const { result } = renderHook(() => useStudents());

      await waitFor(() => {
        expect(result.current.data![0]).toEqual({
          id: '1',
          name: 'Jane Smith',
          grade: 'Unknown',
          class: 'No Class',
          studentId: 'STU002',
          averageGrade: 0,
          subjects: [],
        });
      });
    });
  });

  describe('useTeachers', () => {
    it('fetches and transforms teacher data', async () => {
      const mockApiData = [
        {
          id: '1',
          name: 'Prof',
          surname: 'Johnson',
          email: 'prof@school.com',
          subjects: [{ name: 'Mathematics' }, { name: 'Physics' }],
          lessons: [
            { class: { name: 'Class A', students: [{}, {}] } },
            { class: { name: 'Class B', students: [{}] } },
          ],
        },
      ];

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiData,
      });

      const { result } = renderHook(() => useTeachers());

      await waitFor(() => {
        expect(result.current.data).toHaveLength(1);
        expect(result.current.data![0]).toEqual({
          id: '1',
          name: 'Prof Johnson',
          email: 'prof@school.com',
          subjects: ['Mathematics', 'Physics'],
          classes: ['Class A', 'Class B'],
          totalStudents: 3,
          averageClassPerformance: 0,
        });
      });
    });
  });

  describe('refetch functionality', () => {
    it('allows manual refetch of data', async () => {
      const mockData = { overall: { averageGrade: 75 } };

      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockData,
      });

      const { result } = renderHook(() =>
        usePerformanceMetrics({
          type: 'overall',
          period: 'month',
        })
      );

      await waitFor(() => {
        expect(result.current.data).toEqual(mockData);
      });

      // Call refetch
      await result.current.refetch();

      // Should call fetch again
      expect(fetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('options handling', () => {
    it('respects enabled option', () => {
      const { result } = renderHook(() =>
        usePerformanceMetrics({ type: 'overall', period: 'month' }, { enabled: false })
      );

      expect(result.current.loading).toBe(false);
      expect(fetch).not.toHaveBeenCalled();
    });

    it('handles refresh interval', () => {
      jest.useFakeTimers();

      const mockData = { overall: { averageGrade: 75 } };
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockData,
      });

      renderHook(() =>
        usePerformanceMetrics({ type: 'overall', period: 'month' }, { refreshInterval: 1000 })
      );

      // Fast forward time
      jest.advanceTimersByTime(1000);

      expect(fetch).toHaveBeenCalledTimes(2); // Initial + interval

      jest.useRealTimers();
    });
  });
});
