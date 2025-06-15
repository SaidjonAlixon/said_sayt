import React, { useState, useEffect } from 'react';
import { MessageSquare, Clock, CheckCircle, AlertCircle, Send, User } from 'lucide-react';

interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  responses: SupportResponse[];
}

interface SupportResponse {
  id: string;
  ticketId: string;
  userId: string;
  userName: string;
  message: string;
  isAdmin: boolean;
  createdAt: string;
}

const AdminSupport: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [filter, setFilter] = useState<'all' | 'open' | 'in_progress' | 'resolved'>('all');

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = () => {
    try {
      const stored = localStorage.getItem('testblok_support_tickets');
      const allTickets = stored ? JSON.parse(stored) : [];
      setTickets(allTickets);
    } catch (error) {
      console.error('Error loading tickets:', error);
    }
  };

  const saveTickets = (updatedTickets: SupportTicket[]) => {
    localStorage.setItem('testblok_support_tickets', JSON.stringify(updatedTickets));
    setTickets(updatedTickets);
  };

  const updateTicketStatus = (ticketId: string, status: SupportTicket['status']) => {
    const updated = tickets.map(ticket => 
      ticket.id === ticketId ? { ...ticket, status } : ticket
    );
    saveTickets(updated);
    
    if (selectedTicket?.id === ticketId) {
      setSelectedTicket({ ...selectedTicket, status });
    }
  };

  const sendResponse = () => {
    if (!selectedTicket || !responseMessage.trim()) return;

    const newResponse: SupportResponse = {
      id: `response-${Date.now()}`,
      ticketId: selectedTicket.id,
      userId: 'admin-1',
      userName: 'Admin',
      message: responseMessage.trim(),
      isAdmin: true,
      createdAt: new Date().toISOString()
    };

    const updatedTickets = tickets.map(ticket => {
      if (ticket.id === selectedTicket.id) {
        const updatedTicket = {
          ...ticket,
          responses: [...ticket.responses, newResponse],
          status: 'in_progress' as const
        };
        setSelectedTicket(updatedTicket);
        return updatedTicket;
      }
      return ticket;
    });

    saveTickets(updatedTickets);
    setResponseMessage('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return 'Ochiq';
      case 'in_progress': return 'Jarayonda';
      case 'resolved': return 'Hal qilingan';
      case 'closed': return 'Yopiq';
      default: return status;
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Yuqori';
      case 'medium': return 'O\'rtacha';
      case 'low': return 'Past';
      default: return priority;
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    if (filter === 'all') return true;
    return ticket.status === filter;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Yordam so'rovlari</h2>
        <p className="text-gray-600">Foydalanuvchilardan kelgan so'rovlarni boshqaring</p>
      </div>

      {/* Filter tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { key: 'all', label: 'Barchasi', count: tickets.length },
          { key: 'open', label: 'Ochiq', count: tickets.filter(t => t.status === 'open').length },
          { key: 'in_progress', label: 'Jarayonda', count: tickets.filter(t => t.status === 'in_progress').length },
          { key: 'resolved', label: 'Hal qilingan', count: tickets.filter(t => t.status === 'resolved').length }
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tickets List */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900">So'rovlar ro'yxati</h3>
          
          {filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => setSelectedTicket(ticket)}
              className={`bg-white rounded-xl shadow-lg border p-4 cursor-pointer transition-all hover:shadow-xl ${
                selectedTicket?.id === ticket.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 mb-1">{ticket.subject}</h4>
                  <p className="text-sm text-gray-600 mb-2">{ticket.userName} - {ticket.userEmail}</p>
                  <p className="text-sm text-gray-700 line-clamp-2">{ticket.message}</p>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(ticket.status)}`}>
                    {getStatusText(ticket.status)}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(ticket.priority)}`}>
                    {getPriorityText(ticket.priority)}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{new Date(ticket.createdAt).toLocaleDateString('uz-UZ')}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageSquare className="h-3 w-3" />
                  <span>{ticket.responses.length} javob</span>
                </div>
              </div>
            </div>
          ))}

          {filteredTickets.length === 0 && (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {filter === 'all' ? 'Hozircha so\'rovlar yo\'q' : `${getStatusText(filter)} so'rovlar yo'q`}
              </p>
            </div>
          )}
        </div>

        {/* Ticket Details */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          {selectedTicket ? (
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{selectedTicket.subject}</h3>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{selectedTicket.userName}</span>
                    </div>
                    <span className="text-sm text-gray-500">{selectedTicket.userEmail}</span>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(selectedTicket.status)}`}>
                    {getStatusText(selectedTicket.status)}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(selectedTicket.priority)}`}>
                    {getPriorityText(selectedTicket.priority)}
                  </span>
                </div>
              </div>

              {/* Status update buttons */}
              <div className="flex space-x-2 mb-4">
                <button
                  onClick={() => updateTicketStatus(selectedTicket.id, 'in_progress')}
                  className="text-xs bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full hover:bg-yellow-200 transition-colors"
                >
                  Jarayonda
                </button>
                <button
                  onClick={() => updateTicketStatus(selectedTicket.id, 'resolved')}
                  className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full hover:bg-green-200 transition-colors"
                >
                  Hal qilingan
                </button>
                <button
                  onClick={() => updateTicketStatus(selectedTicket.id, 'closed')}
                  className="text-xs bg-gray-100 text-gray-800 px-3 py-1 rounded-full hover:bg-gray-200 transition-colors"
                >
                  Yopiq
                </button>
              </div>

              {/* Original message */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-gray-700">{selectedTicket.message}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(selectedTicket.createdAt).toLocaleString('uz-UZ')}
                </p>
              </div>

              {/* Responses */}
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {selectedTicket.responses.map((response) => (
                  <div
                    key={response.id}
                    className={`p-3 rounded-lg ${
                      response.isAdmin 
                        ? 'bg-blue-50 border-l-4 border-blue-500 ml-4' 
                        : 'bg-gray-50 border-l-4 border-gray-300 mr-4'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        {response.isAdmin ? 'Admin' : response.userName}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(response.createdAt).toLocaleString('uz-UZ')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{response.message}</p>
                  </div>
                ))}
              </div>

              {/* Response form */}
              <div className="border-t pt-4">
                <textarea
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Javobingizni yozing..."
                />
                <button
                  onClick={sendResponse}
                  disabled={!responseMessage.trim()}
                  className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  <Send className="h-4 w-4" />
                  <span>Javob yuborish</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">So'rov tanlang</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSupport;