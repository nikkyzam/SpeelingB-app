import { useState, useEffect } from 'react';
import { useLocalStorage } from '../useLocalStorage';

interface ReadingProgress {
  bookId: string;
  page: number;
  lastRead: Date;
  completed: boolean;
  timeSpent: number; // in minutes
  vocabularyLearned: string[];
}

interface ReadingStats {
  totalBooksRead: number;
  totalTimeSpent: number;
  favoriteCategory: string;
  readingStreak: number;
  lastReadDate?: Date;
}

export const useReadingProgress = () => {
  const [progress, setProgress] = useLocalStorage<ReadingProgress[]>('reading-progress', []);
  const [stats, setStats] = useState<ReadingStats>({
    totalBooksRead: 0,
    totalTimeSpent: 0,
    favoriteCategory: 'bible-stories',
    readingStreak: 0
  });

  // Update stats when progress changes
  useEffect(() => {
    const completedBooks = progress.filter(p => p.completed);
    const totalTime = progress.reduce((sum, p) => sum + p.timeSpent, 0);

    // Calculate favorite category based on completed books
    const categoryCount: Record<string, number> = {};
    completedBooks.forEach(book => {
      // This would need access to book data to get categories
      // For now, we'll use a placeholder
      categoryCount['bible-stories'] = (categoryCount['bible-stories'] || 0) + 1;
    });

    const favoriteCategory = Object.entries(categoryCount)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || 'bible-stories';

    // Calculate reading streak (simplified)
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const lastReadDates = progress
      .map(p => new Date(p.lastRead))
      .filter(date => !isNaN(date.getTime()));

    let streak = 0;
    if (lastReadDates.length > 0) {
      // Sort dates descending
      lastReadDates.sort((a, b) => b.getTime() - a.getTime());
      const lastRead = lastReadDates[0];

      // Check if last read was today or yesterday
      const isToday = lastRead.toDateString() === today.toDateString();
      const isYesterday = lastRead.toDateString() === yesterday.toDateString();

      if (isToday) streak = 1;
      else if (isYesterday) streak = 1;
    }

    setStats({
      totalBooksRead: completedBooks.length,
      totalTimeSpent: totalTime,
      favoriteCategory,
      readingStreak: streak,
      lastReadDate: lastReadDates[0]
    });
  }, [progress]);

  const updateProgress = (bookId: string, page: number, timeSpentMinutes: number = 1) => {
    setProgress(prev => {
      const existingIndex = prev.findIndex(p => p.bookId === bookId);

      if (existingIndex >= 0) {
        // Update existing progress
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          page,
          lastRead: new Date(),
          timeSpent: updated[existingIndex].timeSpent + timeSpentMinutes,
          completed: page >= 10 // Assuming 10 pages means completed
        };
        return updated;
      } else {
        // Add new progress
        return [...prev, {
          bookId,
          page,
          lastRead: new Date(),
          timeSpent: timeSpentMinutes,
          completed: false,
          vocabularyLearned: []
        }];
      }
    });
  };

  const markVocabularyLearned = (bookId: string, word: string) => {
    setProgress(prev => {
      const existingIndex = prev.findIndex(p => p.bookId === bookId);

      if (existingIndex >= 0) {
        const updated = [...prev];
        const existingWords = updated[existingIndex].vocabularyLearned;

        if (!existingWords.includes(word)) {
          updated[existingIndex] = {
            ...updated[existingIndex],
            vocabularyLearned: [...existingWords, word]
          };
        }

        return updated;
      }

      return prev;
    });
  };

  const getBookProgress = (bookId: string): ReadingProgress | undefined => {
    return progress.find(p => p.bookId === bookId);
  };

  const resetProgress = (bookId?: string) => {
    if (bookId) {
      setProgress(prev => prev.filter(p => p.bookId !== bookId));
    } else {
      setProgress([]);
    }
  };

  return {
    progress,
    stats,
    updateProgress,
    markVocabularyLearned,
    getBookProgress,
    resetProgress
  };
};
