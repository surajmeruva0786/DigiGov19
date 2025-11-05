import { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  FileText,
  MessageSquare,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  Activity,
  BarChart3,
  PieChart,
  Download,
  Filter,
  Users,
  Heart,
  GraduationCap,
  Home,
  Zap,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';

interface AnalyticsProps {
  onNavigate: (page: string) => void;
}

export function Analytics({ onNavigate }: AnalyticsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for charts
  const activityData = [
    { month: 'Jun', applications: 2, complaints: 1, documents: 4 },
    { month: 'Jul', applications: 3, complaints: 2, documents: 3 },
    { month: 'Aug', applications: 4, complaints: 1, documents: 5 },
    { month: 'Sep', applications: 5, complaints: 3, documents: 4 },
    { month: 'Oct', applications: 3, complaints: 2, documents: 6 },
    { month: 'Nov', applications: 5, complaints: 3, documents: 8 },
  ];

  const categoryData = [
    { name: 'Education', value: 35, color: '#8b5cf6' },
    { name: 'Health', value: 25, color: '#ec4899' },
    { name: 'Housing', value: 20, color: '#3b82f6' },
    { name: 'Employment', value: 15, color: '#10b981' },
    { name: 'Other', value: 5, color: '#f59e0b' },
  ];

  const statusData = [
    { name: 'Approved', value: 12, color: '#10b981' },
    { name: 'Pending', value: 5, color: '#f59e0b' },
    { name: 'In Review', value: 3, color: '#3b82f6' },
    { name: 'Rejected', value: 2, color: '#ef4444' },
  ];

  const weeklyActivityData = [
    { day: 'Mon', actions: 5 },
    { day: 'Tue', actions: 8 },
    { day: 'Wed', actions: 12 },
    { day: 'Thu', actions: 7 },
    { day: 'Fri', actions: 10 },
    { day: 'Sat', actions: 3 },
    { day: 'Sun', actions: 2 },
  ];

  const stats = [
    {
      label: 'Total Applications',
      value: '22',
      change: '+12%',
      trend: 'up',
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Active Complaints',
      value: '8',
      change: '-5%',
      trend: 'down',
      icon: MessageSquare,
      color: 'from-pink-500 to-red-500',
      bgColor: 'bg-pink-50',
      iconColor: 'text-pink-600',
    },
    {
      label: 'Documents Uploaded',
      value: '34',
      change: '+18%',
      trend: 'up',
      icon: FileText,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      label: 'Success Rate',
      value: '85%',
      change: '+3%',
      trend: 'up',
      icon: CheckCircle,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
  ];

  const recentActivities = [
    {
      id: '1',
      type: 'application',
      title: 'Scholarship Application Approved',
      description: 'PM Scholarship Scheme 2025',
      time: '2 hours ago',
      icon: GraduationCap,
      color: 'from-purple-500 to-purple-600',
      status: 'success',
    },
    {
      id: '2',
      type: 'complaint',
      title: 'Complaint Status Updated',
      description: 'Water Supply Issue - In Progress',
      time: '5 hours ago',
      icon: AlertCircle,
      color: 'from-blue-500 to-blue-600',
      status: 'info',
    },
    {
      id: '3',
      type: 'document',
      title: 'Document Verified',
      description: 'Income Certificate verified successfully',
      time: '1 day ago',
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
      status: 'success',
    },
    {
      id: '4',
      type: 'health',
      title: 'Health Card Issued',
      description: 'Ayushman Bharat Card activated',
      time: '2 days ago',
      icon: Heart,
      color: 'from-red-500 to-pink-600',
      status: 'success',
    },
    {
      id: '5',
      type: 'application',
      title: 'New Application Submitted',
      description: 'Housing Scheme Application',
      time: '3 days ago',
      icon: Home,
      color: 'from-blue-500 to-cyan-500',
      status: 'pending',
    },
  ];

  const insights = [
    {
      title: 'Quick Response Time',
      description: 'Your applications are processed 30% faster than average',
      icon: Zap,
      color: 'from-yellow-500 to-orange-500',
      trend: 'positive',
    },
    {
      title: 'High Approval Rate',
      description: '85% of your applications have been approved',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
      trend: 'positive',
    },
    {
      title: 'Document Compliance',
      description: 'All your documents meet verification standards',
      icon: CheckCircle,
      color: 'from-blue-500 to-blue-600',
      trend: 'positive',
    },
  ];

  const serviceUsage = [
    { service: 'Education', count: 8, percentage: 36 },
    { service: 'Health', count: 6, percentage: 27 },
    { service: 'Housing', count: 4, percentage: 18 },
    { service: 'Employment', count: 3, percentage: 14 },
    { service: 'Other', count: 1, percentage: 5 },
  ];

  return (
    <div className="min-h-screen pt-16 pb-12 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="absolute inset-0 grid-pattern opacity-30" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button
            variant="ghost"
            onClick={() => onNavigate('dashboard')}
            className="hover:bg-white/50 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="gradient-text text-4xl">My Analytics</h1>
              <p className="text-gray-600 mt-2">Track your activity and service usage insights</p>
            </div>
            <div className="flex items-center gap-3">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-[180px] bg-white/80 backdrop-blur-sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="quarter">Last Quarter</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="bg-white/80 backdrop-blur-sm">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden group hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                      <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                    </div>
                    <Badge
                      className={`${
                        stat.trend === 'up'
                          ? 'bg-green-100 text-green-700 border-green-200'
                          : 'bg-red-100 text-red-700 border-red-200'
                      } border`}
                    >
                      {stat.trend === 'up' ? (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      )}
                      {stat.change}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                  <p className="text-3xl">{stat.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Activity Chart */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  Activity Overview
                </CardTitle>
                <CardDescription>Your service usage over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={activityData}>
                    <defs>
                      <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorComplaints" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorDocuments" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="applications"
                      stroke="#8b5cf6"
                      fillOpacity={1}
                      fill="url(#colorApplications)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="complaints"
                      stroke="#ec4899"
                      fillOpacity={1}
                      fill="url(#colorComplaints)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="documents"
                      stroke="#3b82f6"
                      fillOpacity={1}
                      fill="url(#colorDocuments)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Weekly Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                  Weekly Activity
                </CardTitle>
                <CardDescription>Actions taken this week</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyActivityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="day" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      }}
                    />
                    <Bar dataKey="actions" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Category Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-blue-600" />
                  Service Category Distribution
                </CardTitle>
                <CardDescription>Applications by category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Status Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-green-600" />
                  Application Status
                </CardTitle>
                <CardDescription>Current status breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Insights and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Service Usage */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  Service Usage
                </CardTitle>
                <CardDescription>Top services used</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {serviceUsage.map((service, index) => (
                    <div key={service.service} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">{service.service}</span>
                        <span className="text-gray-500">{service.count} times</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <motion.div
                          className={`h-full bg-gradient-to-r ${
                            index === 0
                              ? 'from-purple-500 to-purple-600'
                              : index === 1
                              ? 'from-pink-500 to-pink-600'
                              : index === 2
                              ? 'from-blue-500 to-blue-600'
                              : index === 3
                              ? 'from-green-500 to-green-600'
                              : 'from-yellow-500 to-yellow-600'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${service.percentage}%` }}
                          transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Key Insights
                </CardTitle>
                <CardDescription>Your performance highlights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {insights.map((insight, index) => (
                    <motion.div
                      key={insight.title}
                      className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${insight.color} flex items-center justify-center flex-shrink-0`}>
                          <insight.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm mb-1">{insight.title}</h4>
                          <p className="text-xs text-gray-600">{insight.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest actions and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 + index * 0.05 }}
                    >
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${activity.color} flex items-center justify-center flex-shrink-0`}>
                        <activity.icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm mb-0.5 truncate">{activity.title}</p>
                        <p className="text-xs text-gray-500 truncate">{activity.description}</p>
                        <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
