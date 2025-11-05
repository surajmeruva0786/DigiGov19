import { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle, Sparkles, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { AnimatedBackground, FloatingParticles } from './AnimatedBackground';

interface ForgotPasswordProps {
  onNavigate: (page: string) => void;
}

export function ForgotPassword({ onNavigate }: ForgotPasswordProps) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    setIsSubmitted(true);
  };

  const handleResend = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50" />
        <div className="absolute inset-0 grid-pattern opacity-30" />
        
        <motion.div
          className="max-w-md w-full relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Back Button */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Button
              variant="ghost"
              onClick={() => onNavigate('login')}
              className="hover:bg-white/50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Button>
          </motion.div>

          {/* Logo and Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="flex justify-center mb-4">
              <motion.div
                className="w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                }}
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.8 }}
              >
                <Sparkles className="w-8 h-8 text-white" />
              </motion.div>
            </div>
            <h1 className="mb-2 gradient-text">Reset Password</h1>
            <p className="text-gray-600">
              {isSubmitted 
                ? 'Check your email for reset instructions' 
                : 'Enter your email to reset your password'}
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Forgot Your Password?</CardTitle>
                    <CardDescription>
                      We'll send you instructions to reset your password
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="your.email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10 bg-white/50 border-gray-200/50 focus:bg-white transition-all"
                            required
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Enter the email address associated with your account
                        </p>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <Button
                          type="submit"
                          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all"
                          size="lg"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <div className="flex items-center gap-2">
                              <motion.div
                                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              />
                              Sending...
                            </div>
                          ) : (
                            'Send Reset Instructions'
                          )}
                        </Button>
                      </motion.div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
                  <CardContent className="pt-6">
                    <div className="text-center space-y-6">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="flex justify-center"
                      >
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-xl">
                          <CheckCircle className="w-10 h-10 text-white" />
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <h3 className="text-2xl text-gray-900 mb-2">Email Sent!</h3>
                        <p className="text-gray-600 mb-1">
                          We've sent password reset instructions to:
                        </p>
                        <p className="text-blue-600 mb-4">{email}</p>
                        <p className="text-sm text-gray-500">
                          Please check your inbox and follow the instructions to reset your password.
                        </p>
                      </motion.div>

                      <motion.div
                        className="p-4 bg-blue-50 rounded-xl border border-blue-100"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        <p className="text-sm text-blue-900">
                          <strong>Didn't receive the email?</strong>
                        </p>
                        <p className="text-xs text-blue-700 mt-1">
                          Check your spam folder or try resending the instructions
                        </p>
                      </motion.div>

                      <motion.div
                        className="space-y-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                      >
                        <Button
                          onClick={handleResend}
                          variant="outline"
                          className="w-full border-blue-200 hover:bg-blue-50"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <div className="flex items-center gap-2">
                              <motion.div
                                className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              />
                              Resending...
                            </div>
                          ) : (
                            'Resend Email'
                          )}
                        </Button>
                        
                        <Button
                          onClick={() => onNavigate('login')}
                          variant="ghost"
                          className="w-full"
                        >
                          Return to Login
                        </Button>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Help Section */}
          <motion.div
            className="mt-6 p-6 glass-card rounded-2xl border border-blue-200/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-blue-900 mb-1">Need Help?</p>
                <p className="text-xs text-blue-800">
                  If you're having trouble resetting your password, please contact our support team for assistance.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Side - Branding */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden">
        <AnimatedBackground />
        <FloatingParticles count={40} />
        
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <h1 className="text-white mb-4 text-5xl">
                Secure Account Recovery
              </h1>
            </motion.div>
            
            <motion.p
              className="text-xl text-blue-100 mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Your account security is our top priority. Follow the simple steps to regain access to your account.
            </motion.p>
            
            <div className="space-y-6">
              {[
                { text: 'Secure email verification', delay: 0.6 },
                { text: 'Quick password reset process', delay: 0.7 },
                { text: '24/7 support assistance', delay: 0.8 },
              ].map((feature) => (
                <motion.div
                  key={feature.text}
                  className="flex items-center gap-4 group"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: feature.delay }}
                >
                  <motion.div
                    className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 border border-white/30"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <CheckCircle className="w-6 h-6 text-white" />
                  </motion.div>
                  <p className="text-blue-100 text-lg group-hover:text-white transition-colors">{feature.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
