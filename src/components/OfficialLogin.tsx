import { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Mail, Lock, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner@2.0.3';

interface OfficialLoginProps {
  onLogin: (officialName: string, department: string) => void;
  onBack: () => void;
  onForgotPassword?: () => void;
}

export function OfficialLogin({ onLogin, onBack, onForgotPassword }: OfficialLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Valid government email domains
  const validDomains = ['gov.in', 'nic.in', 'ernet.in'];

  const validateGovernmentEmail = (email: string): boolean => {
    const domain = email.split('@')[1];
    return validDomains.some(validDomain => domain?.endsWith(validDomain));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if password is provided
    if (!password || password.length < 4) {
      toast.error('Please enter a valid password (minimum 4 characters)');
      return;
    }

    // Validate government email
    if (!validateGovernmentEmail(email)) {
      toast.error('Please use a valid government email address (.gov.in, .nic.in, or .ernet.in)');
      return;
    }

    setIsLoading(true);

    try {
      // Import Firebase functions
      const { loginOfficial, getOfficialProfile } = await import('../firebase');

      // Attempt to login
      const loginResult = await loginOfficial(email, password);

      if (!loginResult.success) {
        toast.error(loginResult.message || 'Login failed');
        setIsLoading(false);
        return;
      }

      // Fetch official profile
      const profileResult = await getOfficialProfile(loginResult.data.uid);

      if (!profileResult.success) {
        toast.error('Failed to fetch official profile');
        setIsLoading(false);
        return;
      }

      const profile = profileResult.data;
      const name = profile.name || email.split('@')[0];
      const department = profile.department || 'DigiGov Official';

      // Success - call onLogin with real data
      onLogin(name, department);
      toast.success('Successfully logged in to Official Portal');

    } catch (error) {
      console.error('Login error:', error);
      toast.error('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Light Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50" />
      <div className="absolute inset-0 grid-pattern opacity-30" />

      {/* Animated Blobs */}
      <motion.div
        className="absolute top-20 left-20 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl"
        animate={{
          x: [0, -100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            onClick={onBack}
            className="hover:bg-white/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Role Selection
          </Button>
        </motion.div>

        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="mx-auto mb-6"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg">
                <Shield className="w-10 h-10 text-white" />
              </div>
            </motion.div>
            <CardTitle className="text-gray-900 text-3xl mb-2">Official Portal</CardTitle>
            <CardDescription className="text-gray-600">
              Government Officials & Administrators
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Info Banner */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-blue-50 border border-blue-200 rounded-lg p-4"
              >
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <p className="text-sm text-blue-900">
                      Use your official government email address (.gov.in, .nic.in, or .ernet.in) to access the portal.
                    </p>
                    <p className="text-xs text-blue-700">
                      <strong>Demo:</strong> Use <code className="bg-blue-100 px-1.5 py-0.5 rounded text-blue-800">manish@gov.in</code> with password <code className="bg-blue-100 px-1.5 py-0.5 rounded text-blue-800">qwerty</code>
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-2"
              >
                <Label htmlFor="email" className="text-gray-700">
                  Official Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="official@gov.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 bg-white/50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:bg-white"
                  />
                </div>
              </motion.div>

              {/* Password Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-2"
              >
                <Label htmlFor="password" className="text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 bg-white/50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:bg-white"
                  />
                </div>
              </motion.div>

              {/* Forgot Password Link */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-right"
              >
                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Forgot Password?
                </button>
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg py-6"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Authenticating...
                    </div>
                  ) : (
                    <>
                      <Shield className="w-5 h-5 mr-2" />
                      Access Official Portal
                    </>
                  )}
                </Button>
              </motion.div>

              {/* Security Notice */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="text-center text-xs text-gray-500 pt-4"
              >
                <p>
                  This is a secure government portal. Unauthorized access is strictly prohibited
                  and will be prosecuted under applicable laws.
                </p>
              </motion.div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 text-center text-sm text-gray-600"
        >
          <p>© 2025 DigiGov - Digital India Initiative</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
