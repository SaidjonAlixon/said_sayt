import React from 'react';
import { 
  Trophy, 
  BookOpen, 
  CheckCircle, 
  XCircle, 
  BarChart3,
  Home,
  RotateCcw
} from 'lucide-react';

interface TestResultsProps {
  results: any;
  onBackToDashboard: () => void;
  onRetakeTest?: () => void;
}

const TestResults: React.FC<TestResultsProps> = ({ results, onBackToDashboard, onRetakeTest }) => {
  const { totalScore, correctAnswers, totalQuestions, subjectScores, direction } = results;
  
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);
  const maxPossibleScore = Object.values(subjectScores).reduce((sum: number, subject: any) => {
    return sum + (subject.total * getSubjectPointsPerQuestion(Object.keys(subjectScores).indexOf(Object.keys(subjectScores).find(key => subjectScores[key] === subject) || '')));
  }, 0);

  function getSubjectPointsPerQuestion(subjectIndex: number) {
    // Main subjects get higher points
    if (subjectIndex < 2) return subjectIndex === 0 ? 3.1 : 2.1;
    // Mandatory subjects get lower points
    return 1.1;
  }

  const getGradeColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGradeText = (percentage: number) => {
    if (percentage >= 80) return 'A\'lo';
    if (percentage >= 60) return 'Yaxshi';
    if (percentage >= 40) return 'Qoniqarli';
    return 'Qoniqarsiz';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Test yakunlandi!</h1>
            <p className="text-gray-600 text-lg">{direction}</p>
          </div>
        </div>

        {/* Overall Results */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {totalScore.toFixed(1)}
            </div>
            <div className="text-sm text-gray-500 mb-1">Jami ball</div>
            <div className="text-xs text-gray-400">
              {maxPossibleScore.toFixed(1)} dan
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 text-center">
            <div className={`text-3xl font-bold mb-2 ${getGradeColor(percentage)}`}>
              {percentage}%
            </div>
            <div className="text-sm text-gray-500 mb-1">To'g'ri javoblar</div>
            <div className="text-xs text-gray-400">
              {correctAnswers}/{totalQuestions}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 text-center">
            <div className={`text-2xl font-bold mb-2 ${getGradeColor(percentage)}`}>
              {getGradeText(percentage)}
            </div>
            <div className="text-sm text-gray-500">Baho</div>
          </div>
        </div>

        {/* Subject Results */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <BarChart3 className="h-6 w-6 mr-2" />
            Fanlar bo'yicha natijalar
          </h2>

          <div className="space-y-4">
            {Object.entries(subjectScores).map(([subject, data]: [string, any]) => {
              const subjectPercentage = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
              
              return (
                <div key={subject} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-gray-900">{subject}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">
                        {data.score.toFixed(1)} ball
                      </div>
                      <div className="text-sm text-gray-500">
                        {data.correct}/{data.total} to'g'ri
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div 
                      className={`h-3 rounded-full transition-all duration-500 ${
                        subjectPercentage >= 80 ? 'bg-green-500' :
                        subjectPercentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${subjectPercentage}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{subjectPercentage}% to'g'ri</span>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span>{data.correct}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-red-600">
                        <XCircle className="h-4 w-4" />
                        <span>{data.total - data.correct}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Performance Analysis */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Tahlil va tavsiyalar</h2>
          
          <div className="space-y-4">
            {percentage >= 80 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-green-800 mb-1">A'lo natija!</h3>
                    <p className="text-green-700 text-sm">
                      Siz juda yaxshi natija ko'rsatdingiz. Barcha fanlardan yaxshi bilim namoyish etdingiz.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {percentage >= 60 && percentage < 80 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Trophy className="h-6 w-6 text-yellow-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-yellow-800 mb-1">Yaxshi natija!</h3>
                    <p className="text-yellow-700 text-sm">
                      Yaxshi natija, lekin ba'zi fanlarda ko'proq mashq qilish kerak.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {percentage < 60 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <XCircle className="h-6 w-6 text-red-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-red-800 mb-1">Ko'proq mashq kerak</h3>
                    <p className="text-red-700 text-sm">
                      Natijani yaxshilash uchun barcha fanlardan ko'proq o'qish va mashq qilish tavsiya etiladi.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Subject-specific recommendations */}
            {Object.entries(subjectScores).map(([subject, data]: [string, any]) => {
              const subjectPercentage = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
              if (subjectPercentage < 50) {
                return (
                  <div key={subject} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <BookOpen className="h-6 w-6 text-blue-600 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-blue-800 mb-1">{subject} faniga e'tibor bering</h3>
                        <p className="text-blue-700 text-sm">
                          Bu fandan {subjectPercentage}% natija. Ko'proq mashq qilish va nazariy bilimlarni mustahkamlash tavsiya etiladi.
                        </p>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onBackToDashboard}
            className="flex items-center justify-center space-x-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Home className="h-5 w-5" />
            <span>Bosh sahifaga qaytish</span>
          </button>

          {onRetakeTest && (
            <button
              onClick={onRetakeTest}
              className="flex items-center justify-center space-x-2 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              <RotateCcw className="h-5 w-5" />
              <span>Qayta test ishlash</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestResults;