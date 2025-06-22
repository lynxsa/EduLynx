import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export interface InsightData {
  title: string;
  insight: string;
  recommendation: string;
  trend: 'up' | 'down' | 'stable';
  impact: 'high' | 'medium' | 'low';
  category: 'academic' | 'attendance' | 'behavior' | 'resources' | 'performance';
}

export class ProfLynxAI {
  private model: any;

  constructor() {
    try {
      this.model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    } catch (error) {
      console.warn('Gemini AI not available, using mock responses');
      this.model = null;
    }
  }

  private getMockInsights(): InsightData[] {
    const mockInsights = [
      {
        title: 'Student Engagement Trends',
        insight:
          'Mathematics participation has increased by 23% this quarter, with stronger engagement in interactive problem-solving sessions.',
        recommendation:
          'Consider expanding interactive teaching methods to other subjects to maintain this positive momentum.',
        trend: 'up' as const,
        impact: 'high' as const,
        category: 'academic' as const,
      },
      {
        title: 'Attendance Pattern Analysis',
        insight:
          'Monday morning attendance shows a 12% decline, particularly affecting Grade 9-11 students.',
        recommendation:
          'Implement engaging Monday morning activities or flexible start times to improve early-week attendance.',
        trend: 'down' as const,
        impact: 'medium' as const,
        category: 'attendance' as const,
      },
      {
        title: 'Resource Utilization Insight',
        insight:
          'Library digital resources are underutilized, with only 34% of students accessing online databases.',
        recommendation:
          'Provide digital literacy workshops and integrate online resources into curriculum assignments.',
        trend: 'stable' as const,
        impact: 'medium' as const,
        category: 'resources' as const,
      },
      {
        title: 'Performance Correlation',
        insight:
          'Students with consistent homework submission show 28% higher test scores across all subjects.',
        recommendation:
          'Implement gamified homework tracking system to encourage consistent submission habits.',
        trend: 'up' as const,
        impact: 'high' as const,
        category: 'performance' as const,
      },
    ];

    // Return random insights to simulate variety
    return mockInsights.sort(() => 0.5 - Math.random()).slice(0, 3);
  }

  async generateInsights(schoolData?: any): Promise<InsightData[]> {
    try {
      if (!this.model || !process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
        console.log('Using mock insights - Gemini AI not configured');
        return this.getMockInsights();
      }

      const prompt = `
        As Prof Lynx, an AI education consultant, analyze the following school data and provide 3 actionable insights:

        School Data: ${JSON.stringify(schoolData || {})}

        For each insight, provide:
        1. A descriptive title
        2. A detailed insight about current patterns or trends
        3. A specific, actionable recommendation
        4. Trend direction (up/down/stable)
        5. Impact level (high/medium/low)
        6. Category (academic/attendance/behavior/resources/performance)

        Return as JSON array matching this structure:
        [
          {
            "title": "string",
            "insight": "string", 
            "recommendation": "string",
            "trend": "up|down|stable",
            "impact": "high|medium|low",
            "category": "academic|attendance|behavior|resources|performance"
          }
        ]
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse JSON response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const insights = JSON.parse(jsonMatch[0]);
        return insights.length > 0 ? insights : this.getMockInsights();
      }

      return this.getMockInsights();
    } catch (error) {
      console.error('Error generating insights:', error);
      return this.getMockInsights();
    }
  }

  async getQuickRecommendation(metric: string, value: number): Promise<string> {
    try {
      if (!this.model || !process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
        const recommendations = {
          attendance:
            value > 90
              ? 'Excellent attendance! Consider recognizing consistent students.'
              : 'Focus on engagement strategies to improve attendance.',
          performance:
            value > 80
              ? 'Strong academic performance! Look for ways to challenge high achievers.'
              : 'Consider additional support programs for struggling students.',
          engagement:
            value > 75
              ? 'Good student engagement levels. Maintain current teaching methods.'
              : 'Implement more interactive learning activities.',
        };
        return (
          recommendations[metric as keyof typeof recommendations] ||
          'Monitor trends and adjust strategies accordingly.'
        );
      }

      const prompt = `As Prof Lynx, provide a brief recommendation for ${metric} with current value ${value}. Keep it under 100 characters and actionable.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error('Error generating recommendation:', error);
      return 'Continue monitoring this metric and consider implementing targeted improvements.';
    }
  }
}

export const profLynxAI = new ProfLynxAI();
