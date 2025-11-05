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
  Baby,
  FolderOpen,
  CreditCard,
  Star,
  Building2,
  XCircle,
  Zap,
  Target,
  Award,
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
} from 'recharts';

interface OfficialAnalyticsProps {
  onBack: () => void;
  officialName: string;
  department: string;
}

export function OfficialAnalytics({ onBack, officialName, department }: OfficialAnalyticsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for government analytics
  const userGrowthData = [
    { month: 'Jun', users: 145, applications: 89, complaints: 34 },
    { month: 'Jul', users: 178, applications: 112, complaints: 28 },
    { month: 'Aug', users: 210, applications: 145, complaints: 41 },
    { month: 'Sep', users: 256, applications: 178, complaints: 35 },
    { month: 'Oct', users: 298, applications: 203, complaints: 29 },
    { month: 'Nov', users: 342, applications: 234, complaints: 32 },
  ];

  const departmentPerformanceData = [
    { department: 'Education', processed: 85, pending: 15, avgTime: 3.2 },
    { department: 'Health', processed: 92, pending: 8, avgTime: 2.5 },
    { department: 'Housing', processed: 78, pending: 22, avgTime: 4.1 },
    { department: 'Water', processed: 88, pending: 12, avgTime: 2.8 },
    { department: 'Electricity', processed: 95, pending: 5, avgTime: 1.9 },
    { department: 'Transport', processed: 82, pending: 18, avgTime: 3.5 },
  ];

  const applicationStatusData = [
    { name: 'Approved', value: 234, color: '#10b981' },
    { name: 'Pending', value: 87, color: '#f59e0b' },
    { name: 'In Review', value: 45, color: '#3b82f6' },
    { name: 'Rejected', value: 23, color: '#ef4444' },
  ];

  const complaintPriorityData = [
    { priority: 'High', count: 23, resolved: 18, pending: 5 },
    { priority: 'Medium', count: 45, resolved: 38, pending: 7 },
    { priority: 'Low', count: 32, resolved: 30, pending: 2 },
  ];

  const schemeApplicationData = [
    { name: 'PM Awas Yojana', value: 45, color: '#8b5cf6' },
    { name: 'Ayushman Bharat', value: 38, color: '#ec4899' },
    { name: 'Digital India', value: 28, color: '#3b82f6' },
    { name: 'Skill India', value: 22, color: '#10b981' },
    { name: 'PM Kisan', value: 18, color: '#f59e0b' },
    { name: 'Others', value: 15, color: '#6b7280' },
  ];

  const serviceUsageData = [
    { service: 'Digital ID', users: 342, satisfaction: 4.5 },
    { service: 'Bill Payment', users: 298, satisfaction: 4.7 },
    { service: 'Complaints', users: 256, satisfaction: 4.2 },
    { service: 'Education', users: 234, satisfaction: 4.6 },
    { service: 'Health', users: 210, satisfaction: 4.8 },
    { service: 'Documents', users: 189, satisfaction: 4.4 },
  ];

  const weeklyActivityData = [
    { day: 'Mon', signups: 12, applications: 28, complaints: 5, documents: 45 },
    { day: 'Tue', signups: 15, applications: 35, complaints: 8, documents: 52 },
    { day: 'Wed', signups: 18, applications: 42, complaints: 6, documents: 48 },
    { day: 'Thu', signups: 14, applications: 31, complaints: 7, documents: 41 },
    { day: 'Fri', signups: 20, applications: 45, complaints: 4, documents: 56 },
    { day: 'Sat', signups: 8, applications: 18, complaints: 3, documents: 22 },
    { day: 'Sun', signups: 5, applications: 12, complaints: 2, documents: 15 },
  ];

  const performanceMetricsData = [
    { metric: 'Response Time', value: 92, fullMark: 100 },
    { metric: 'Approval Rate', value: 85, fullMark: 100 },
    { metric: 'User Satisfaction', value: 88, fullMark: 100 },
    { metric: 'Processing Speed', value: 78, fullMark: 100 },
    { metric: 'Document Quality', value: 95, fullMark: 100 },
    { metric: 'Resolution Rate', value: 82, fullMark: 100 },
  ];

  const stats = [
    {
      label: 'Total Users',
      value: '342',
      change: '+15%',
      trend: 'up',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      description: 'Active users',
    },
    {
      label: 'Applications',
      value: '234',
      change: '+12%',
      trend: 'up',
      icon: FileText,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      description: 'This month',
    },
    {
      label: 'Active Complaints',
      value: '32',
      change: '-8%',
      trend: 'down',
      icon: MessageSquare,
      color: 'from-pink-500 to-red-500',
      bgColor: 'bg-pink-50',
      iconColor: 'text-pink-600',
      description: 'Pending resolution',
    },
    {
      label: 'Success Rate',
      value: '87%',
      change: '+5%',
      trend: 'up',
      icon: CheckCircle,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      description: 'Overall performance',
    },
    {
      label: 'Avg Response Time',
      value: '2.8d',
      change: '-12%',
      trend: 'down',
      icon: Clock,
      color: 'from-cyan-500 to-blue-500',
      bgColor: 'bg-cyan-50',
      iconColor: 'text-cyan-600',
      description: 'Days',
    },
    {
      label: 'Documents Verified',
      value: '456',
      change: '+18%',
      trend: 'up',
      icon: FolderOpen,
      color: 'from-indigo-500 to-purple-500',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      description: 'This month',
    },
    {
      label: 'Avg Rating',
      value: '4.6/5',
      change: '+0.3',
      trend: 'up',
      icon: Star,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
      description: 'User satisfaction',
    },
    {
      label: 'Bills Processed',
      value: '189',
      change: '+22%',
      trend: 'up',
      icon: CreditCard,
      color: 'from-teal-500 to-green-500',
      bgColor: 'bg-teal-50',
      iconColor: 'text-teal-600',
      description: 'This month',
    },
  ];

  const departmentStats = [
    { name: 'Education', icon: GraduationCap, count: 145, color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-50' },
    { name: 'Health', icon: Heart, count: 123, color: 'from-red-500 to-pink-600', bgColor: 'bg-red-50' },
    { name: 'Housing', icon: Building2, count: 98, color: 'from-blue-500 to-cyan-500', bgColor: 'bg-blue-50' },
    { name: 'Children', icon: Baby, count: 67, color: 'from-pink-500 to-rose-500', bgColor: 'bg-pink-50' },
  ];

  const topPerformers = [
    { name: 'Dr. Suresh Kumar', dept: 'Health', processed: 156, rating: 4.9, avatar: '👨‍⚕️' },
    { name: 'Prof. Anita Desai', dept: 'Education', processed: 142, rating: 4.8, avatar: '👩‍🏫' },
    { name: 'Eng. Vikram Singh', dept: 'Infrastructure', processed: 134, rating: 4.7, avatar: '👨‍💼' },
    { name: 'Ms. Priya Sharma', dept: 'Social Welfare', processed: 128, rating: 4.8, avatar: '👩‍💼' },
  ];

  const recentActions = [
    {
      id: '1',
      type: 'approval',
      action: 'Scheme Application Approved',
      details: 'PM Awas Yojana - Rajesh Kumar',
      time: '5 min ago',
      icon: CheckCircle,
      color: 'from-green-500 to-emerald-500',
    },
    {
      id: '2',
      type: 'complaint',
      action: 'Complaint Status Updated',
      details: 'Water Supply - In Progress',
      time: '15 min ago',
      icon: MessageSquare,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: '3',
      type: 'document',
      action: 'Document Verified',
      details: 'Income Certificate - Priya Sharma',
      time: '1 hour ago',
      icon: FolderOpen,
      color: 'from-purple-500 to-purple-600',
    },
    {
      id: '4',
      type: 'rejection',
      action: 'Application Rejected',
      details: 'Skill India - Insufficient Documents',
      time: '2 hours ago',
      icon: XCircle,
      color: 'from-red-500 to-pink-600',
    },
  ];

  const alerts = [
    {
      id: '1',
      type: 'urgent',
      title: 'High Priority Complaints',
      message: '5 complaints require immediate attention',
      icon: AlertCircle,
      color: 'from-red-500 to-pink-600',
      bgColor: 'bg-red-50',
    },
    {
      id: '2',
      type: 'warning',
      title: 'Pending Verifications',
      message: '23 documents awaiting verification',
      icon: Clock,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50',
    },
    {
      id: '3',
      type: 'info',
      title: 'Performance Target',
      message: '87% completion - On track for this month',
      icon: Target,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
    },
  ];

  const COLORS = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#6b7280'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700 shadow-lg">
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={onBack}
                className="text-white hover:bg-slate-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="h-8 w-px bg-slate-600" />
              <div>
                <h1 className="text-white text-xl">Analytics Dashboard</h1>
                <p className="text-slate-300 text-sm">
                  {department} Department - {officialName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-[180px] bg-slate-700 text-white border-slate-600">
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
              <Button variant="outline" className="bg-slate-700 text-white border-slate-600 hover:bg-slate-600">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto px-6 py-6">
        {/* Alerts Section */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {alerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={`border-0 shadow-lg ${alert.bgColor} overflow-hidden`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${alert.color} flex items-center justify-center flex-shrink-0`}>
                      <alert.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium mb-1">{alert.title}</h3>
                      <p className="text-sm text-gray-600">{alert.message}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 + index * 0.03 }}
            >
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden group hover:shadow-xl transition-all">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-11 h-11 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                      <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
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
                  <p className="text-sm text-gray-500 mb-0.5">{stat.label}</p>
                  <p className="text-2xl mb-1">{stat.value}</p>
                  <p className="text-xs text-gray-400">{stat.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white shadow-md mb-6">
            <TabsTrigger value="overview">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="performance">
              <Activity className="w-4 h-4 mr-2" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="departments">
              <Building2 className="w-4 h-4 mr-2" />
              Departments
            </TabsTrigger>
            <TabsTrigger value="insights">
              <Target className="w-4 h-4 mr-2" />
              Insights
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* User Growth and Weekly Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <motion.div
                className="lg:col-span-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      User Growth & Activity Trends
                    </CardTitle>
                    <CardDescription>User registrations and service usage over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                      <ComposedChart data={userGrowthData}>
                        <defs>
                          <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
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
                          dataKey="users"
                          stroke="#8b5cf6"
                          fillOpacity={1}
                          fill="url(#colorUsers)"
                          strokeWidth={3}
                        />
                        <Bar dataKey="applications" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                        <Line type="monotone" dataKey="complaints" stroke="#ec4899" strokeWidth={3} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-purple-600" />
                      Department Stats
                    </CardTitle>
                    <CardDescription>Service-wise breakdown</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {departmentStats.map((dept, index) => (
                        <motion.div
                          key={dept.name}
                          className={`p-4 rounded-xl ${dept.bgColor} border border-gray-200`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + index * 0.05 }}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${dept.color} flex items-center justify-center`}>
                              <dept.icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-500">{dept.name}</p>
                              <p className="text-2xl">{dept.count}</p>
                            </div>
                            <TrendingUp className="w-5 h-5 text-green-600" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="w-5 h-5 text-blue-600" />
                      Application Status Distribution
                    </CardTitle>
                    <CardDescription>Current application statuses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPieChart>
                        <Pie
                          data={applicationStatusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {applicationStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="w-5 h-5 text-purple-600" />
                      Popular Schemes
                    </CardTitle>
                    <CardDescription>Applications by scheme type</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPieChart>
                        <Pie
                          data={schemeApplicationData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {schemeApplicationData.map((entry, index) => (
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

            {/* Weekly Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-green-600" />
                    Weekly Activity Breakdown
                  </CardTitle>
                  <CardDescription>Daily activity metrics for the current week</CardDescription>
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
                      <Legend />
                      <Bar dataKey="signups" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="applications" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="complaints" fill="#ec4899" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="documents" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-blue-600" />
                      Performance Metrics
                    </CardTitle>
                    <CardDescription>Overall performance indicators</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                      <RadarChart data={performanceMetricsData}>
                        <PolarGrid stroke="#e5e7eb" />
                        <PolarAngleAxis dataKey="metric" stroke="#6b7280" />
                        <PolarRadiusAxis stroke="#6b7280" />
                        <Radar
                          name="Performance"
                          dataKey="value"
                          stroke="#8b5cf6"
                          fill="#8b5cf6"
                          fillOpacity={0.5}
                        />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-pink-600" />
                      Complaint Resolution
                    </CardTitle>
                    <CardDescription>Priority-wise complaint handling</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart data={complaintPriorityData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis type="number" stroke="#6b7280" />
                        <YAxis dataKey="priority" type="category" stroke="#6b7280" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: 'none',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                          }}
                        />
                        <Legend />
                        <Bar dataKey="resolved" fill="#10b981" stackId="a" radius={[0, 4, 4, 0]} />
                        <Bar dataKey="pending" fill="#f59e0b" stackId="a" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Service Usage */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    Service Usage & Satisfaction
                  </CardTitle>
                  <CardDescription>User engagement and satisfaction scores</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {serviceUsageData.map((service, index) => (
                      <div key={service.service} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="font-medium">{service.service}</span>
                            <Badge variant="outline">{service.users} users</Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{service.satisfaction}</span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                          <motion.div
                            className={`h-full bg-gradient-to-r ${
                              index === 0
                                ? 'from-purple-500 to-purple-600'
                                : index === 1
                                ? 'from-blue-500 to-blue-600'
                                : index === 2
                                ? 'from-pink-500 to-pink-600'
                                : index === 3
                                ? 'from-green-500 to-green-600'
                                : index === 4
                                ? 'from-red-500 to-red-600'
                                : 'from-yellow-500 to-yellow-600'
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${(service.users / 342) * 100}%` }}
                            transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Departments Tab */}
          <TabsContent value="departments" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    Department Performance
                  </CardTitle>
                  <CardDescription>Processing efficiency across departments</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={departmentPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="department" stroke="#6b7280" />
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
                      <Bar dataKey="processed" fill="#10b981" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="pending" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            {/* Top Performers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-600" />
                    Top Performing Officials
                  </CardTitle>
                  <CardDescription>Highest rated government officials this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {topPerformers.map((performer, index) => (
                      <motion.div
                        key={performer.name}
                        className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + index * 0.05 }}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl">
                            {performer.avatar}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium mb-1">{performer.name}</h4>
                            <p className="text-sm text-gray-600 mb-2">{performer.dept}</p>
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="bg-blue-50">
                                {performer.processed} processed
                              </Badge>
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-medium">{performer.rating}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-blue-600" />
                      Recent Actions
                    </CardTitle>
                    <CardDescription>Latest administrative activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActions.map((action, index) => (
                        <motion.div
                          key={action.id}
                          className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center flex-shrink-0`}>
                            <action.icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium mb-0.5">{action.action}</p>
                            <p className="text-sm text-gray-600 mb-1">{action.details}</p>
                            <p className="text-xs text-gray-400">{action.time}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Key Insights */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      Key Insights
                    </CardTitle>
                    <CardDescription>Performance highlights and recommendations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <motion.div
                        className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium mb-1">Excellent Response Time</h4>
                            <p className="text-sm text-gray-600">
                              Your department is processing applications 25% faster than average
                            </p>
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.05 }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                            <TrendingUp className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium mb-1">High Approval Rate</h4>
                            <p className="text-sm text-gray-600">
                              87% of applications are being approved - above target of 80%
                            </p>
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        className="p-4 rounded-xl bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                            <AlertCircle className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium mb-1">Document Quality Check</h4>
                            <p className="text-sm text-gray-600">
                              5 documents require re-verification due to quality issues
                            </p>
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.15 }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                            <Star className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium mb-1">User Satisfaction</h4>
                            <p className="text-sm text-gray-600">
                              4.6/5 average rating from citizens - excellent performance
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
