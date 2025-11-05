import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  Gift,
  FileText,
  Clock,
  Trash2,
  Check
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { useState } from 'react';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'scheme';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDelete: (id: string) => void;
}

export function NotificationsPanel({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
}: NotificationsPanelProps) {
  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      case 'scheme':
        return <Gift className="w-5 h-5 text-purple-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100';
      case 'warning':
        return 'bg-orange-100';
      case 'scheme':
        return 'bg-purple-100';
      default:
        return 'bg-blue-100';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[480px] bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <motion.div
                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Bell className="w-5 h-5 text-white" />
                  </motion.div>
                  <div>
                    <h2 className="text-xl">Notifications</h2>
                    <p className="text-sm text-gray-500">
                      {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="hover:bg-white/50"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onMarkAllAsRead}
                  className="w-full bg-white/50 hover:bg-white"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Mark all as read
                </Button>
              )}
            </div>

            {/* Notifications List */}
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-3">
                {notifications.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                      <Bell className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500">No notifications yet</p>
                    <p className="text-sm text-gray-400 mt-1">
                      We'll notify you when something important happens
                    </p>
                  </motion.div>
                ) : (
                  notifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`group relative p-4 rounded-xl border transition-all cursor-pointer ${
                        notification.read
                          ? 'bg-white hover:bg-gray-50 border-gray-200'
                          : 'bg-blue-50/50 hover:bg-blue-50 border-blue-200'
                      }`}
                      onClick={() => !notification.read && onMarkAsRead(notification.id)}
                    >
                      <div className="flex gap-3">
                        <div className={`w-10 h-10 rounded-lg ${getIconBg(notification.type)} flex items-center justify-center flex-shrink-0`}>
                          {getIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="text-sm truncate">{notification.title}</h4>
                            {!notification.read && (
                              <Badge className="bg-blue-600 hover:bg-blue-700 px-2 py-0 text-xs">
                                New
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              {notification.time}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDelete(notification.id);
                              }}
                              className="opacity-0 group-hover:opacity-100 transition-opacity h-7 px-2"
                            >
                              <Trash2 className="w-3 h-3 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </ScrollArea>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-4 border-t bg-gray-50">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={onClose}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  View All Notifications
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
