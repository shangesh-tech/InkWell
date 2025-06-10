'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { format, formatDistanceToNow } from 'date-fns';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

const AdminDashboard = () => {
  const [selectedRange, setSelectedRange] = useState('7d');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  // Handle range change
  const handleRangeChange = (range) => {
    setSelectedRange(range);
  };

  // Format range for display
  const formatRangeDisplay = useCallback((range) => {
    switch (range) {
      case '7d': return 'Week';
      case '30d': return 'Month';
      case '90d': return 'Quarter';
      case '180d': return 'Half Year';
      case '365d': return 'Year';
      default: return 'Week';
    }
  }, []);


  // Fetch analytics data
  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/analytics', {
        params: { range: selectedRange }
      });

      if (response.data?.data) {
        setData(response.data.data);
      } else {
        console.error('Analytics API returned invalid data structure');
      }
    } catch (error) {
      console.error('Analytics API request failed:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [selectedRange]);


  // Format numbers for display
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // Stats configuration
  const stats = data ? [
    {
      title: "Total Posts",
      value: formatNumber(data.stats.posts.current),
      previousValue: formatNumber(data.stats.posts.previous),
      total: formatNumber(data.stats.posts.total),
      change: data.stats.posts.change.toFixed(1) + '%',
      trend: data.stats.posts.change >= 0 ? "up" : "down",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      gradient: "from-gray-800 to-gray-600"
    },
    {
      title: "Subscribers",
      value: formatNumber(data.stats.subscribers.current),
      previousValue: formatNumber(data.stats.subscribers.previous),
      total: formatNumber(data.stats.subscribers.total),
      change: data.stats.subscribers.change.toFixed(1) + '%',
      trend: data.stats.subscribers.change >= 0 ? "up" : "down",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      gradient: "from-gray-700 to-gray-500"
    },
    {
      title: "Page Views",
      value: formatNumber(data.stats.views.current),
      previousValue: formatNumber(data.stats.views.previous),
      total: formatNumber(data.stats.views.total),
      change: data.stats.views.change.toFixed(1) + '%',
      trend: data.stats.views.change >= 0 ? "up" : "down",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      gradient: "from-gray-600 to-gray-400"
    }
  ] : [];

  // Get current date for welcome message
  const getCurrentGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Prepare chart data
  const prepareChartData = (data) => {
    if (!data) return [];

    const { labels } = data.chartData;
    return labels.map(label => {
      const viewData = data.chartData.views.find(v => v._id === label) || { views: 0 };
      const subscriberData = data.chartData.subscribers.find(s => s._id === label) || { subscribers: 0 };
      const date = new Date(label);

      // Use MMM yyyy for year view, MMM d for others
      const dateFormat = selectedRange === '365d' ? 'MMM yyyy' : 'MMM d';

      return {
        date: format(date, dateFormat),
        fullDate: label,
        views: viewData.views,
        subscribers: subscriberData.subscribers
      };
    });
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const date = new Date(payload[0]?.payload.fullDate);
      const dateFormat = selectedRange === '365d' ? 'MMMM yyyy' : 'MMM d, yyyy';

      return (
        <div className="bg-white p-3 shadow-lg border border-gray-200 rounded-lg">
          <p className="font-medium text-gray-900 mb-2">
            {format(date, dateFormat)}
          </p>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#3B82F6]" />
              <span className="text-gray-600">Views:</span>
              <span className="font-medium text-gray-900">{formatNumber(payload[0]?.value)}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#22C55E]" />
              <span className="text-gray-600">Subscribers:</span>
              <span className="font-medium text-gray-900">{formatNumber(payload[1]?.value)}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-lg p-6 shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h2 className="text-xl font-bold">{getCurrentGreeting()}, Admin</h2>
            <p className="text-gray-300 mt-1">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link href="/admin/addProduct" className="bg-white text-gray-900 px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors">
              Create New Post
            </Link>
          </div>
        </div>
      </div>

      {/* Header with Time Range Selector */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Analytics Overview</h1>
          <p className="text-gray-500">Track your blog performance</p>
        </div>

        <div className="inline-flex rounded-md shadow-sm" role="group">
          {['7d', '30d', '90d', '180d', '365d'].map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => handleRangeChange(range)}
              className={`px-4 py-2 text-sm font-medium 
                ${selectedRange === range
                  ? 'bg-black text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
                } 
                ${range === '7d' ? 'rounded-l-md' : range === '365d' ? 'rounded-r-md' : ''} 
                border border-gray-200`}
            >
              {formatRangeDisplay(range)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="relative overflow-hidden bg-white rounded-lg shadow-sm border border-gray-100 transition-all hover:shadow-md hover:translate-y-[-2px]"
          >
            <div className="p-6 relative z-10">
              <div className="flex justify-between items-center mb-4">
                <div className={`bg-gradient-to-br ${stat.gradient} p-3 rounded-lg text-white`}>
                  {stat.icon}
                </div>
                <div className="flex flex-col items-end">
                  <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${stat.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                    <span>{stat.change}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-3 w-3 ${stat.trend === 'up' ? 'rotate-0' : 'rotate-180'}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">vs previous period</div>
                </div>
              </div>
              <h3 className="text-sm text-gray-500 font-medium">{stat.title}</h3>
              <div className="mt-1 space-y-1">
                <p className="text-3xl font-bold">{stat.value}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <span>Previous: {stat.previousValue}</span>
                  <span className="mx-2">•</span>
                  <span>Total: {stat.total}</span>
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-semibold text-lg">Performance Overview</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#3B82F6]"></div>
              <span className="text-sm text-gray-600">Views</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#22C55E]"></div>
              <span className="text-sm text-gray-600">Subscribers</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : data && (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={prepareChartData(data)}
                margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="subscribersGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22C55E" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f0f0f0"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: '#6B7280' }}
                  tickLine={false}
                  axisLine={{ stroke: '#E5E7EB' }}
                  interval="preserveStartEnd"
                  minTickGap={30}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#6B7280' }}
                  tickLine={false}
                  axisLine={{ stroke: '#E5E7EB' }}
                  tickFormatter={formatNumber}
                  domain={[0, 'auto']}
                  allowDecimals={false}
                  interval="preserveStartEnd"
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ stroke: '#9CA3AF', strokeWidth: 1, strokeDasharray: '3 3' }}
                />
                <Line
                  type="monotoneX"
                  dataKey="views"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: '#3B82F6', stroke: '#fff', strokeWidth: 2 }}
                  fill="url(#viewsGradient)"
                />
                <Line
                  type="monotoneX"
                  dataKey="subscribers"
                  stroke="#22C55E"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: '#22C55E', stroke: '#fff', strokeWidth: 2 }}
                  fill="url(#subscribersGradient)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Recent Posts Table */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-semibold text-lg">Recent Posts</h2>
            <Link href="/admin/blogList" className="text-sm text-gray-600 hover:text-black transition-colors flex items-center gap-1">
              View All
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data?.recentPosts.map((post, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{post.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                        {post.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatNumber(post.views || 0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-8">
          {/* Top Categories */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 h-fit">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="font-semibold text-lg">Top Categories</h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {data?.categories.map((category, index) => (
                  <div key={index} className="flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full bg-gray-${800 - (index * 200)}`}></div>
                        <span className="text-sm font-medium">{category._id}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium">{category.count}</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div
                        className={`bg-gray-${800 - (index * 200)} h-1.5 rounded-full`}
                        style={{ width: `${(category.count / data.categories[0].count) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <Link href="/admin/blogList" className="text-sm font-medium text-black hover:underline flex items-center gap-1">
                  Manage Categories
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;