import { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, Shield, Sparkles, Check, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { AnimatedBackground, FloatingParticles } from './AnimatedBackground';

interface LoginProps {
  onLogin: () => void;
  onNavigate: (page: string) => void;
}

export function Login({ onLogin, onNavigate }: LoginProps) {
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  const features = [
    { text: 'Secure digital identification', delay: 0.6 },
    { text: '24/7 access to services', delay: 0.7 },
    { text: 'Fast and easy applications', delay: 0.8 },
  ];

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
              onClick={() => onNavigate('home')}
              className="hover:bg-white/50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
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
            <h1 className="mb-2 gradient-text">Citizen Login</h1>
            <p className="text-gray-600">
              Access your government services
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Sign In with Email</CardTitle>
                <CardDescription>
                  Enter your email and password
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Label htmlFor="loginEmail">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="loginEmail"
                        type="email"
                        placeholder="your.email@example.com"
                        className="pl-10 bg-white/50 border-gray-200/50 focus:bg-white transition-all"
                        required
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Label htmlFor="loginPassword">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="loginPassword"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        className="pl-10 pr-10 bg-white/50 border-gray-200/50 focus:bg-white transition-all"
                        required
                      />
                      <motion.button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </motion.button>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-center justify-between"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="flex items-center space-x-2">
                      <Checkbox id="remember" />
                      <label htmlFor="remember" className="text-sm cursor-pointer">
                        Remember me
                      </label>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => onNavigate('forgot-password')}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all"
                      size="lg"
                    >
                      Sign In
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Registration Link */}
          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={() => onNavigate('register')}
                className="text-blue-600 hover:underline"
              >
                Register Now
              </button>
            </p>
          </motion.div>

          {/* Security Notice */}
          <motion.div
            className="mt-6 p-6 glass-card rounded-2xl border border-blue-200/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-blue-900 mb-1">Secure Access</p>
                <p className="text-xs text-blue-800">
                  Your data is protected with industry-standard encryption.
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
                Digital Government Services
              </h1>
            </motion.div>
            
            <motion.p
              className="text-xl text-blue-100 mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Access all government services in one secure, convenient platform.
            </motion.p>
            
            <div className="space-y-6">
              {features.map((feature, index) => (
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
                    <Check className="w-6 h-6 text-white" />
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
