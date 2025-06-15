import React, { useState, useEffect } from 'react';
import { Bell, Eye, EyeOff, Calendar, AlertCircle, CheckCircle, Info, Trophy } from 'lucide-react';

interface Notification {
  id: string;
  userId?: string;
  title: string;
  message: string;
  type: 'test_available' | 'result_ready' | 'achievement' | 'warning' | 'info';
  isRead: boolean;
  isActive: boolean;
  createdAt: string;
  actionUrl?: string;
}

const AdminNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    try {
      const stored = localStorage.getItem('testblok_notifications');
      const allNotifications = stored ? JSON.parse(stored) : [];
      setNotifications(allNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const saveNotifications = (updatedNotifications: Notification[]) => {
    localStorage.setItem('testblok_notifications', JSON.stringify(updatedNotifications));
    setNotifications(updatedNotifications);
  };

  const markAsRead = (notificationId: string) => {
    const updated = notifications.map(n => 
      n.id === notificationId ? { ...n, isRead: true } : n
    );
    saveNotifications(updated);
  };

  const markAsUnread = (notificationId: string) => {
    const updated = notifications.map(n => 
      n.id === notificationId ? { ...n, isRead: false } : n
    );
    saveNotifications(updated);
  };

  const deleteNotification = (notificationId: string) => {
    const updated = notifications.filter(n => n.id !== notificationId);
    saveNotifications(updated);
  };

  const createNotification = () => {
    const newNotification: Notification = {
      id: `notification-${Date.now()}`,
      title: 'Yangi xabar',
      message: 'Bu yerga xabar matnini yozing',
      type: 'info',
      isRead: false,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    const updated = [newNotification, ...notifications];
    saveNotifications(updated);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'test_available': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning': return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'achievement': return <Trophy className="h-5 w-5 text-yellow-600" />;
      default: return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'test_available': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-red-100 text-red-800';
      case 'achievement': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.isRead;
    if (filter === 'read') return n.isRead;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Xabarlar boshqaruvi</h2>
          <p className="text-gray-600">Tizim xabarlarini boshqaring</p>
        </div>
        <button
          onClick={createNotification}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Yangi xabar
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { key: 'all', label: 'Barchasi', count: notifications.length },
          { key: 'unread', label: 'O\'qilmagan', count: notifications.filter(n => !n.isRead).length },
          { key: 'read', label: 'O\'qilgan', count: notifications.filter(n => n.isRead).length }
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

      {/* Notifications list */}
      <div className="space-y-4">
        {filteredNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`bg-white rounded-xl shadow-lg border p-6 ${
              !notification.isRead ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  {getTypeIcon(notification.type)}
                  <h3 className="text-lg font-bold text-gray-900">{notification.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getTypeColor(notification.type)}`}>
                    {notification.type === 'test_available' ? 'Yangi test' :
                     notification.type === 'warning' ? 'Ogohlantirish' :
                     notification.type === 'achievement' ? 'Yutuq' : 'Ma\'lumot'}
                  </span>
                  {!notification.isRead && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      Yangi
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mb-3">{notification.message}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(notification.createdAt).toLocaleDateString('uz-UZ')}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {notification.isRead ? (
                  <button
                    onClick={() => markAsUnread(notification.id)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="O'qilmagan deb belgilash"
                  >
                    <EyeOff className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="O'qilgan deb belgilash"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(notification.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="O'chirish"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredNotifications.length === 0 && (
        <div className="text-center py-12">
          <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filter === 'unread' ? 'O\'qilmagan xabarlar yo\'q' :
             filter === 'read' ? 'O\'qilgan xabarlar yo\'q' : 'Xabarlar yo\'q'}
          </h3>
          <p className="text-gray-500">
            {filter === 'all' ? 'Yangi xabar yaratish uchun yuqoridagi tugmani bosing' : 
             'Boshqa filtrlarni sinab ko\'ring'}
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminNotifications;