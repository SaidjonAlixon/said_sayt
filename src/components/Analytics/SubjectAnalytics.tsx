import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Target, BookOpen } from 'lucide-react';

interface SubjectPerformance {
  subject: string;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  accuracy: number;
  averageScore: number;
  improvement: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface SubjectAnalyticsProps {
  userId: string;
}

const SubjectAnalytics: React.FC<SubjectAnalyticsProps> = ({ userId }) => {
  const [subjectData, setSubjectData] = useState<SubjectPerformance[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'all'>('all');

  useEffect(() => {
    loadSubjectAnalytics();
  }, [userId, selectedTimeframe]);

  const loadSubjectAnalytics = () => {
    try {
      const results = JSON.parse(localStorage.getItem('testblok_test_results') || '[]');
      const userResults = results.filter((result: any) => result.userId === userId);

      if (userResults.length === 0) {
        setSubjectData([]);
        return;
      }

      // Aggregate data by subject
      const subjectStats: Record<string, any> = {};

      userResults.forEach((result: any) => {
        Object.entries(result.subjectScores).forEach(([subject, data]: [string, any]) => {
          if (!subjectStats[subject]) {
            subjectStats[subject] = {
              subject,
              totalQuestions: 0,
              correctAnswers: 0,
              wrongAnswers: 0,
              totalScore: 0,
              testCount: 0,
              scores: []
            };
          }

          subjectStats[subject].totalQuestions += data.total;
          subjectStats[subject].correctAnswers += data.correct;
          subjectStats[subject].wrongAnswers += (data.total - data.correct);
          subjectStats[subject].totalScore += data.score;
          subjectStats[subject].testCount += 1;
          subjectStats[subject].scores.push(data.score);
        });
      });

      // Calculate analytics
      const analytics = Object.values(subjectStats).map((stats: any) => {
        const accuracy = (stats.correctAnswers / stats.totalQuestions) * 100;
        const averageScore = stats.totalScore / stats.testCount;
        
        // Calculate improvement (simple trend based on first vs last scores)
        const improvement = stats.scores.length > 1 
          ? ((stats.scores[stats.scores.length - 1] - stats.scores[0]) / stats.scores[0]) * 100
          : 0;

        // Determine difficulty based on accuracy
        let difficulty: 'easy' | 'medium' | 'hard' = 'medium';
        if (accuracy >= 80) difficulty = 'easy';
        else if (accuracy < 60) difficulty = 'hard';

        return {
          subject: stats.subject,
          totalQuestions: stats.totalQuestions,
          correctAnswers: stats.correctAnswers,
          wrongAnswers: stats.wrongAnswers,
          accuracy,
          averageScore,
          improvement,
          difficulty
        };
      });

      setSubjectData(analytics);
    } catch (error) {
      console.error('Error loading subject analytics:', error);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-yellow-600 bg-yellow-100';
    }
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return 'text-green-600';
    if (accuracy >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Fanlar bo'yicha tahlil</h3>
          <p className="text-gray-600">Har bir fandagi kuchli va zaif tomonlaringiz</p>
        </div>
        
        <select
          value={selectedTimeframe}
          onChange={(e) => setSelectedTimeframe(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">Barcha vaqt</option>
          <option value="month">Bu oy</option>
          <option value="week">Bu hafta</option>
        </select>
      </div>

      {subjectData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjectData.map((subject) => (
            <div key={subject.subject} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                  <h4 className="font-bold text-gray-900">{subject.subject}</h4>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(subject.difficulty)}`}>
                  {subject.difficulty === 'easy' ? 'Oson' : 
                   subject.difficulty === 'hard' ? 'Qiyin' : 'O\'rtacha'}
                </span>
              </div>

              <div className="space-y-4">
                {/* Accuracy */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Aniqlik</span>
                    <span className={`font-bold ${getAccuracyColor(subject.accuracy)}`}>
                      {subject.accuracy.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        subject.accuracy >= 80 ? 'bg-green-500' :
                        subject.accuracy >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${subject.accuracy}%` }}
                    ></div>
                  </div>
                </div>

                {/* Average Score */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">O'rtacha ball</span>
                  <span className="font-bold text-blue-600">{subject.averageScore.toFixed(1)}</span>
                </div>

                {/* Questions Stats */}
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="text-lg font-bold text-green-600">{subject.correctAnswers}</div>
                    <div className="text-xs text-green-700">To'g'ri</div>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3">
                    <div className="text-lg font-bold text-red-600">{subject.wrongAnswers}</div>
                    <div className="text-xs text-red-700">Noto'g'ri</div>
                  </div>
                </div>

                {/* Improvement */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">O'sish</span>
                  <div className="flex items-center space-x-1">
                    {subject.improvement > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : subject.improvement < 0 ? (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    ) : (
                      <Target className="h-4 w-4 text-gray-400" />
                    )}
                    <span className={`font-medium ${
                      subject.improvement > 0 ? 'text-green-600' :
                      subject.improvement < 0 ? 'text-red-600' : 'text-gray-400'
                    }`}>
                      {subject.improvement > 0 ? '+' : ''}{subject.improvement.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h5 className="text-sm font-medium text-gray-700 mb-2">Tavsiya:</h5>
                <p className="text-xs text-gray-600">
                  {subject.accuracy < 60 
                    ? `${subject.subject} fanidan ko'proq mashq qiling. Nazariy bilimlarni mustahkamlang.`
                    : subject.accuracy < 80
                    ? `Yaxshi natija! ${subject.subject} fanida yanada mukammallikka intiling.`
                    : `A'lo! ${subject.subject} fanidagi bilimlaringizni saqlab qoling.`
                  }
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Tahlil ma'lumotlari yo'q
          </h3>
          <p className="text-gray-500">
            Fanlar bo'yicha tahlil ko'rish uchun birinchi testingizni ishlang
          </p>
        </div>
      )}
    </div>
  );
};

export default SubjectAnalytics;