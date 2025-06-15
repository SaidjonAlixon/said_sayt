import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Clock, 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  Flag,
  AlertTriangle,
  CheckCircle,
  X,
  Eye,
  EyeOff,
  Image
} from 'lucide-react';

interface Question {
  id: string;
  text: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  optionImages?: {
    A?: string;
    B?: string;
    C?: string;
    D?: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  subject: string;
  points: number;
  imageUrl?: string;
}

interface TestInterfaceProps {
  direction: any;
  onTestComplete: (results: any) => void;
  onTestExit: () => void;
}

const TestInterface: React.FC<TestInterfaceProps> = ({ direction, onTestComplete, onTestExit }) => {
  const { user } = useAuth();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});
  const [timeLeft, setTimeLeft] = useState(3 * 60 * 60); // 3 hours in seconds
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [cheatingFlags, setCheatingFlags] = useState<any[]>([]);
  const [isWindowFocused, setIsWindowFocused] = useState(true);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);

  // Get questions from direction or use mock data
  const getQuestionsFromDirection = () => {
    if (direction.subjects && direction.subjects.length > 0) {
      const allQuestions: Question[] = [];
      direction.subjects.forEach((subject: any) => {
        if (subject.questions && subject.questions.length > 0) {
          subject.questions.forEach((question: any) => {
            allQuestions.push({
              ...question,
              subject: subject.name
            });
          });
        }
      });
      return allQuestions;
    }
    
    // Fallback to mock questions if no real questions exist
    return getMockQuestions();
  };

  // Mock questions for testing
  const getMockQuestions = (): Question[] => {
    const mockQuestions: Record<string, Question[]> = {
      'Matematika': [
        {
          id: 'math-1',
          text: '2x + 5 = 13 tenglamaning yechimi qanday?',
          options: { A: 'x = 4', B: 'x = 6', C: 'x = 8', D: 'x = 9' },
          correctAnswer: 'A',
          subject: 'Matematika',
          points: 3.1
        },
        {
          id: 'math-2',
          text: 'Agar a = 3, b = 4 bo\'lsa, a² + b² ning qiymati nechaga teng?',
          options: { A: '7', B: '12', C: '25', D: '49' },
          correctAnswer: 'C',
          subject: 'Matematika',
          points: 3.1
        },
        {
          id: 'math-3',
          text: 'Sin 30° ning qiymati nechaga teng?',
          options: { A: '1/2', B: '√3/2', C: '√2/2', D: '1' },
          correctAnswer: 'A',
          subject: 'Matematika',
          points: 3.1
        }
      ],
      'Fizika': [
        {
          id: 'phys-1',
          text: 'Yorug\'lik tezligi vakuumda qancha?',
          options: { A: '3×10⁸ m/s', B: '3×10⁶ m/s', C: '3×10⁷ m/s', D: '3×10⁹ m/s' },
          correctAnswer: 'A',
          subject: 'Fizika',
          points: 2.1
        },
        {
          id: 'phys-2',
          text: 'Nyutonning birinchi qonuni nima haqida?',
          options: { A: 'Kuch', B: 'Inersiya', C: 'Tezlanish', D: 'Energiya' },
          correctAnswer: 'B',
          subject: 'Fizika',
          points: 2.1
        }
      ],
      'Biologiya': [
        {
          id: 'bio-1',
          text: 'Hujayra yadrosi qaysi organoidda joylashgan?',
          options: { A: 'Sitoplazma', B: 'Mitoxondriya', C: 'Yadro', D: 'Ribosoma' },
          correctAnswer: 'C',
          subject: 'Biologiya',
          points: 3.1
        },
        {
          id: 'bio-2',
          text: 'Fotosintez jarayoni qayerda sodir bo\'ladi?',
          options: { A: 'Ildiz', B: 'Poya', C: 'Barg', D: 'Gul' },
          correctAnswer: 'C',
          subject: 'Biologiya',
          points: 3.1
        }
      ],
      'Kimyo': [
        {
          id: 'chem-1',
          text: 'Suvning kimyoviy formulasi qanday?',
          options: { A: 'H₂O', B: 'CO₂', C: 'NaCl', D: 'O₂' },
          correctAnswer: 'A',
          subject: 'Kimyo',
          points: 2.1
        },
        {
          id: 'chem-2',
          text: 'Kislorodning atom raqami nechaga teng?',
          options: { A: '6', B: '7', C: '8', D: '9' },
          correctAnswer: 'C',
          subject: 'Kimyo',
          points: 2.1
        }
      ],
      'Tarix': [
        {
          id: 'hist-1',
          text: 'O\'zbekiston mustaqillik e\'lon qilgan sana?',
          options: { A: '1990-yil', B: '1991-yil', C: '1992-yil', D: '1993-yil' },
          correctAnswer: 'B',
          subject: 'Tarix',
          points: 1.1
        }
      ],
      'Ona tili': [
        {
          id: 'lang-1',
          text: 'O\'zbek tilida nechta unli tovush bor?',
          options: { A: '5', B: '6', C: '7', D: '8' },
          correctAnswer: 'B',
          subject: 'Ona tili',
          points: 1.1
        }
      ],
      'Ingliz tili': [
        {
          id: 'eng-1',
          text: 'What is the capital of Uzbekistan?',
          options: { A: 'Samarkand', B: 'Bukhara', C: 'Tashkent', D: 'Khiva' },
          correctAnswer: 'C',
          subject: 'Ingliz tili',
          points: 1.1
        }
      ]
    };

    // Get subjects based on direction
    const getSubjects = () => {
      if (direction.name === 'Texnika yo\'nalishi') {
        return ['Matematika', 'Fizika', 'Tarix', 'Ona tili', 'Ingliz tili'];
      } else if (direction.name === 'Tibbiyot yo\'nalishi') {
        return ['Biologiya', 'Kimyo', 'Tarix', 'Ona tili', 'Ingliz tili'];
      }
      return Object.keys(mockQuestions);
    };

    const subjects = getSubjects();
    const allQuestions: Question[] = [];
    
    subjects.forEach(subject => {
      const subjectQuestions = mockQuestions[subject] || [];
      allQuestions.push(...subjectQuestions);
    });

    return allQuestions;
  };

  const allQuestions = getQuestionsFromDirection();
  const currentQuestion = allQuestions[currentQuestionIndex];

  // Cheating detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsWindowFocused(false);
        setTabSwitchCount(prev => prev + 1);
        
        const flag = {
          type: 'tab_switch',
          timestamp: new Date().toISOString(),
          count: tabSwitchCount + 1
        };
        
        setCheatingFlags(prev => [...prev, flag]);
        
        if (tabSwitchCount >= 2) {
          alert('Ogohlantirish: Siz test paytida boshqa oynaga o\'tdingiz. Bu qoidabuzarlik hisoblanadi!');
        }
      } else {
        setIsWindowFocused(true);
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      const flag = {
        type: 'right_click',
        timestamp: new Date().toISOString(),
        count: 1
      };
      setCheatingFlags(prev => [...prev, flag]);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable F12, Ctrl+Shift+I, Ctrl+U, etc.
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.key === 'u') ||
        (e.ctrlKey && e.shiftKey && e.key === 'C')
      ) {
        e.preventDefault();
        const flag = {
          type: 'dev_tools_attempt',
          timestamp: new Date().toISOString(),
          count: 1
        };
        setCheatingFlags(prev => [...prev, flag]);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [tabSwitchCount]);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTestComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format time
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answer: 'A' | 'B' | 'C' | 'D') => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < allQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleTestComplete = () => {
    // Calculate results
    let totalScore = 0;
    let correctAnswers = 0;
    const subjectScores: Record<string, { score: number; correct: number; total: number }> = {};

    // Initialize subject scores
    const subjects = [...new Set(allQuestions.map(q => q.subject))];
    subjects.forEach(subject => {
      subjectScores[subject] = { score: 0, correct: 0, total: 0 };
    });

    allQuestions.forEach(question => {
      const userAnswer = answers[question.id];
      const isCorrect = userAnswer === question.correctAnswer;
      
      if (!subjectScores[question.subject]) {
        subjectScores[question.subject] = { score: 0, correct: 0, total: 0 };
      }
      
      subjectScores[question.subject].total++;
      
      if (isCorrect) {
        totalScore += question.points;
        correctAnswers++;
        subjectScores[question.subject].score += question.points;
        subjectScores[question.subject].correct++;
      }
    });

    const results = {
      totalScore,
      correctAnswers,
      totalQuestions: allQuestions.length,
      subjectScores,
      answers,
      direction: direction.name,
      completedAt: new Date().toISOString(),
      cheatingFlags,
      timeSpent: (3 * 60 * 60) - timeLeft
    };

    onTestComplete(results);
  };

  const getQuestionsBySubject = () => {
    const questionsBySubject: Record<string, number[]> = {};
    allQuestions.forEach((question, index) => {
      if (!questionsBySubject[question.subject]) {
        questionsBySubject[question.subject] = [];
      }
      questionsBySubject[question.subject].push(index);
    });
    return questionsBySubject;
  };

  const questionsBySubject = getQuestionsBySubject();

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Test mavjud emas</h2>
          <p className="text-gray-600 mb-4">Ushbu yo'nalish uchun savollar hali qo'shilmagan</p>
          <button
            onClick={onTestExit}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Orqaga qaytish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-lg font-bold text-gray-900">{direction.name}</h1>
                <p className="text-sm text-gray-600">
                  {currentQuestion.subject} - Savol {currentQuestionIndex + 1}/{allQuestions.length}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              {/* Window focus indicator */}
              {!isWindowFocused && (
                <div className="flex items-center space-x-2 bg-red-50 px-3 py-1 rounded-lg">
                  <EyeOff className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-red-600">Oyna faol emas</span>
                </div>
              )}

              {/* Tab switch warning */}
              {tabSwitchCount > 0 && (
                <div className="flex items-center space-x-2 bg-yellow-50 px-3 py-1 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm text-yellow-600">Ogohlantirish: {tabSwitchCount}</span>
                </div>
              )}

              {/* Timer */}
              <div className="flex items-center space-x-2 bg-red-50 px-4 py-2 rounded-lg">
                <Clock className="h-5 w-5 text-red-600" />
                <span className="font-mono text-lg font-bold text-red-600">
                  {formatTime(timeLeft)}
                </span>
              </div>

              {/* Exit button */}
              <button
                onClick={() => setShowExitConfirm(true)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Testni tugatish
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Question Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Savollar</h3>
              
              {Object.keys(questionsBySubject).map(subject => {
                const subjectQuestions = questionsBySubject[subject] || [];
                return (
                  <div key={subject} className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">{subject}</h4>
                    <div className="grid grid-cols-5 gap-1">
                      {subjectQuestions.map(questionIndex => (
                        <button
                          key={questionIndex}
                          onClick={() => setCurrentQuestionIndex(questionIndex)}
                          className={`w-8 h-8 text-xs font-medium rounded ${
                            questionIndex === currentQuestionIndex
                              ? 'bg-blue-600 text-white'
                              : answers[allQuestions[questionIndex].id]
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {questionIndex + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}

              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Javob berilgan:</span>
                  <span className="font-medium text-green-600">
                    {Object.keys(answers).length}/{allQuestions.length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Question Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
              {/* Subject indicator */}
              <div className="flex items-center justify-between mb-6">
                <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium">
                  {currentQuestion.subject}
                </span>
                <span className="text-sm text-gray-500">
                  {currentQuestion.points} ball
                </span>
              </div>

              {/* Question */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6 leading-relaxed">
                  {currentQuestionIndex + 1}. {currentQuestion.text}
                </h2>

                {/* Question Image */}
                {currentQuestion.imageUrl && (
                  <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-3">
                      <Image className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Savol rasmi:</span>
                    </div>
                    <img 
                      src={currentQuestion.imageUrl} 
                      alt="Savol rasmi" 
                      className="max-w-full h-auto rounded-lg border border-gray-200"
                      onError={(e) => {
                        console.error('Image display error in test');
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                {/* Options */}
                <div className="space-y-4">
                  {Object.entries(currentQuestion.options).map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => handleAnswerSelect(key as 'A' | 'B' | 'C' | 'D')}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        answers[currentQuestion.id] === key
                          ? 'border-blue-500 bg-blue-50 text-blue-900'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          answers[currentQuestion.id] === key
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {key}
                        </span>
                        <div className="flex-1">
                          <span className="text-gray-900 block mb-2">{value}</span>
                          
                          {/* Option Image */}
                          {currentQuestion.optionImages?.[key as keyof typeof currentQuestion.optionImages] && (
                            <div className="mt-2">
                              <img
                                src={currentQuestion.optionImages[key as keyof typeof currentQuestion.optionImages]}
                                alt={`${key} variant rasmi`}
                                className="max-w-full h-auto max-h-32 rounded border border-gray-200"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <button
                  onClick={handlePrevQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="flex items-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                  <span>Oldingi</span>
                </button>

                {currentQuestionIndex === allQuestions.length - 1 ? (
                  <button
                    onClick={handleTestComplete}
                    className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Flag className="h-5 w-5" />
                    <span>Testni yakunlash</span>
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <span>Keyingi</span>
                    <ChevronRight className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <h3 className="text-lg font-bold text-gray-900">Testni tugatish</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Rostdan ham testni tugatmoqchimisiz? Barcha javoblaringiz saqlanadi va natija ko'rsatiladi.
            </p>
            
            {cheatingFlags.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-yellow-800">
                  <strong>Ogohlantirish:</strong> Test davomida {cheatingFlags.length} ta qoidabuzarlik aniqlandi.
                </p>
              </div>
            )}
            
            <div className="flex space-x-3">
              <button
                onClick={handleTestComplete}
                className="flex-1 bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Ha, tugatish
              </button>
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-400 transition-colors"
              >
                Bekor qilish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestInterface;