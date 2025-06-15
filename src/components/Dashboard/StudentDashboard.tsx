import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import TestInterface from '../Test/TestInterface';
import TestResults from '../Test/TestResults';
import EditProfile from '../Profile/EditProfile';
import UserRanking from '../Ranking/UserRanking';
import SubjectAnalytics from '../Analytics/SubjectAnalytics';
import { 
  BookOpen, 
  Clock, 
  Trophy, 
  CreditCard, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  Calendar,
  Star,
  ExternalLink,
  Check,
  Play,
  Lock,
  Edit,
  Bell,
  MessageSquare,
  HelpCircle,
  Award,
  Target,
  BarChart3,
  Users,
  Medal,
  Crown
} from 'lucide-react';

// Helper functions for localStorage
const getStoredPayments = () => {
  try {
    const payments = localStorage.getItem('testblok_payments');
    return payments ? JSON.parse(payments) : [];
  } catch {
    return [];
  }
};

const savePayments = (payments: any[]) => {
  localStorage.setItem('testblok_payments', JSON.stringify(payments));
};

const getStoredResults = () => {
  try {
    const results = localStorage.getItem('testblok_test_results');
    return results ? JSON.parse(results) : [];
  } catch {
    return [];
  }
};

const saveResults = (results: any[]) => {
  localStorage.setItem('testblok_test_results', JSON.stringify(results));
};

const getStoredDirections = () => {
  try {
    const directions = localStorage.getItem('testblok_directions');
    return directions ? JSON.parse(directions) : [];
  } catch {
    return [];
  }
};

const getStoredNotifications = () => {
  try {
    const notifications = localStorage.getItem('testblok_notifications');
    return notifications ? JSON.parse(notifications) : [];
  } catch {
    return [];
  }
};

const getStoredUsers = () => {
  try {
    const users = localStorage.getItem('testblok_users');
    return users ? JSON.parse(users) : [];
  } catch {
    return [];
  }
};

const saveUsers = (users: any[]) => {
  localStorage.setItem('testblok_users', JSON.stringify(users));
};

const getStoredTickets = () => {
  try {
    const tickets = localStorage.getItem('testblok_support_tickets');
    return tickets ? JSON.parse(tickets) : [];
  } catch {
    return [];
  }
};

const saveTickets = (tickets: any[]) => {
  localStorage.setItem('testblok_support_tickets', JSON.stringify(tickets));
};

const updateUserTestAttempt = (userId: string) => {
  try {
    const users = getStoredUsers();
    const updatedUsers = users.map((u: any) => 
      u.id === userId ? { ...u, testAttempts: u.testAttempts + 1, freeTestUsed: true } : u
    );
    saveUsers(updatedUsers);
    
    // Update current user
    const currentUser = localStorage.getItem('testblok_current_user');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      if (user.id === userId) {
        const updatedUser = { ...user, testAttempts: user.testAttempts + 1, freeTestUsed: true };
        localStorage.setItem('testblok_current_user', JSON.stringify(updatedUser));
      }
    }
  } catch (error) {
    console.error('Error updating user test attempt:', error);
  }
};

