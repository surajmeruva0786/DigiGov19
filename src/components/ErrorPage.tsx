import { AlertTriangle, Home, ArrowLeft, Search, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { AnimatedBackground } from './AnimatedBackground';

interface ErrorPageProps {
  errorCode?: '404' | '500';
  onNavigate: (page: string) => void;
}

export function ErrorPage({ errorCode = '404', onNavigate }: ErrorPageProps) {
  const is404 = errorCode === '404';

  const quickLinks = [
    { label: 'Digital ID Card', page: 'digital-id' },
    { label: 'Education Services', page: 'education' },
    { label: 'Health Services', page: 'health' },
    { label: 'Submit Feedback', page: 'feedback' },
  ];

  return (
    <div className="min-h-screen pt-16 pb-12 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50" />
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <AnimatedBackground />

      <motion.div
        className="max-w-2xl w-full relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          <div className="p-8 sm:p-12 text-center">
            {/* Error Icon */}
            <motion.div
              className="flex justify-center mb-6"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, duration: 0.6, type: 'spring' }}
            >
              <div className={`w-24 h-24 rounded-3xl flex items-center justify-center shadow-2xl ${
                is404 
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                  : 'bg-gradient-to-br from-red-500 to-red-600'
              }`}>
                <AlertTriangle className="w-12 h-12 text-white" />
              </div>
            </motion.div>

            {/* Error Code */}
            <motion.div
              className="mb-4"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <span className={`text-8xl bg-clip-text text-transparent bg-gradient-to-r ${
                is404 
                  ? 'from-blue-600 to-cyan-600' 
                  : 'from-red-600 to-pink-600'
              }`}>
                {errorCode}
              </span>
            </motion.div>

            {/* Error Message */}
            <motion.h1
              className="mb-4 gradient-text"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {is404 ? 'Page Not Found' : 'Server Error'}
            </motion.h1>
            <motion.p
              className="text-gray-600 mb-8 max-w-md mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {is404 
                ? "We couldn't find the page you're looking for. It may have been moved or deleted."
                : 'Something went wrong on our end. Our team has been notified and is working to fix the issue.'
              }
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-3 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="lg"
                  onClick={() => onNavigate('home')}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Go to Homepage
                </Button>
              </motion.div>
              {is404 && (
                <>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      size="lg"
                      variant="outline"
                      onClick={() => window.history.back()}
                      className="bg-white/50 hover:bg-white"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Go Back
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      size="lg"
                      variant="outline"
                      onClick={() => onNavigate('search')}
                      className="bg-white/50 hover:bg-white"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </Button>
                  </motion.div>
                </>
              )}
            </motion.div>

            {/* Quick Links */}
            <motion.div
              className="mt-12 pt-8 border-t border-gray-200/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <p className="text-sm text-gray-600 mb-4">Quick Links</p>
              <div className="flex flex-wrap justify-center gap-4">
                {quickLinks.map((link, index) => (
                  <motion.button
                    key={link.page}
                    onClick={() => onNavigate(link.page)}
                    className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {link.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Help Section */}
            <motion.div
              className="mt-8 p-6 glass-card rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-sm text-gray-700 mb-2">
                    Need help? Contact our support team
                  </p>
                  <div className="space-y-1">
                    <a href="mailto:support@digigov.gov" className="text-sm text-blue-600 hover:underline block">
                      support@digigov.gov
                    </a>
                    <a href="tel:1-800-DIGIGOV" className="text-sm text-blue-600 hover:underline block">
                      1-800-DIGIGOV
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
