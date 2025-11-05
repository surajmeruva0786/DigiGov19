import {
  CreditCard,
  GraduationCap,
  Heart,
  MessageSquare,
  FileText,
  Building2,
  DollarSign,
  Car,
  Home,
  TrendingUp,
  Calendar,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
} from 'lucide-react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Badge } from './ui/badge';
import { AnimatedBackground, FloatingParticles } from './AnimatedBackground';

interface HomePageProps {
  onNavigate: (page: string) => void;
  userName?: string;
}

export function HomePage({ onNavigate, userName = 'Citizen' }: HomePageProps) {
  const quickServices = [
    {
      icon: CreditCard,
      title: 'Digital ID Card',
      description: 'View and manage your digital identification',
      gradient: 'from-blue-500 to-cyan-500',
      page: 'digital-id',
    },
    {
      icon: GraduationCap,
      title: 'Education',
      description: 'Access educational programs and assistance',
      gradient: 'from-green-500 to-emerald-500',
      page: 'education',
    },
    {
      icon: Heart,
      title: 'Health Services',
      description: 'Book appointments and access health records',
      gradient: 'from-red-500 to-pink-500',
      page: 'health',
    },
    {
      icon: MessageSquare,
      title: 'Citizen Feedback',
      description: 'Share your feedback and track submissions',
      gradient: 'from-purple-500 to-violet-500',
      page: 'feedback',
    },
    {
      icon: FileText,
      title: 'Document Services',
      description: 'Request and download official documents',
      gradient: 'from-orange-500 to-amber-500',
      page: 'home',
    },
    {
      icon: Building2,
      title: 'Business Services',
      description: 'Register and manage business operations',
      gradient: 'from-cyan-500 to-blue-500',
      page: 'home',
    },
    {
      icon: DollarSign,
      title: 'Tax Services',
      description: 'File taxes and view payment history',
      gradient: 'from-yellow-500 to-orange-500',
      page: 'home',
    },
    {
      icon: Car,
      title: 'Vehicle Services',
      description: 'Renew registration and access driving records',
      gradient: 'from-indigo-500 to-purple-500',
      page: 'home',
    },
  ];

  const announcements = [
    {
      title: 'New Digital Services Available',
      description: 'We have launched new online services for business registration.',
      date: 'Nov 1, 2025',
      type: 'info',
    },
    {
      title: 'System Maintenance Scheduled',
      description: 'Planned maintenance on Nov 10, 2025 from 2:00 AM - 4:00 AM.',
      date: 'Nov 2, 2025',
      type: 'warning',
    },
  ];

  const recentActivities = [
    { action: 'Submitted feedback', date: '2 days ago', icon: MessageSquare },
    { action: 'Viewed Digital ID Card', date: '1 week ago', icon: CreditCard },
    { action: 'Booked health appointment', date: '2 weeks ago', icon: Heart },
  ];

  const stats = [
    { label: 'Services Used', value: '12', icon: TrendingUp, color: 'from-green-500 to-emerald-500' },
    { label: 'Appointments', value: '3', icon: Calendar, color: 'from-blue-500 to-cyan-500' },
    { label: 'Feedback', value: '2', icon: MessageSquare, color: 'from-purple-500 to-violet-500' },
  ];

  const features = [
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is encrypted and protected',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Access services instantly, 24/7',
    },
    {
      icon: Sparkles,
      title: 'Modern Interface',
      description: 'Intuitive and easy to use',
    },
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
        <AnimatedBackground />
        <FloatingParticles count={30} />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Badge className="mb-6 bg-white/20 text-white border-white/30 backdrop-blur-sm">
                <Sparkles className="w-3 h-3 mr-1" />
                Next-Generation Government Services
              </Badge>
            </motion.div>
            
            <motion.h1
              className="text-white mb-6 text-4xl md:text-5xl lg:text-6xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Welcome back, <span className="bg-gradient-to-r from-cyan-300 to-blue-200 bg-clip-text text-transparent">{userName}</span>!
            </motion.h1>
            
            <motion.p
              className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Access all your government services in one place. Fast, secure, and available 24/7.
            </motion.p>
            
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <Button
                size="lg"
                className="bg-white text-blue-700 hover:bg-blue-50 shadow-xl hover:shadow-2xl transition-all group"
              >
                Explore Services
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
                onClick={() => onNavigate('digital-id')}
              >
                View Digital ID
              </Button>
            </motion.div>

            {/* Feature highlights */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="glass-card p-6 rounded-2xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <feature.icon className="w-8 h-8 text-white mb-3 mx-auto" />
                  <h3 className="text-white mb-2">{feature.title}</h3>
                  <p className="text-blue-100 text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 fill-current text-background">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
          </svg>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Announcements */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="mb-6">Important Announcements</h2>
          <div className="grid gap-4">
            {announcements.map((announcement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.02, x: 4 }}
              >
                <Alert variant={announcement.type === 'warning' ? 'destructive' : 'default'} className="border-l-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>{announcement.title}</AlertTitle>
                  <AlertDescription>
                    {announcement.description}
                    <span className="block text-sm mt-1 opacity-70">{announcement.date}</span>
                  </AlertDescription>
                </Alert>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Access Services */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2>Quick Access Services</h2>
            <Button variant="ghost" className="group">
              View All
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickServices.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <Card
                  className="cursor-pointer hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50 overflow-hidden group relative"
                  onClick={() => onNavigate(service.page)}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
                  <CardHeader>
                    <motion.div
                      className={`w-14 h-14 bg-gradient-to-br ${service.gradient} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <service.icon className="w-7 h-7 text-white" />
                    </motion.div>
                    <CardTitle className="group-hover:text-blue-600 transition-colors">{service.title}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      Access now
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Recent Activity */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your recent interactions with DigiGov services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {recentActivities.map((activity, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center justify-between py-4 px-4 rounded-xl hover:bg-white/50 transition-colors group cursor-pointer"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      whileHover={{ x: 4 }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                          <activity.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p>{activity.action}</p>
                          <p className="text-sm text-gray-500">{activity.date}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        View
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-purple-50">
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="relative overflow-hidden rounded-2xl p-4 glass-card"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="flex items-center gap-4">
                      <motion.div
                        className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <stat.icon className="w-6 h-6 text-white" />
                      </motion.div>
                      <div>
                        <p className="text-sm text-gray-500">{stat.label}</p>
                        <p className="text-2xl">{stat.value}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Popular Services */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2>Popular Services</h2>
            <Button variant="ghost" className="group">
              View All
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Home, title: 'Property Services', description: 'Register property and access records', badge: 'New', gradient: 'from-blue-500 to-cyan-500' },
              { icon: FileText, title: 'Permits & Licenses', description: 'Apply for and renew permits online', badge: 'Popular', gradient: 'from-green-500 to-emerald-500' },
              { icon: DollarSign, title: 'Payments', description: 'Pay bills and manage transactions', gradient: 'from-yellow-500 to-orange-500' },
            ].map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <Card className="border-0 shadow-xl hover:shadow-2xl transition-all overflow-hidden group cursor-pointer">
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <motion.div
                        className={`w-12 h-12 bg-gradient-to-br ${service.gradient} rounded-2xl flex items-center justify-center shadow-lg`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <service.icon className="w-6 h-6 text-white" />
                      </motion.div>
                      {service.badge && (
                        <Badge className={service.badge === 'New' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : ''}>
                          {service.badge}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="group-hover:text-blue-600 transition-colors">{service.title}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 group/btn">
                      Access Service
                      <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
