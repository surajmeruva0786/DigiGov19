import { useState } from 'react';
import { motion } from 'motion/react';
import {
  FileText,
  MessageSquare,
  Baby,
  Wallet,
  Folder,
  CreditCard,
  Heart,
  Star,
  GraduationCap,
  Bell,
  LogOut,
  Search,
  Mic,
  BarChart3,
  Globe,
  MessageSquareText,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { NotificationsPanel } from './NotificationsPanel';

interface CitizenDashboardProps {
  onNavigate: (page: string) => void;
  userName: string;
  onLogout: () => void;
  onToggleChatbot: () => void;
}

export function CitizenDashboard({ onNavigate, userName, onLogout, onToggleChatbot }: CitizenDashboardProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'scheme' as const,
      title: 'New Scholarship Available',
      message: 'PM Scholarship Scheme 2025 applications are now open. Apply before the deadline!',
      time: '2 hours ago',
      read: false,
    },
    {
      id: '2',
      type: 'success' as const,
      title: 'Application Approved',
      message: 'Your education assistance application has been approved. Funds will be disbursed shortly.',
      time: '5 hours ago',
      read: false,
    },
    {
      id: '3',
      type: 'info' as const,
      title: 'Document Verification Pending',
      message: 'Please upload the required documents for your health services application.',
      time: '1 day ago',
      read: false,
    },
    {
      id: '4',
      type: 'warning' as const,
      title: 'Complaint Status Update',
      message: 'Your complaint #12345 has been reviewed and is now in progress.',
      time: '2 days ago',
      read: true,
    },
    {
      id: '5',
      type: 'info' as const,
      title: 'System Maintenance',
      message: 'Scheduled maintenance on Nov 15, 2025 from 2:00 AM to 4:00 AM.',
      time: '3 days ago',
      read: true,
    },
  ]);

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const serviceModules = [
    {
      title: 'Government Schemes',
      description: 'Browse and apply for schemes',
      icon: FileText,
      gradient: 'from-purple-500 to-purple-700',
      page: 'schemes',
    },
    {
      title: 'Complaints',
      description: 'File complaints and track status',
      icon: MessageSquare,
      gradient: 'from-pink-500 to-red-500',
      page: 'complaints',
    },
    {
      title: 'Children',
      description: 'Manage child records & education',
      icon: Baby,
      gradient: 'from-blue-500 to-cyan-500',
      page: 'children',
    },
    {
      title: 'Bill Payments',
      description: 'Pay utility bills securely',
      icon: Wallet,
      gradient: 'from-green-500 to-emerald-500',
      page: 'bill-payments',
    },
    {
      title: 'Documents',
      description: 'Upload and manage documents',
      icon: Folder,
      gradient: 'from-yellow-500 to-pink-500',
      page: 'documents',
    },
    {
      title: 'Digital ID Card',
      description: 'View your digital ID',
      icon: CreditCard,
      gradient: 'from-red-500 to-pink-500',
      page: 'digital-id',
    },
    {
      title: 'Health Services',
      description: 'Blood & organ donation',
      icon: Heart,
      gradient: 'from-red-500 to-orange-500',
      page: 'health',
    },
    {
      title: 'Citizen Feedback',
      description: 'Rate your service experience',
      icon: Star,
      gradient: 'from-purple-500 to-indigo-500',
      page: 'feedback',
    },
    {
      title: 'Education Assistance',
      description: 'Apply for scholarships',
      icon: GraduationCap,
      gradient: 'from-indigo-600 to-purple-700',
      page: 'education',
    },
  ];

  const quickStats = [
    { label: 'Documents', count: 12, icon: FileText, color: 'from-blue-500 to-cyan-500', page: 'documents' },
    { label: 'Complaints', count: '3 Pending', icon: MessageSquare, color: 'from-pink-500 to-red-500', page: 'complaints' },
    { label: 'Applications', count: 5, icon: FileText, color: 'from-purple-500 to-indigo-500', page: 'applications' },
  ];

  return (
    <div className="min-h-screen pt-16 pb-12 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="absolute inset-0 grid-pattern opacity-30" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Navigation Bar */}
        <motion.div
          className="glass-card rounded-2xl p-6 mb-8 shadow-xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <motion.div
                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-white text-xl">DG</span>
              </motion.div>
              <div>
                <h2 className="text-xl">Welcome, {userName}!</h2>
                <p className="text-sm text-gray-500">Citizen Dashboard</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Select defaultValue="en">
                <SelectTrigger className="w-[140px] bg-white/50">
                  <Globe className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">हिंदी</SelectItem>
                  <SelectItem value="bn">বাংলা</SelectItem>
                </SelectContent>
              </Select>

              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover:bg-white/50"
                  onClick={onToggleChatbot}
                >
                  <MessageSquareText className="w-5 h-5" />
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover:bg-white/50"
                  onClick={() => {
                    const event = new CustomEvent('toggleVoiceControl');
                    window.dispatchEvent(event);
                  }}
                  title="Voice Control"
                >
                  <Mic className="w-5 h-5" />
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover:bg-white/50"
                  onClick={() => setNotificationsOpen(true)}
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-gradient-to-r from-red-500 to-pink-500 border-0">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  onClick={onLogout}
                  className="bg-white/50 hover:bg-white"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats Section */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {quickStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              onClick={() => onNavigate(stat.page)}
            >
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm cursor-pointer overflow-hidden group">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                      <p className="text-3xl">{stat.count}</p>
                    </div>
                    <motion.div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-xl`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <stat.icon className="w-8 h-8 text-white" />
                    </motion.div>
                  </div>
                  <Button
                    variant="link"
                    className="mt-4 p-0 h-auto text-blue-600 group-hover:translate-x-2 transition-transform"
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate(stat.page);
                    }}
                  >
                    View All →
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Global Search Section */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Search className="w-6 h-6 text-blue-600" />
                <CardTitle>Search Across All Services</CardTitle>
              </div>
              <CardDescription>
                Search schemes, complaints, documents, and more
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search schemes, complaints, documents..."
                  className="pl-12 pr-12 h-14 text-lg bg-white/50 border-gray-200/50 focus:bg-white"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                >
                  <Mic className="w-5 h-5 text-blue-600" />
                </Button>
              </div>
              <div className="mt-4">
                <Button
                  variant="outline"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 border-0 shadow-lg"
                  onClick={() => onNavigate('analytics')}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View My Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Service Modules Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="mb-6">Service Modules</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceModules.map((module, index) => (
              <motion.div
                key={module.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.05 }}
                whileHover={{ y: -8, scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <div
                  className={`relative rounded-xl shadow-xl cursor-pointer overflow-hidden group h-full bg-gradient-to-br ${module.gradient}`}
                  onClick={() => onNavigate(module.page)}
                >
                  <div className="p-6 relative z-10 h-full flex flex-col">
                    <motion.div
                      className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 shadow-2xl"
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <module.icon className="w-8 h-8 text-white" />
                    </motion.div>
                    <h3 className="text-white mb-2 text-xl">{module.title}</h3>
                    <p className="text-white/80 text-sm flex-1">{module.description}</p>
                    <motion.div
                      className="mt-4 flex items-center text-white group-hover:translate-x-2 transition-transform"
                      whileHover={{ x: 4 }}
                    >
                      <span className="text-sm">Open →</span>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Notifications Panel */}
      <NotificationsPanel
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        onDelete={handleDeleteNotification}
      />
    </div>
  );
}