const StudentDashboard: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'tests' | 'results' | 'profile' | 'ranking' | 'analytics' | 'notifications' | 'support'>('tests');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [selectedDirection, setSelectedDirection] = useState<any>(null);
  const [paymentStep, setPaymentStep] = useState<'payment' | 'confirmation'>('payment');
  const [currentView, setCurrentView] = useState<'dashboard' | 'test' | 'results'>('dashboard');
  const [testResults, setTestResults] = useState<any>(null);
  const [userResults, setUserResults] = useState<any[]>([]);
  const [directions, setDirections] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [supportTickets, setSupportTickets] = useState<any[]>([]);
  const [supportTicket, setSupportTicket] = useState({
    subject: '',
    message: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  // Load data on component mount
  useEffect(() => {
    if (user) {
      const allResults = getStoredResults();
      const userSpecificResults = allResults.filter((result: any) => result.userId === user.id);
      setUserResults(userSpecificResults);
      
      const loadedDirections = getStoredDirections();
      setDirections(loadedDirections);
      
      const loadedNotifications = getStoredNotifications();
      setNotifications(loadedNotifications);

      const loadedTickets = getStoredTickets();
      const userTickets = loadedTickets.filter((ticket: any) => ticket.userId === user.id);
      setSupportTickets(userTickets);
    }
  }, [user]);

  // Check if user has access to a direction
  const hasAccessToDirection = (direction: any) => {
    if (!user) return false;
    
    // Check if it's a free test and user hasn't used it yet
    if (direction.isFree && !user.freeTestUsed) return true;
    
    // Check if user has access to this specific direction
    return user.allowedDirections?.includes(direction.id) || false;
  };

  // Check if user can start test (has attempts left)
  const canStartTest = (direction: any) => {
    if (!user) return false;
    
    // Free test check
    if (direction.isFree && !user.freeTestUsed) return true;
    
    // Check test attempts
    return user.testAttempts < user.maxTestAttempts || user.maxTestAttempts === -1;
  };

  // Check if user needs to pay for more attempts
  const needsPaymentForAttempts = (direction: any) => {
    if (!user) return false;
    
    // If it's a free test and not used yet, no payment needed
    if (direction.isFree && !user.freeTestUsed) return false;
    
    // If user has access to direction but no attempts left
    if (user.allowedDirections?.includes(direction.id) && !canStartTest(direction)) return true;
    
    // If user doesn't have access to direction and it's not free
    if (!user.allowedDirections?.includes(direction.id) && !direction.isFree) return true;
    
    return false;
  };

  const handleStartTest = (direction: any) => {
    // Check if user has access first
    if (!hasAccessToDirection(direction)) {
      if (!direction.isFree) {
        setSelectedDirection(direction);
        setPaymentStep('payment');
        setShowPaymentModal(true);
      } else {
        alert('Bu testga kirish huquqingiz yo\'q');
      }
      return;
    }

    // Check if user can start test (has attempts)
    if (!canStartTest(direction)) {
      alert('Test ishlash uchun urinishlaringiz tugagan');
      return;
    }

    // Start test
    setSelectedDirection(direction);
    setCurrentView('test');
  };

  const handlePaymentRequest = (direction: any) => {
    setSelectedDirection(direction);
    setPaymentStep('payment');
    setShowPaymentModal(true);
  };

  const handlePayment = () => {
    // Open Telegram link in new tab
    window.open('https://t.me/Kompyuter_xizmatlari_TAF', '_blank');
    // Switch to confirmation step
    setPaymentStep('confirmation');
  };

  const handlePaymentConfirmation = () => {
    if (!user || !selectedDirection) return;

    // Create payment record
    const newPayment = {
      id: `payment-${Date.now()}`,
      userId: user.id,
      userName: user.fullName,
      userEmail: user.email,
      directionId: selectedDirection.id,
      directionName: selectedDirection.name,
      amount: selectedDirection.price,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    // Save to localStorage
    const existingPayments = getStoredPayments();
    const updatedPayments = [...existingPayments, newPayment];
    savePayments(updatedPayments);

    // Show success message
    alert('To\'lov ma\'lumoti adminga yuborildi. Admin to\'lovingizni tekshiradi va tasdiqlaydi. Tasdiqlangandan so\'ng test ishlashingiz mumkin bo\'ladi.');
    
    setShowPaymentModal(false);
    setPaymentStep('payment');
    setSelectedDirection(null);
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setPaymentStep('payment');
    setSelectedDirection(null);
  };

  const handleTestComplete = (results: any) => {
    if (!user) return;

    // Add user info to results
    const completeResults = {
      ...results,
      id: `result-${Date.now()}`,
      userId: user.id,
      userName: user.fullName,
      userEmail: user.email,
    };

    // Save results
    const existingResults = getStoredResults();
    const updatedResults = [...existingResults, completeResults];
    saveResults(updatedResults);

    // Update user results state
    setUserResults(prev => [...prev, completeResults]);

    // Update user test attempts and free test status
    updateUserTestAttempt(user.id);
    
    // Refresh user data
    refreshUser();

    setTestResults(completeResults);
    setCurrentView('results');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedDirection(null);
    setTestResults(null);
  };

  const handleRetakeTest = () => {
    if (!canStartTest(selectedDirection)) {
      alert('Test ishlash uchun urinishlaringiz tugagan');
      return;
    }
    setCurrentView('test');
    setTestResults(null);
  };

  const handleProfileSave = (profileData: any) => {
    if (!user) return;

    const users = getStoredUsers();
    const updatedUsers = users.map((u: any) => 
      u.id === user.id ? { ...u, ...profileData } : u
    );
    saveUsers(updatedUsers);

    // Update current user
    const updatedUser = { ...user, ...profileData };
    localStorage.setItem('testblok_current_user', JSON.stringify(updatedUser));
    
    refreshUser();
    alert('Profil muvaffaqiyatli yangilandi!');
  };

  const handleSupportSubmit = () => {
    if (!supportTicket.subject || !supportTicket.message) {
      alert('Mavzu va xabar matnini kiriting');
      return;
    }

    const newTicket = {
      id: `ticket-${Date.now()}`,
      userId: user?.id,
      userName: user?.fullName,
      userEmail: user?.email,
      subject: supportTicket.subject,
      message: supportTicket.message,
      status: 'open',
      priority: supportTicket.priority,
      createdAt: new Date().toISOString(),
      responses: []
    };

    // Save to localStorage
    const existingTickets = getStoredTickets();
    const updatedTickets = [...existingTickets, newTicket];
    saveTickets(updatedTickets);

    // Update local state
    setSupportTickets(prev => [...prev, newTicket]);

    setSupportTicket({ subject: '', message: '', priority: 'medium' });
    alert('Murojaatingiz yuborildi. Tez orada javob beramiz.');
  };

  // Get user ranking
  const getUserRanking = () => {
    const allUsers = getStoredUsers().filter((u: any) => u.role === 'student');
    const allResults = getStoredResults();
    
    const userRankings = allUsers.map((u: any) => {
      const userResults = allResults.filter((result: any) => result.userId === u.id);
      const totalScore = userResults.reduce((sum: number, result: any) => sum + result.totalScore, 0);
      return { ...u, totalScore };
    }).sort((a: any, b: any) => b.totalScore - a.totalScore);

    const userRank = userRankings.findIndex((u: any) => u.id === user?.id) + 1;
    return { rank: userRank, total: userRankings.length };
  };

  const userRanking = getUserRanking();

  // If in test mode, show test interface
  if (currentView === 'test' && selectedDirection) {
    return (
      <TestInterface
        direction={selectedDirection}
        onTestComplete={handleTestComplete}
        onTestExit={handleBackToDashboard}
      />
    );
  }

  // If showing results, show results page
  if (currentView === 'results' && testResults) {
    return (
      <TestResults
        results={testResults}
        onBackToDashboard={handleBackToDashboard}
        onRetakeTest={hasAccessToDirection(selectedDirection) && canStartTest(selectedDirection) ? handleRetakeTest : undefined}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl p-8 text-white mb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Xush kelibsiz, {user?.fullName}!</h1>
          <p className="text-blue-100 text-lg mb-6">
            Bilimlaringizni sinang va o'z salohiyatingizni kashf eting
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Trophy className="h-6 w-6 text-yellow-300" />
                <div>
                  <p className="text-sm text-blue-100">Eng yaxshi natija</p>
                  <p className="text-xl font-bold">
                    {userResults.length > 0 
                      ? Math.max(...userResults.map(r => r.totalScore)).toFixed(1) + ' ball'
                      : 'Hali yo\'q'
                    }
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <BookOpen className="h-6 w-6 text-green-300" />
                <div>
                  <p className="text-sm text-blue-100">Ishlangan testlar</p>
                  <p className="text-xl font-bold">{userResults.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Clock className="h-6 w-6 text-purple-300" />
                <div>
                  <p className="text-sm text-blue-100">Test urinishlari</p>
                  <p className="text-xl font-bold">
                    {user?.testAttempts || 0}/{user?.maxTestAttempts === -1 ? '∞' : user?.maxTestAttempts || 0}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Medal className="h-6 w-6 text-orange-300" />
                <div>
                  <p className="text-sm text-blue-100">Reyting</p>
                  <p className="text-xl font-bold">
                    {userRanking.rank > 0 ? `${userRanking.rank}/${userRanking.total}` : 'Yo\'q'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8 overflow-x-auto">
        {[
          { key: 'tests', label: 'Testlar', icon: BookOpen },
          { key: 'results', label: 'Natijalar', icon: TrendingUp },
          { key: 'ranking', label: 'Reyting', icon: Trophy },
          { key: 'analytics', label: 'Tahlil', icon: BarChart3 },
          { key: 'notifications', label: 'Xabarlar', icon: Bell },
          { key: 'support', label: 'Yordam', icon: HelpCircle },
          { key: 'profile', label: 'Profil', icon: Calendar },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as any)}
            className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-md transition-all whitespace-nowrap ${
              activeTab === key
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Icon className="h-5 w-5" />
            <span className="font-medium">{label}</span>
          </button>
        ))}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {paymentStep === 'payment' ? 'To\'lov qilish' : 'To\'lovni tasdiqlash'}
              </h3>
              <button 
                onClick={closePaymentModal}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {paymentStep === 'payment' ? (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">{selectedDirection?.name}</h4>
                  <p className="text-sm text-blue-700 mb-3">{selectedDirection?.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-600">Narx:</span>
                    <span className="text-lg font-bold text-blue-900">
                      {selectedDirection?.price?.toLocaleString()} so'm
                    </span>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800 mb-1">
                        To'lov qilish tartibi:
                      </p>
                      <ol className="text-sm text-yellow-700 space-y-1">
                        <li>1. "To'lov qilish" tugmasini bosing</li>
                        <li>2. Telegram kanalga o'ting</li>
                        <li>3. To'lovni amalga oshiring</li>
                        <li>4. "To'lov qilindi" tugmasini bosing</li>
                      </ol>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-emerald-700 transition-all flex items-center justify-center space-x-2"
                >
                  <ExternalLink className="h-5 w-5" />
                  <span>To'lov qilish</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center py-6">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    To'lovni amalga oshirdingizmi?
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Agar to'lovni amalga oshirgan bo'lsangiz, quyidagi tugmani bosing. 
                    Admin to'lovingizni tekshiradi va tasdiqlaydi.
                  </p>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-700">
                      <strong>Eslatma:</strong> To'lov tasdiqlangandan so'ng test ishlashingiz mumkin bo'ladi.
                    </p>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={handlePaymentConfirmation}
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Check className="h-5 w-5" />
                    <span>To'lov qilindi</span>
                  </button>
                  <button
                    onClick={() => setPaymentStep('payment')}
                    className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-400 transition-colors"
                  >
                    Orqaga
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <EditProfile
          onClose={() => setShowEditProfile(false)}
          onSave={handleProfileSave}
        />
      )}

      {/* Tab Content */}
      {activeTab === 'tests' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Mavjud testlar</h2>
            <p className="text-gray-600">
              Quyidagi yo'nalishlar bo'yicha test ishlashingiz mumkin
            </p>
          </div>

          {/* Test attempts warning */}
          {user && user.testAttempts >= user.maxTestAttempts && user.maxTestAttempts !== -1 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-red-800">
                    Test ishlash urinishlaringiz tugagan
                  </p>
                  <p className="text-sm text-red-700">
                    Yangi testlar ishlash uchun admin bilan bog'laning yoki to'lov qiling.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {directions.filter(d => d.isActive).map((direction) => {
              const hasAccess = hasAccessToDirection(direction);
              const canStart = canStartTest(direction);
              const needsPayment = needsPaymentForAttempts(direction);
              
              return (
                <div
                  key={direction.id}
                  className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {direction.name}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {direction.description}
                      </p>
                    </div>
                    <div className="flex flex-col space-y-1">
                      {direction.isFree && !user?.freeTestUsed && (
                        <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-medium">
                          BEPUL
                        </span>
                      )}
                      {hasAccess && !direction.isFree && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-medium">
                          RUXSAT BERILGAN
                        </span>
                      )}
                      {!canStart && (
                        <span className="bg-red-100 text-red-800 text-xs px-3 py-1 rounded-full font-medium">
                          URINISH YO'Q
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-gray-600">
                      <BookOpen className="h-4 w-4 mr-2" />
                      <span>{direction.subjects?.reduce((sum: number, s: any) => sum + s.questionCount, 0) || 100} ta savol</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>3 soat</span>
                    </div>
                    {!direction.isFree && (
                      <div className="flex items-center text-sm text-gray-600">
                        <CreditCard className="h-4 w-4 mr-2" />
                        <span>{direction.price?.toLocaleString()} so'm</span>
                      </div>
                    )}
                    {direction.testWindow && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>
                          {new Date(direction.testWindow.startDate).toLocaleDateString('uz-UZ')} - {new Date(direction.testWindow.endDate).toLocaleDateString('uz-UZ')}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mb-6">
                    <p className="text-sm font-medium text-gray-700 mb-2">Fanlar:</p>
                    <div className="flex flex-wrap gap-2">
                      {direction.subjects?.map((subject: any, index: number) => (
                        <span
                          key={index}
                          className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full"
                        >
                          {subject.name} ({subject.questionCount})
                        </span>
                      )) || (
                        <>
                          <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">Matematika (30)</span>
                          <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">Fizika (30)</span>
                          <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">Tarix (10)</span>
                          <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">Ona tili (10)</span>
                          <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">Ingliz tili (10)</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="space-y-2">
                    {hasAccess && canStart ? (
                      <button
                        onClick={() => handleStartTest(direction)}
                        className="w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700"
                      >
                        <Play className="h-5 w-5" />
                        <span>Test ishlash</span>
                      </button>
                    ) : needsPayment ? (
                      <button
                        onClick={() => handlePaymentRequest(direction)}
                        className="w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-600 to-red-600 text-white hover:from-orange-700 hover:to-red-700"
                      >
                        <CreditCard className="h-5 w-5" />
                        <span>To'lov qiling va boshlang</span>
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 bg-gray-300 text-gray-500 cursor-not-allowed"
                      >
                        <Lock className="h-5 w-5" />
                        <span>Urinish yo'q</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {directions.filter(d => d.isActive).length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Hozircha faol testlar yo'q
              </h3>
              <p className="text-gray-500">
                Admin yangi testlar qo'shganda bu yerda ko'rinadi
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'results' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Test natijalari</h2>
            <p className="text-gray-600">
              Sizning ishlagan testlaringiz va natijalaringiz
            </p>
          </div>

          {userResults.length > 0 ? (
            <div className="space-y-6">
              {userResults.map((result) => (
                <div
                  key={result.id}
                  className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {result.direction}
                      </h3>
                      <p className="text-gray-600">
                        {new Date(result.completedAt).toLocaleDateString('uz-UZ')}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-blue-600">
                        {result.totalScore.toFixed(1)}
                      </div>
                      <div className="text-sm text-gray-500">
                        ball
                      </div>
                      <div className="text-sm font-medium text-green-600">
                        {Math.round((result.correctAnswers / result.totalQuestions) * 100)}%
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {Object.entries(result.subjectScores).map(([subject, data]: [string, any]) => (
                      <div
                        key={subject}
                        className="bg-gray-50 rounded-lg p-4"
                      >
                        <h4 className="font-medium text-gray-900 mb-2">
                          {subject}
                        </h4>
                        <div className="space-y-1">
                          <div className="text-lg font-bold text-blue-600">
                            {data.score.toFixed(1)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {data.correct}/{data.total} to'g'ri
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Hozircha natijalar yo'q
              </h3>
              <p className="text-gray-500">
                Birinchi testingizni ishlab natijani ko'ring
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'ranking' && (
        <UserRanking />
      )}

      {activeTab === 'analytics' && user && (
        <SubjectAnalytics userId={user.id} />
      )}

      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Xabarlar</h2>
            <p className="text-gray-600">
              Sizga yuborilgan xabarlar va bildirishnomalar
            </p>
          </div>

          <div className="space-y-4">
            {notifications.filter(n => n.isActive).map((notification) => (
              <div key={notification.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{notification.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        notification.type === 'test_available' ? 'bg-green-100 text-green-800' :
                        notification.type === 'warning' ? 'bg-red-100 text-red-800' :
                        notification.type === 'achievement' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {notification.type === 'test_available' ? 'Yangi test' :
                         notification.type === 'warning' ? 'Ogohlantirish' :
                         notification.type === 'achievement' ? 'Yutuq' : 'Ma\'lumot'}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{notification.message}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(notification.createdAt).toLocaleDateString('uz-UZ')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {notifications.filter(n => n.isActive).length === 0 && (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Hozircha xabarlar yo'q
              </h3>
              <p className="text-gray-500">
                Yangi xabarlar bu yerda ko'rinadi
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'support' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Yordam va qo'llab-quvvatlash</h2>
            <p className="text-gray-600">
              Savolingiz bormi? Biz bilan bog'laning!
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Yangi murojaat yuborish</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mavzu
                </label>
                <input
                  type="text"
                  value={supportTicket.subject}
                  onChange={(e) => setSupportTicket({...supportTicket, subject: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Murojaat mavzusini kiriting"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Xabar
                </label>
                <textarea
                  value={supportTicket.message}
                  onChange={(e) => setSupportTicket({...supportTicket, message: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                  placeholder="Muammo yoki savolingizni batafsil yozing"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Muhimlik darajasi
                </label>
                <select
                  value={supportTicket.priority}
                  onChange={(e) => setSupportTicket({...supportTicket, priority: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="low">Past</option>
                  <option value="medium">O'rtacha</option>
                  <option value="high">Yuqori</option>
                </select>
              </div>

              <button
                onClick={handleSupportSubmit}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <MessageSquare className="h-5 w-5" />
                <span>Murojaat yuborish</span>
              </button>
            </div>
          </div>

          {/* User's Support Tickets */}
          {supportTickets.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Sizning murojaatlaringiz</h3>
              
              <div className="space-y-4">
                {supportTickets.map((ticket) => (
                  <div key={ticket.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{ticket.subject}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        ticket.status === 'open' ? 'bg-blue-100 text-blue-800' :
                        ticket.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                        ticket.status === 'resolved' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {ticket.status === 'open' ? 'Ochiq' :
                         ticket.status === 'in_progress' ? 'Jarayonda' :
                         ticket.status === 'resolved' ? 'Hal qilingan' : 'Yopiq'}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{ticket.message}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(ticket.createdAt).toLocaleDateString('uz-UZ')}
                    </p>
                    
                    {/* Admin responses */}
                    {ticket.responses && ticket.responses.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Admin javobi:</h5>
                        {ticket.responses.filter((r: any) => r.isAdmin).map((response: any) => (
                          <div key={response.id} className="bg-blue-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-700">{response.message}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(response.createdAt).toLocaleDateString('uz-UZ')}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQ Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Ko'p so'raladigan savollar</h3>
            
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Qanday qilib test ishlashim mumkin?</h4>
                <p className="text-sm text-gray-600">
                  Testlar bo'limiga o'ting va mavjud yo'nalishlardan birini tanlang. Agar bepul test mavjud bo'lsa, uni darhol ishlashingiz mumkin.
                </p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">To'lov qanday amalga oshiriladi?</h4>
                <p className="text-sm text-gray-600">
                  To'lov qilish uchun Telegram orqali admin bilan bog'laning. To'lov tasdiqlangandan so'ng test ishlash imkoniyati beriladi.
                </p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Test natijalarini qayerdan ko'raman?</h4>
                <p className="text-sm text-gray-600">
                  Test yakunlangandan so'ng natijalar avtomatik ko'rsatiladi. Shuningdek, "Natijalar" bo'limida barcha test natijalaringizni ko'rishingiz mumkin.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Profil ma'lumotlari</h2>
              <p className="text-gray-600">
                Shaxsiy ma'lumotlaringizni ko'rish va tahrirlash
              </p>
            </div>
            <button
              onClick={() => setShowEditProfile(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Edit className="h-4 w-4" />
              <span>Tahrirlash</span>
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To'liq ism
                </label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                  {user?.fullName}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                  {user?.email}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefon
                </label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                  {user?.phone}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ro'yxatdan o'tgan sana
                </label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('uz-UZ') : '-'}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Test urinishlari</h3>
                    <p className="text-sm text-gray-600">
                      Jami test ishlash imkoniyati
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      {user?.testAttempts || 0}/{user?.maxTestAttempts === -1 ? '∞' : user?.maxTestAttempts || 0}
                    </div>
                    <div className="text-sm text-gray-500">
                      ishlatilgan/jami
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Bepul test</h3>
                    <p className="text-sm text-gray-600">
                      Har bir foydalanuvchi birinchi testni bepul ishlaydi
                    </p>
                  </div>
                  <div className="flex items-center">
                    {user?.freeTestUsed ? (
                      <div className="flex items-center space-x-2 text-red-600">
                        <AlertCircle className="h-5 w-5" />
                        <span className="font-medium">Ishlatilgan</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 text-green-600">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-medium">Mavjud</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Allowed Directions */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Ruxsat berilgan yo'nalishlar</h3>
              {user?.allowedDirections && user.allowedDirections.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.allowedDirections.map(directionId => {
                    const direction = directions.find(d => d.id === directionId);
                    return direction ? (
                      <div key={directionId} className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="font-medium text-green-900">{direction.name}</p>
                            <p className="text-sm text-green-700">Test ishlash mumkin</p>
                          </div>
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-600 text-center">
                    Hozircha hech qanday yo'nalishga ruxsat berilmagan
                  </p>
                </div>
              )}
            </div>

            {/* User Statistics */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Statistika</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{userResults.length}</div>
                  <div className="text-sm text-blue-700">Ishlangan testlar</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {userResults.length > 0 
                      ? Math.max(...userResults.map(r => r.totalScore)).toFixed(1)
                      : '0'
                    }
                  </div>
                  <div className="text-sm text-green-700">Eng yaxshi natija</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {userRanking.rank > 0 ? userRanking.rank : '-'}
                  </div>
                  <div className="text-sm text-purple-700">Reyting o'rni</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;