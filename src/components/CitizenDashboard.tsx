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
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
