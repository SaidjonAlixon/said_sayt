import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AdminNotifications from '../Admin/AdminNotifications';
import AdminSupport from '../Admin/AdminSupport';
import AdminPayments from '../Admin/AdminPayments';
import AdminQuestions from '../Admin/AdminQuestions';
import { 
  Users, 
  BookOpen, 
  Settings, 
  CreditCard, 
  BarChart3,
  Bell,
  MessageSquare,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Calendar,
  DollarSign
} from 'lucide-react';

// Helper functions for localStorage
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

const getStoredDirections = () => {
  try {
    const directions = localStorage.getItem('testblok_directions');
    return directions ? JSON.parse(directions) : [];
  } catch {
    return [];
  }
};

const saveDirections = (directions: any[]) => {
  localStorage.setItem('testblok_directions', JSON.stringify(directions));
};

const getStoredResults = () => {
  try {
    const results = localStorage.getItem('testblok_test_results');
    return results ? JSON.parse(results) : [];
  } catch {
    return [];
  }
};

const getStoredPayments = () => {
  try {
    const payments = localStorage.getItem('testblok_payments');
    return payments ? JSON.parse(payments) : [];
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

const getStoredTickets = () => {
  try {
    const tickets = localStorage.getItem('testblok_support_tickets');
    return tickets ? JSON.parse(tickets) : [];
  } catch {
    return [];
  }
};

// Initialize default data
const initializeDefaultData = () => {
  const existingDirections = getStoredDirections();
  const existingNotifications = getStoredNotifications();
  
  if (existingDirections.length === 0) {
    const defaultDirections = [
      {
        id: 'direction-1',
        name: 'Texnika yo\'nalishi',
        description: 'Muhandislik va texnika sohalari uchun',
        isActive: true,
        isFree: true,
        price: 0,
        subjects: [
          {
            id: 'subject-1-1',
            name: 'Matematika',
            type: 'main',
            questionCount: 30,
            pointsPerQuestion: 3.1,
            questions: []
          },
          {
            id: 'subject-1-2',
            name: 'Fizika',
            type: 'main',
            questionCount: 30,
            pointsPerQuestion: 2.1,
            questions: []
          },
          {
            id: 'subject-1-3',
            name: 'Ona tili',
            type: 'mandatory',
            questionCount: 10,
            pointsPerQuestion: 1.1,
            questions: []
          },
          {
            id: 'subject-1-4',
            name: 'Tarix',
            type: 'mandatory',
            questionCount: 10,
            pointsPerQuestion: 1.1,
            questions: []
          },
          {
            id: 'subject-1-5',
            name: 'Ingliz tili',
            type: 'mandatory',
            questionCount: 10,
            pointsPerQuestion: 1.1,
            questions: []
          }
        ],
        createdAt: new Date().toISOString()
      },
      {
        id: 'direction-2',
        name: 'Tibbiyot yo\'nalishi',
        description: 'Tibbiyot va farmatsevtika sohalari uchun',
        isActive: true,
        isFree: false,
        price: 15000,
        subjects: [
          {
            id: 'subject-2-1',
            name: 'Biologiya',
            type: 'main',
            questionCount: 30,
            pointsPerQuestion: 3.1,
            questions: []
          },
          {
            id: 'subject-2-2',
            name: 'Kimyo',
            type: 'main',
            questionCount: 30,
            pointsPerQuestion: 2.1,
            questions: []
          },
          {
            id: 'subject-2-3',
            name: 'Ona tili',
            type: 'mandatory',
            questionCount: 10,
            pointsPerQuestion: 1.1,
            questions: []
          },
          {
            id: 'subject-2-4',
            name: 'Tarix',
            type: 'mandatory',
            questionCount: 10,
            pointsPerQuestion: 1.1,
            questions: []
          },
          {
            id: 'subject-2-5',
            name: 'Ingliz tili',
            type: 'mandatory',
            questionCount: 10,
            pointsPerQuestion: 1.1,
            questions: []
          }
        ],
        createdAt: new Date().toISOString()
      }
    ];
    saveDirections(defaultDirections);
  }

  if (existingNotifications.length === 0) {
    const defaultNotifications = [
      {
        id: 'notif-1',
        title: 'Yangi yo\'nalish qo\'shildi',
        message: 'Texnika yo\'nalishi bo\'yicha bepul test mavjud',
        type: 'test_available',
        isRead: false,
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'notif-2',
        title: 'Tizim yangilandi',
        message: 'Yangi xususiyatlar qo\'shildi va xatolar tuzatildi',
        type: 'info',
        isRead: false,
        isActive: true,
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem('testblok_notifications', JSON.stringify(defaultNotifications));
  }
};

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'users' | 'directions' | 'questions' | 'payments' | 'results' | 'notifications' | 'support'>('users');
  const [users, setUsers] = useState<any[]>([]);
  const [directions, setDirections] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [showAddDirection, setShowAddDirection] = useState(false);
  const [editingDirection, setEditingDirection] = useState<any>(null);
  const [newDirection, setNewDirection] = useState({
    name: '',
    description: '',
    isFree: false,
    price: 5000,
    mainSubject1: '',
    mainSubject2: ''
  });

  // Notification counts
  const [notificationCounts, setNotificationCounts] = useState({
    payments: 0,
    support: 0,
    notifications: 0
  });

  useEffect(() => {
    initializeDefaultData();
    loadData();
    updateNotificationCounts();
  }, []);

  useEffect(() => {
    // Listen for localStorage changes to update notification counts
    const handleStorageChange = () => {
      updateNotificationCounts();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically for changes made in the same tab
    const interval = setInterval(updateNotificationCounts, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const updateNotificationCounts = () => {
    const payments = getStoredPayments();
    const tickets = getStoredTickets();
    const notifications = getStoredNotifications();

    setNotificationCounts({
      payments: payments.filter((p: any) => p.status === 'pending').length,
      support: tickets.filter((t: any) => t.status === 'open').length,
      notifications: notifications.filter((n: any) => !n.isRead).length
    });
  };

  const loadData = () => {
    setUsers(getStoredUsers());
    setDirections(getStoredDirections());
    setResults(getStoredResults());
  };

  const toggleUserBlock = (userId: string) => {
    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, isBlocked: !u.isBlocked } : u
    );
    saveUsers(updatedUsers);
    setUsers(updatedUsers);
  };

  const grantDirectionAccess = (userId: string, directionId: string) => {
    const updatedUsers = users.map(u => {
      if (u.id === userId) {
        const allowedDirections = u.allowedDirections || [];
        if (!allowedDirections.includes(directionId)) {
          return {
            ...u,
            allowedDirections: [...allowedDirections, directionId],
            maxTestAttempts: u.maxTestAttempts + 5
          };
        }
      }
      return u;
    });
    saveUsers(updatedUsers);
    setUsers(updatedUsers);
  };

  const addDirection = () => {
    if (!newDirection.name || !newDirection.description || !newDirection.mainSubject1 || !newDirection.mainSubject2) {
      alert('Barcha maydonlarni to\'ldiring');
      return;
    }

    // Create subjects array with main subjects and mandatory subjects
    const subjects = [
      // Main subjects
      {
        id: `subject-${Date.now()}-1`,
        name: newDirection.mainSubject1,
        type: 'main',
        questionCount: 30,
        pointsPerQuestion: 3.1,
        questions: []
      },
      {
        id: `subject-${Date.now()}-2`,
        name: newDirection.mainSubject2,
        type: 'main',
        questionCount: 30,
        pointsPerQuestion: 2.1,
        questions: []
      },
      // Mandatory subjects (always the same)
      {
        id: `subject-${Date.now()}-3`,
        name: 'Ona tili',
        type: 'mandatory',
        questionCount: 10,
        pointsPerQuestion: 1.1,
        questions: []
      },
      {
        id: `subject-${Date.now()}-4`,
        name: 'Tarix',
        type: 'mandatory',
        questionCount: 10,
        pointsPerQuestion: 1.1,
        questions: []
      },
      {
        id: `subject-${Date.now()}-5`,
        name: 'Ingliz tili',
        type: 'mandatory',
        questionCount: 10,
        pointsPerQuestion: 1.1,
        questions: []
      }
    ];

    const direction = {
      id: `direction-${Date.now()}`,
      name: newDirection.name,
      description: newDirection.description,
      isFree: newDirection.isFree,
      price: newDirection.price,
      subjects,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    const updatedDirections = [...directions, direction];
    saveDirections(updatedDirections);
    setDirections(updatedDirections);
    
    setNewDirection({
      name: '',
      description: '',
      isFree: false,
      price: 5000,
      mainSubject1: '',
      mainSubject2: ''
    });
    setShowAddDirection(false);
  };

  const updateDirection = () => {
    if (!editingDirection) return;

    const updatedDirections = directions.map(d => 
      d.id === editingDirection.id ? editingDirection : d
    );
    saveDirections(updatedDirections);
    setDirections(updatedDirections);
    setEditingDirection(null);
  };

  const deleteDirection = (directionId: string) => {
    if (confirm('Bu yo\'nalishni o\'chirmoqchimisiz?')) {
      const updatedDirections = directions.filter(d => d.id !== directionId);
      saveDirections(updatedDirections);
      setDirections(updatedDirections);
    }
  };

  const toggleDirectionStatus = (directionId: string) => {
    const updatedDirections = directions.map(d => 
      d.id === directionId ? { ...d, isActive: !d.isActive } : d
    );
    saveDirections(updatedDirections);
    setDirections(updatedDirections);
  };

  const resetDirectionForm = () => {
    setNewDirection({
      name: '',
      description: '',
      isFree: false,
      price: 5000,
      mainSubject1: '',
      mainSubject2: ''
    });
    setShowAddDirection(false);
    setEditingDirection(null);
  };

  const getTotalNotifications = () => {
    return notificationCounts.payments + notificationCounts.support + notificationCounts.notifications;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl p-8 text-white mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
        <p className="text-blue-100 text-lg">
          Tizimni boshqaring va foydalanuvchilarni kuzating
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8 overflow-x-auto">
        {[
          { key: 'users', label: 'Foydalanuvchilar', icon: Users },
          { key: 'directions', label: 'Yo\'nalishlar', icon: BookOpen },
          { key: 'questions', label: 'Savollar', icon: Settings },
          { 
            key: 'payments', 
            label: 'To\'lovlar', 
            icon: CreditCard,
            count: notificationCounts.payments
          },
          { key: 'results', label: 'Natijalar', icon: BarChart3 },
          { 
            key: 'notifications', 
            label: 'Xabarlar', 
            icon: Bell,
            count: notificationCounts.notifications
          },
          { 
            key: 'support', 
            label: 'Yordam', 
            icon: MessageSquare,
            count: notificationCounts.support
          },
        ].map(({ key, label, icon: Icon, count }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as any)}
            className={`relative flex items-center justify-center space-x-2 py-3 px-4 rounded-md transition-all whitespace-nowrap ${
              activeTab === key
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Icon className="h-5 w-5" />
            <span className="font-medium">{label}</span>
            {count && count > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {count > 99 ? '99+' : count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Foydalanuvchilar</h2>
            <p className="text-gray-600">Ro'yxatdan o'tgan foydalanuvchilarni boshqaring</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Foydalanuvchi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rol
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Test urinishlari
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Holat
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amallar
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.filter(u => u.role === 'student').map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {user.role === 'admin' ? 'Admin' : 'Student'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.testAttempts || 0}/{user.maxTestAttempts === -1 ? '∞' : user.maxTestAttempts || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.isBlocked 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {user.isBlocked ? 'Bloklangan' : 'Faol'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => toggleUserBlock(user.id)}
                            className={`px-3 py-1 rounded text-xs font-medium ${
                              user.isBlocked
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'bg-red-600 text-white hover:bg-red-700'
                            }`}
                          >
                            {user.isBlocked ? 'Blokdan chiqarish' : 'Bloklash'}
                          </button>
                          
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                grantDirectionAccess(user.id, e.target.value);
                                e.target.value = '';
                              }
                            }}
                            className="text-xs border border-gray-300 rounded px-2 py-1"
                          >
                            <option value="">Yo'nalish berish</option>
                            {directions.filter(d => d.isActive && !d.isFree).map(direction => (
                              <option key={direction.id} value={direction.id}>
                                {direction.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'directions' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Yo'nalishlar</h2>
              <p className="text-gray-600">Test yo'nalishlarini boshqaring</p>
            </div>
            <button
              onClick={() => setShowAddDirection(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Yangi yo'nalish</span>
            </button>
          </div>

          {/* Add Direction Modal */}
          {showAddDirection && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Yangi yo'nalish qo'shish</h3>
                  <button onClick={resetDirectionForm} className="text-gray-400 hover:text-gray-600">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Yo'nalish nomi
                    </label>
                    <input
                      type="text"
                      value={newDirection.name}
                      onChange={(e) => setNewDirection({ ...newDirection, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Masalan: Texnika yo'nalishi"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tavsif
                    </label>
                    <textarea
                      value={newDirection.description}
                      onChange={(e) => setNewDirection({ ...newDirection, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                      placeholder="Yo'nalish haqida qisqacha ma'lumot"
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newDirection.isFree}
                        onChange={(e) => setNewDirection({ ...newDirection, isFree: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Bepul test</span>
                    </label>

                    {!newDirection.isFree && (
                      <div className="flex items-center space-x-2">
                        <label className="text-sm text-gray-700">Narx (so'm):</label>
                        <input
                          type="number"
                          value={newDirection.price}
                          onChange={(e) => setNewDirection({ ...newDirection, price: parseInt(e.target.value) })}
                          className="w-24 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          min="0"
                        />
                      </div>
                    )}
                  </div>

                  {/* Main Subjects */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Fanlar</h4>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          1-Asosiy fan (3.1 ballik)
                        </label>
                        <input
                          type="text"
                          value={newDirection.mainSubject1}
                          onChange={(e) => setNewDirection({ ...newDirection, mainSubject1: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Masalan: Matematika"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          2-Asosiy fan (2.1 ballik)
                        </label>
                        <input
                          type="text"
                          value={newDirection.mainSubject2}
                          onChange={(e) => setNewDirection({ ...newDirection, mainSubject2: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Masalan: Fizika"
                        />
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Eslatma:</strong> Majburiy fanlar (Ona tili, Tarix, Ingliz tili) avtomatik qo'shiladi. 
                        Har birida 10 tadan savol bo'ladi va har bir to\'g'ri javob 1.1 ball beriladi.
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={addDirection}
                      className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Save className="h-4 w-4" />
                      <span>Qo'shish</span>
                    </button>
                    <button
                      onClick={resetDirectionForm}
                      className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-400 transition-colors"
                    >
                      Bekor qilish
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Edit Direction Modal */}
          {editingDirection && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Yo'nalishni tahrirlash</h3>
                  <button onClick={resetDirectionForm} className="text-gray-400 hover:text-gray-600">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Yo'nalish nomi
                    </label>
                    <input
                      type="text"
                      value={editingDirection.name}
                      onChange={(e) => setEditingDirection({ ...editingDirection, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tavsif
                    </label>
                    <textarea
                      value={editingDirection.description}
                      onChange={(e) => setEditingDirection({ ...editingDirection, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={editingDirection.isFree}
                        onChange={(e) => setEditingDirection({ ...editingDirection, isFree: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Bepul test</span>
                    </label>

                    {!editingDirection.isFree && (
                      <div className="flex items-center space-x-2">
                        <label className="text-sm text-gray-700">Narx (so'm):</label>
                        <input
                          type="number"
                          value={editingDirection.price}
                          onChange={(e) => setEditingDirection({ ...editingDirection, price: parseInt(e.target.value) })}
                          className="w-24 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          min="0"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={updateDirection}
                      className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Save className="h-4 w-4" />
                      <span>Saqlash</span>
                    </button>
                    <button
                      onClick={resetDirectionForm}
                      className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-400 transition-colors"
                    >
                      Bekor qilish
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Directions List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {directions.map((direction) => (
              <div key={direction.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{direction.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{direction.description}</p>
                    <div className="flex items-center space-x-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        direction.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {direction.isActive ? 'Faol' : 'Nofaol'}
                      </span>
                      {direction.isFree ? (
                        <span className="text-xs px-2 py-1 rounded-full font-medium bg-blue-100 text-blue-800">
                          Bepul
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-1 rounded-full font-medium bg-yellow-100 text-yellow-800">
                          {direction.price?.toLocaleString()} so'm
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingDirection(direction)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => toggleDirectionStatus(direction.id)}
                      className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                    >
                      {direction.isActive ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => deleteDirection(direction.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Fanlar:</h4>
                  {direction.subjects?.map((subject: any) => (
                    <div key={subject.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm">{subject.name}</span>
                      <span className="text-xs text-gray-500">
                        {subject.type === 'main' ? 'Asosiy' : 'Majburiy'} - {subject.pointsPerQuestion} ball
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Yaratilgan: {new Date(direction.createdAt).toLocaleDateString('uz-UZ')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'questions' && <AdminQuestions />}
      {activeTab === 'payments' && <AdminPayments />}
      {activeTab === 'notifications' && <AdminNotifications />}
      {activeTab === 'support' && <AdminSupport />}

      {activeTab === 'results' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Test natijalari</h2>
            <p className="text-gray-600">Barcha foydalanuvchilarning test natijalarini ko'ring</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Foydalanuvchi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Yo'nalish
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ball
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      To'g'ri javoblar
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sana
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.map((result) => (
                    <tr key={result.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{result.userName}</div>
                          <div className="text-sm text-gray-500">{result.userEmail}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {result.direction}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-blue-600">{result.totalScore.toFixed(1)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {result.correctAnswers}/{result.totalQuestions} ({Math.round((result.correctAnswers / result.totalQuestions) * 100)}%)
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(result.completedAt).toLocaleDateString('uz-UZ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {results.length === 0 && (
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Hozircha natijalar yo'q
                </h3>
                <p className="text-gray-500">
                  Foydalanuvchilar test ishlaganda natijalar bu yerda ko'rinadi
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;