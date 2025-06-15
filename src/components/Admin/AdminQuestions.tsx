import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Edit, Trash2, Save, X, Upload, Link, Eye, Image } from 'lucide-react';

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

interface Direction {
  id: string;
  name: string;
  subjects: Subject[];
}

interface Subject {
  id: string;
  name: string;
  type: 'main' | 'mandatory';
  questionCount: number;
  pointsPerQuestion: number;
  questions: Question[];
}

const AdminQuestions: React.FC = () => {
  const [directions, setDirections] = useState<Direction[]>([]);
  const [selectedDirection, setSelectedDirection] = useState<Direction | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    text: '',
    options: { A: '', B: '', C: '', D: '' },
    optionImages: { A: '', B: '', C: '', D: '' },
    correctAnswer: 'A',
    imageUrl: ''
  });

  useEffect(() => {
    loadDirections();
  }, []);

  useEffect(() => {
    if (selectedDirection && selectedSubject) {
      loadQuestions();
    }
  }, [selectedDirection, selectedSubject]);

  const loadDirections = () => {
    try {
      const stored = localStorage.getItem('testblok_directions');
      const allDirections = stored ? JSON.parse(stored) : [];
      setDirections(allDirections);
    } catch (error) {
      console.error('Error loading directions:', error);
    }
  };

  const loadQuestions = () => {
    if (!selectedDirection || !selectedSubject) return;
    
    const subject = selectedDirection.subjects.find(s => s.id === selectedSubject.id);
    if (subject && subject.questions) {
      setQuestions(subject.questions);
    } else {
      setQuestions([]);
    }
  };

  const saveQuestions = (updatedQuestions: Question[]) => {
    if (!selectedDirection || !selectedSubject) return;

    const updatedDirections = directions.map(direction => {
      if (direction.id === selectedDirection.id) {
        const updatedSubjects = direction.subjects.map(subject => {
          if (subject.id === selectedSubject.id) {
            return { ...subject, questions: updatedQuestions };
          }
          return subject;
        });
        return { ...direction, subjects: updatedSubjects };
      }
      return direction;
    });

    localStorage.setItem('testblok_directions', JSON.stringify(updatedDirections));
    setDirections(updatedDirections);
    setQuestions(updatedQuestions);
    
    // Update selected direction
    const updatedDirection = updatedDirections.find(d => d.id === selectedDirection.id);
    if (updatedDirection) {
      setSelectedDirection(updatedDirection);
      const updatedSubject = updatedDirection.subjects.find(s => s.id === selectedSubject.id);
      if (updatedSubject) {
        setSelectedSubject(updatedSubject);
      }
    }
  };

  const handleImageFileUpload = (file: File, type: 'question' | 'option', optionKey?: string) => {
    // Convert file to base64 for storage
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String = e.target?.result as string;
      
      if (type === 'question') {
        if (editingQuestion) {
          setEditingQuestion({ ...editingQuestion, imageUrl: base64String });
        } else {
          setNewQuestion({ ...newQuestion, imageUrl: base64String });
        }
      } else if (type === 'option' && optionKey) {
        if (editingQuestion) {
          setEditingQuestion({ 
            ...editingQuestion, 
            optionImages: { 
              ...editingQuestion.optionImages, 
              [optionKey]: base64String 
            } 
          });
        } else {
          setNewQuestion({ 
            ...newQuestion, 
            optionImages: { 
              ...newQuestion.optionImages, 
              [optionKey]: base64String 
            } 
          });
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const addQuestion = () => {
    if (!selectedSubject || !newQuestion.text || !newQuestion.options?.A) {
      alert('Savol matni va kamida bitta variant kiritilishi kerak');
      return;
    }

    const question: Question = {
      id: `question-${Date.now()}`,
      text: newQuestion.text,
      options: newQuestion.options as any,
      optionImages: newQuestion.optionImages || {},
      correctAnswer: newQuestion.correctAnswer as any,
      subject: selectedSubject.name,
      points: selectedSubject.pointsPerQuestion,
      imageUrl: newQuestion.imageUrl || undefined
    };

    const updatedQuestions = [...questions, question];
    saveQuestions(updatedQuestions);
    
    // Reset form
    setNewQuestion({
      text: '',
      options: { A: '', B: '', C: '', D: '' },
      optionImages: { A: '', B: '', C: '', D: '' },
      correctAnswer: 'A',
      imageUrl: ''
    });
    setShowAddQuestion(false);
  };

  const updateQuestion = () => {
    if (!editingQuestion) return;

    const updatedQuestions = questions.map(q => 
      q.id === editingQuestion.id ? editingQuestion : q
    );
    saveQuestions(updatedQuestions);
    setEditingQuestion(null);
  };

  const deleteQuestion = (questionId: string) => {
    if (confirm('Bu savolni o\'chirmoqchimisiz?')) {
      const updatedQuestions = questions.filter(q => q.id !== questionId);
      saveQuestions(updatedQuestions);
    }
  };

  const resetForm = () => {
    setNewQuestion({
      text: '',
      options: { A: '', B: '', C: '', D: '' },
      optionImages: { A: '', B: '', C: '', D: '' },
      correctAnswer: 'A',
      imageUrl: ''
    });
    setShowAddQuestion(false);
    setEditingQuestion(null);
  };

  const removeImage = (type: 'question' | 'option', optionKey?: string) => {
    if (type === 'question') {
      if (editingQuestion) {
        setEditingQuestion({ ...editingQuestion, imageUrl: undefined });
      } else {
        setNewQuestion({ ...newQuestion, imageUrl: '' });
      }
    } else if (type === 'option' && optionKey) {
      if (editingQuestion) {
        setEditingQuestion({ 
          ...editingQuestion, 
          optionImages: { 
            ...editingQuestion.optionImages, 
            [optionKey]: '' 
          } 
        });
      } else {
        setNewQuestion({ 
          ...newQuestion, 
          optionImages: { 
            ...newQuestion.optionImages, 
            [optionKey]: '' 
          } 
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Savollar boshqaruvi</h2>
        <p className="text-gray-600">Yo'nalishlar va fanlar bo'yicha savollarni boshqaring</p>
      </div>

      {/* Direction and Subject Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Yo'nalishni tanlang
          </label>
          <select
            value={selectedDirection?.id || ''}
            onChange={(e) => {
              const direction = directions.find(d => d.id === e.target.value);
              setSelectedDirection(direction || null);
              setSelectedSubject(null);
              setQuestions([]);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Yo'nalish tanlang</option>
            {directions.filter(d => d.isActive).map(direction => (
              <option key={direction.id} value={direction.id}>
                {direction.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fanni tanlang
          </label>
          <select
            value={selectedSubject?.id || ''}
            onChange={(e) => {
              const subject = selectedDirection?.subjects.find(s => s.id === e.target.value);
              setSelectedSubject(subject || null);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={!selectedDirection}
          >
            <option value="">Fan tanlang</option>
            {selectedDirection?.subjects.map(subject => (
              <option key={subject.id} value={subject.id}>
                {subject.name} ({subject.type === 'main' ? 'Asosiy' : 'Majburiy'}) - {subject.pointsPerQuestion} ball
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Subject Info */}
      {selectedSubject && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-blue-900">{selectedSubject.name}</h3>
              <p className="text-blue-700">
                {selectedSubject.type === 'main' ? 'Asosiy fan' : 'Majburiy fan'} - 
                {selectedSubject.pointsPerQuestion} ball har bir to'g'ri javob uchun
              </p>
              <p className="text-blue-600">
                Jami savollar: {questions.length}/{selectedSubject.questionCount}
              </p>
            </div>
            <button
              onClick={() => setShowAddQuestion(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Savol qo'shish</span>
            </button>
          </div>
        </div>
      )}

      {/* Add/Edit Question Modal */}
      {(showAddQuestion || editingQuestion) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">
                  {editingQuestion ? 'Savolni tahrirlash' : 'Yangi savol qo\'shish'}
                </h3>
                <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Question Text */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Savol matni *
                  </label>
                  <textarea
                    value={editingQuestion ? editingQuestion.text : newQuestion.text}
                    onChange={(e) => {
                      if (editingQuestion) {
                        setEditingQuestion({ ...editingQuestion, text: e.target.value });
                      } else {
                        setNewQuestion({ ...newQuestion, text: e.target.value });
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="Savol matnini kiriting"
                    required
                  />
                </div>

                {/* Question Image Upload Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Savol uchun rasm (ixtiyoriy)
                  </label>
                  
                  {/* Current Image Display */}
                  {((editingQuestion && editingQuestion.imageUrl) || newQuestion.imageUrl) && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Joriy rasm:</span>
                        <button
                          onClick={() => removeImage('question')}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          O'chirish
                        </button>
                      </div>
                      <img
                        src={editingQuestion ? editingQuestion.imageUrl : newQuestion.imageUrl}
                        alt="Savol rasmi"
                        className="max-w-full h-auto max-h-48 rounded-lg border border-gray-200"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}

                  {/* Image Upload Options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* URL Input */}
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Rasm URL manzili:</label>
                      <input
                        type="url"
                        value={editingQuestion ? editingQuestion.imageUrl || '' : newQuestion.imageUrl || ''}
                        onChange={(e) => {
                          if (editingQuestion) {
                            setEditingQuestion({ ...editingQuestion, imageUrl: e.target.value });
                          } else {
                            setNewQuestion({ ...newQuestion, imageUrl: e.target.value });
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>

                    {/* File Upload */}
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Yoki fayl yuklang:</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 hover:border-blue-400 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (file.size > 5 * 1024 * 1024) {
                                alert('Fayl hajmi 5MB dan oshmasligi kerak');
                                return;
                              }
                              handleImageFileUpload(file, 'question');
                            }
                          }}
                          className="hidden"
                          id="question-image-upload"
                        />
                        <label
                          htmlFor="question-image-upload"
                          className="flex flex-col items-center justify-center cursor-pointer"
                        >
                          <Upload className="h-5 w-5 text-gray-400 mb-1" />
                          <span className="text-xs text-gray-600 text-center">
                            Rasm yuklash
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Options */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Javob variantlari *
                  </label>
                  <div className="space-y-4">
                    {['A', 'B', 'C', 'D'].map((option) => (
                      <div key={option} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-700">
                            {option}
                          </span>
                          <input
                            type="text"
                            value={editingQuestion 
                              ? editingQuestion.options[option as keyof typeof editingQuestion.options] 
                              : newQuestion.options?.[option as keyof typeof newQuestion.options] || ''
                            }
                            onChange={(e) => {
                              if (editingQuestion) {
                                setEditingQuestion({
                                  ...editingQuestion,
                                  options: { ...editingQuestion.options, [option]: e.target.value }
                                });
                              } else {
                                setNewQuestion({
                                  ...newQuestion,
                                  options: { ...newQuestion.options, [option]: e.target.value }
                                });
                              }
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder={`${option} variantini kiriting`}
                            required={option === 'A'}
                          />
                        </div>

                        {/* Option Image */}
                        <div className="ml-11">
                          <label className="block text-xs text-gray-600 mb-2">
                            {option} variant uchun rasm (ixtiyoriy):
                          </label>

                          {/* Current Option Image */}
                          {((editingQuestion?.optionImages?.[option as keyof typeof editingQuestion.optionImages]) || 
                            (newQuestion.optionImages?.[option as keyof typeof newQuestion.optionImages])) && (
                            <div className="mb-3 p-2 bg-gray-50 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-gray-600">Joriy rasm:</span>
                                <button
                                  onClick={() => removeImage('option', option)}
                                  className="text-red-600 hover:text-red-800 text-xs"
                                >
                                  O'chirish
                                </button>
                              </div>
                              <img
                                src={editingQuestion?.optionImages?.[option as keyof typeof editingQuestion.optionImages] || 
                                     newQuestion.optionImages?.[option as keyof typeof newQuestion.optionImages]}
                                alt={`${option} variant rasmi`}
                                className="max-w-full h-auto max-h-32 rounded border border-gray-200"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            </div>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {/* URL Input for Option */}
                            <input
                              type="url"
                              value={editingQuestion?.optionImages?.[option as keyof typeof editingQuestion.optionImages] || 
                                     newQuestion.optionImages?.[option as keyof typeof newQuestion.optionImages] || ''}
                              onChange={(e) => {
                                if (editingQuestion) {
                                  setEditingQuestion({
                                    ...editingQuestion,
                                    optionImages: { ...editingQuestion.optionImages, [option]: e.target.value }
                                  });
                                } else {
                                  setNewQuestion({
                                    ...newQuestion,
                                    optionImages: { ...newQuestion.optionImages, [option]: e.target.value }
                                  });
                                }
                              }}
                              className="px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Rasm URL"
                            />

                            {/* File Upload for Option */}
                            <div className="border border-dashed border-gray-300 rounded p-2 hover:border-blue-400 transition-colors">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    if (file.size > 5 * 1024 * 1024) {
                                      alert('Fayl hajmi 5MB dan oshmasligi kerak');
                                      return;
                                    }
                                    handleImageFileUpload(file, 'option', option);
                                  }
                                }}
                                className="hidden"
                                id={`option-${option}-image-upload`}
                              />
                              <label
                                htmlFor={`option-${option}-image-upload`}
                                className="flex items-center justify-center cursor-pointer"
                              >
                                <Upload className="h-3 w-3 text-gray-400 mr-1" />
                                <span className="text-xs text-gray-600">Fayl</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Correct Answer */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To'g'ri javob *
                  </label>
                  <select
                    value={editingQuestion ? editingQuestion.correctAnswer : newQuestion.correctAnswer}
                    onChange={(e) => {
                      if (editingQuestion) {
                        setEditingQuestion({ ...editingQuestion, correctAnswer: e.target.value as any });
                      } else {
                        setNewQuestion({ ...newQuestion, correctAnswer: e.target.value as any });
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={editingQuestion ? updateQuestion : addQuestion}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>{editingQuestion ? 'Saqlash' : 'Qo\'shish'}</span>
                  </button>
                  <button
                    onClick={resetForm}
                    className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-400 transition-colors"
                  >
                    Bekor qilish
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Questions List */}
      {selectedSubject && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {selectedSubject.name} fani savollari ({questions.length})
            </h3>

            {questions.length > 0 ? (
              <div className="space-y-4">
                {questions.map((question, index) => (
                  <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-2">
                          {index + 1}. {question.text}
                        </h4>
                        
                        {question.imageUrl && (
                          <div className="mb-3 p-2 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                              <Image className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-600">Savol rasmi:</span>
                            </div>
                            <img
                              src={question.imageUrl}
                              alt="Savol rasmi"
                              className="max-w-full h-auto max-h-48 rounded-lg border border-gray-200"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                          {Object.entries(question.options).map(([key, value]) => (
                            <div
                              key={key}
                              className={`flex flex-col space-y-2 p-2 rounded ${
                                question.correctAnswer === key
                                  ? 'bg-green-50 border border-green-200'
                                  : 'bg-gray-50'
                              }`}
                            >
                              <div className="flex items-center space-x-2">
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                                  question.correctAnswer === key
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-300 text-gray-700'
                                }`}>
                                  {key}
                                </span>
                                <span className="text-sm">{value}</span>
                              </div>
                              
                              {/* Option Image */}
                              {question.optionImages?.[key as keyof typeof question.optionImages] && (
                                <div className="ml-8">
                                  <img
                                    src={question.optionImages[key as keyof typeof question.optionImages]}
                                    alt={`${key} variant rasmi`}
                                    className="max-w-full h-auto max-h-24 rounded border border-gray-200"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        
                        <div className="text-sm text-gray-500">
                          To'g'ri javob: <span className="font-bold text-green-600">{question.correctAnswer}</span> | 
                          Ball: <span className="font-bold">{question.points}</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => setEditingQuestion(question)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteQuestion(question.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Bu fan uchun hali savollar qo'shilmagan</p>
                <button
                  onClick={() => setShowAddQuestion(true)}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Birinchi savolni qo'shish
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {!selectedDirection && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Yo'nalish tanlang
          </h3>
          <p className="text-gray-500">
            Savollar bilan ishlash uchun avval yo'nalish va fanni tanlang
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminQuestions;