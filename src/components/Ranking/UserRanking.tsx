import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, TrendingUp, Star, Crown } from 'lucide-react';

interface RankingUser {
  id: string;
  fullName: string;
  totalScore: number;
  testCount: number;
  averageScore: number;
  rank: number;
  achievements: string[];
}

const UserRanking: React.FC = () => {
  const [rankings, setRankings] = useState<RankingUser[]>([]);
  const [timeFilter, setTimeFilter] = useState<'all' | 'month' | 'week'>('all');

  useEffect(() => {
    // Load and calculate rankings from localStorage
    const loadRankings = () => {
      try {
        const users = JSON.parse(localStorage.getItem('testblok_users') || '[]');
        const results = JSON.parse(localStorage.getItem('testblok_test_results') || '[]');

        const userRankings = users
          .filter((user: any) => user.role === 'student')
          .map((user: any) => {
            const userResults = results.filter((result: any) => result.userId === user.id);
            const totalScore = userResults.reduce((sum: number, result: any) => sum + result.totalScore, 0);
            const averageScore = userResults.length > 0 ? totalScore / userResults.length : 0;

            return {
              id: user.id,
              fullName: user.fullName,
              totalScore,
              testCount: userResults.length,
              averageScore,
              rank: 0,
              achievements: user.achievements || []
            };
          })
          .sort((a: any, b: any) => b.totalScore - a.totalScore)
          .map((user: any, index: number) => ({ ...user, rank: index + 1 }));

        setRankings(userRankings);
      } catch (error) {
        console.error('Error loading rankings:', error);
      }
    };

    loadRankings();
  }, [timeFilter]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-orange-500" />;
      default:
        return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
    if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
    if (rank === 3) return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Foydalanuvchilar reytingi</h2>
          <p className="text-gray-600">Eng yaxshi natija ko'rsatgan abituriyentlar</p>
        </div>
        
        <select
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">Barcha vaqt</option>
          <option value="month">Bu oy</option>
          <option value="week">Bu hafta</option>
        </select>
      </div>

      {/* Top 3 Podium */}
      {rankings.length >= 3 && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-6 text-center">Top 3 o'rinlar</h3>
          <div className="flex items-end justify-center space-x-8">
            {/* 2nd Place */}
            <div className="text-center">
              <div className="bg-gradient-to-r from-gray-300 to-gray-500 w-20 h-16 rounded-t-lg flex items-center justify-center mb-4">
                <Medal className="h-8 w-8 text-white" />
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-bold text-gray-900">{rankings[1]?.fullName}</p>
                <p className="text-sm text-gray-600">{rankings[1]?.totalScore.toFixed(1)} ball</p>
                <p className="text-xs text-gray-500">{rankings[1]?.testCount} test</p>
              </div>
            </div>

            {/* 1st Place */}
            <div className="text-center">
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 w-24 h-20 rounded-t-lg flex items-center justify-center mb-4">
                <Crown className="h-10 w-10 text-white" />
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-200">
                <p className="font-bold text-gray-900">{rankings[0]?.fullName}</p>
                <p className="text-sm text-gray-600">{rankings[0]?.totalScore.toFixed(1)} ball</p>
                <p className="text-xs text-gray-500">{rankings[0]?.testCount} test</p>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="text-center">
              <div className="bg-gradient-to-r from-orange-400 to-orange-600 w-20 h-12 rounded-t-lg flex items-center justify-center mb-4">
                <Award className="h-8 w-8 text-white" />
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="font-bold text-gray-900">{rankings[2]?.fullName}</p>
                <p className="text-sm text-gray-600">{rankings[2]?.totalScore.toFixed(1)} ball</p>
                <p className="text-xs text-gray-500">{rankings[2]?.testCount} test</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Rankings Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  O'rin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Foydalanuvchi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jami ball
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  O'rtacha ball
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Testlar soni
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Yutuqlar
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rankings.map((user) => (
                <tr key={user.id} className={`hover:bg-gray-50 ${user.rank <= 3 ? 'bg-gradient-to-r from-blue-50 to-transparent' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full ${getRankBadge(user.rank)}`}>
                      {getRankIcon(user.rank)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {user.fullName.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                        {user.rank <= 3 && (
                          <div className="text-sm text-gray-500">Top performer</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">{user.totalScore.toFixed(1)}</div>
                    <div className="text-sm text-gray-500">ball</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.averageScore.toFixed(1)}</div>
                    <div className="text-sm text-gray-500">o'rtacha</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.testCount}</div>
                    <div className="text-sm text-gray-500">test</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-1">
                      {user.achievements.slice(0, 3).map((achievement, index) => (
                        <Star key={index} className="h-4 w-4 text-yellow-500" />
                      ))}
                      {user.achievements.length > 3 && (
                        <span className="text-xs text-gray-500">+{user.achievements.length - 3}</span>
                      )}
                      {user.achievements.length === 0 && (
                        <span className="text-xs text-gray-400">Yo'q</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {rankings.length === 0 && (
            <div className="text-center py-8">
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Hozircha reyting ma'lumotlari yo'q</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserRanking;