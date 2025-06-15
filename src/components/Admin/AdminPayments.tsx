import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle, XCircle, Clock, DollarSign, User, Calendar } from 'lucide-react';

interface Payment {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  directionId: string;
  directionName: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'rejected';
  createdAt: string;
}

const AdminPayments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'rejected'>('all');

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = () => {
    try {
      const stored = localStorage.getItem('testblok_payments');
      const allPayments = stored ? JSON.parse(stored) : [];
      setPayments(allPayments);
    } catch (error) {
      console.error('Error loading payments:', error);
    }
  };

  const savePayments = (updatedPayments: Payment[]) => {
    localStorage.setItem('testblok_payments', JSON.stringify(updatedPayments));
    setPayments(updatedPayments);
  };

  const updatePaymentStatus = (paymentId: string, status: 'confirmed' | 'rejected') => {
    const updated = payments.map(payment => {
      if (payment.id === paymentId) {
        return { ...payment, status };
      }
      return payment;
    });
    
    savePayments(updated);

    // If payment is confirmed, grant access to user
    if (status === 'confirmed') {
      const payment = payments.find(p => p.id === paymentId);
      if (payment) {
        grantUserAccess(payment.userId, payment.directionId);
      }
    }
  };

  const grantUserAccess = (userId: string, directionId: string) => {
    try {
      const users = JSON.parse(localStorage.getItem('testblok_users') || '[]');
      const updatedUsers = users.map((user: any) => {
        if (user.id === userId) {
          const allowedDirections = user.allowedDirections || [];
          if (!allowedDirections.includes(directionId)) {
            return {
              ...user,
              allowedDirections: [...allowedDirections, directionId],
              maxTestAttempts: user.maxTestAttempts + 5 // Add 5 more attempts
            };
          }
        }
        return user;
      });
      
      localStorage.setItem('testblok_users', JSON.stringify(updatedUsers));
      
      // Update current user if it's the same user
      const currentUser = localStorage.getItem('testblok_current_user');
      if (currentUser) {
        const user = JSON.parse(currentUser);
        if (user.id === userId) {
          const allowedDirections = user.allowedDirections || [];
          if (!allowedDirections.includes(directionId)) {
            const updatedUser = {
              ...user,
              allowedDirections: [...allowedDirections, directionId],
              maxTestAttempts: user.maxTestAttempts + 5
            };
            localStorage.setItem('testblok_current_user', JSON.stringify(updatedUser));
          }
        }
      }
    } catch (error) {
      console.error('Error granting user access:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Kutilmoqda';
      case 'confirmed': return 'Tasdiqlangan';
      case 'rejected': return 'Rad etilgan';
      default: return status;
    }
  };

  const filteredPayments = payments.filter(payment => {
    if (filter === 'all') return true;
    return payment.status === filter;
  });

  const totalAmount = payments
    .filter(p => p.status === 'confirmed')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">To'lovlar boshqaruvi</h2>
          <p className="text-gray-600">Foydalanuvchilardan kelgan to'lovlarni boshqaring</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm text-green-700">Jami daromad</p>
              <p className="text-lg font-bold text-green-900">
                {totalAmount.toLocaleString()} so'm
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center space-x-3">
            <Clock className="h-8 w-8 text-yellow-500" />
            <div>
              <p className="text-sm text-gray-600">Kutilmoqda</p>
              <p className="text-2xl font-bold text-yellow-600">
                {payments.filter(p => p.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm text-gray-600">Tasdiqlangan</p>
              <p className="text-2xl font-bold text-green-600">
                {payments.filter(p => p.status === 'confirmed').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center space-x-3">
            <XCircle className="h-8 w-8 text-red-500" />
            <div>
              <p className="text-sm text-gray-600">Rad etilgan</p>
              <p className="text-2xl font-bold text-red-600">
                {payments.filter(p => p.status === 'rejected').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center space-x-3">
            <CreditCard className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-sm text-gray-600">Jami</p>
              <p className="text-2xl font-bold text-blue-600">{payments.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { key: 'all', label: 'Barchasi', count: payments.length },
          { key: 'pending', label: 'Kutilmoqda', count: payments.filter(p => p.status === 'pending').length },
          { key: 'confirmed', label: 'Tasdiqlangan', count: payments.filter(p => p.status === 'confirmed').length },
          { key: 'rejected', label: 'Rad etilgan', count: payments.filter(p => p.status === 'rejected').length }
        ].map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setFilter(key as any)}
            className={`flex items-center space-x-2 py-2 px-4 rounded-md transition-all ${
              filter === key
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span>{label}</span>
            <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Payments table */}
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
                  Miqdor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Holat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sana
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amallar
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center">
                          <User className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{payment.userName}</div>
                        <div className="text-sm text-gray-500">{payment.userEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{payment.directionName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">
                      {payment.amount.toLocaleString()} so'm
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                      {getStatusText(payment.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(payment.createdAt).toLocaleDateString('uz-UZ')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {payment.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => updatePaymentStatus(payment.id, 'confirmed')}
                          className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-1"
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>Tasdiqlash</span>
                        </button>
                        <button
                          onClick={() => updatePaymentStatus(payment.id, 'rejected')}
                          className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-1"
                        >
                          <XCircle className="h-4 w-4" />
                          <span>Rad etish</span>
                        </button>
                      </div>
                    )}
                    {payment.status !== 'pending' && (
                      <span className="text-gray-400">
                        {getStatusText(payment.status)}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPayments.length === 0 && (
          <div className="text-center py-12">
            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'all' ? 'To\'lovlar yo\'q' : `${getStatusText(filter)} to'lovlar yo'q`}
            </h3>
            <p className="text-gray-500">
              Foydalanuvchilar to'lov qilganda bu yerda ko'rinadi
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPayments;