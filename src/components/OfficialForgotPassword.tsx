import { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle, Shield, AlertCircle, Phone, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface OfficialForgotPasswordProps {
  onBack: () => void;
}

export function OfficialForgotPassword({ onBack }: OfficialForgotPasswordProps) {
  const [step, setStep] = useState<'email' | 'verification' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Valid government email domains
  const validDomains = ['gov.in', 'nic.in', 'ernet.in'];

  const validateGovernmentEmail = (email: string): boolean => {
    const domain = email.split('@')[1];
    return validDomains.some(validDomain => domain?.endsWith(validDomain));
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateGovernmentEmail(email)) {
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLoading(false);
    setStep('verification');
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    setStep('success');
  };

  const handleResend = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Light Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50" />
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
        className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl"
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
            Back to Official Login
          </Button>
        </motion.div>

        {/* Logo and Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="flex justify-center mb-4">
            <motion.div
              className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg"
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.8 }}
            >
              <Shield className="w-10 h-10 text-white" />
            </motion.div>
          </div>
          <h1 className="gradient-text text-3xl mb-2">Official Password Reset</h1>
          <p className="text-gray-600">
            {step === 'email' && 'Verify your official credentials'}
            {step === 'verification' && 'Enter the verification code'}
            {step === 'success' && 'Password reset instructions sent'}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Step 1: Email and Credentials */}
          {step === 'email' && (
            <motion.div
              key="email"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-gray-900">Verify Your Identity</CardTitle>
                  <CardDescription>
                    Enter your official credentials to reset your password
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleEmailSubmit} className="space-y-5">
                    {/* Info Banner */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                    >
                      <div className="flex gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-blue-900">
                            For security reasons, you must provide your official government email address and employee credentials.
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Official Email */}
                    <motion.div
                      className="space-y-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Label htmlFor="email" className="text-gray-700">
                        Official Email Address <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="official@gov.in"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10 bg-white/50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:bg-white"
                          required
                        />
                      </div>
                      {email && !validateGovernmentEmail(email) && (
                        <p className="text-xs text-red-600">
                          Please use a valid government email (.gov.in, .nic.in, or .ernet.in)
                        </p>
                      )}
                    </motion.div>

                    {/* Department */}
                    <motion.div
                      className="space-y-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <Label htmlFor="department" className="text-gray-700">
                        Department <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                        <Select value={department} onValueChange={setDepartment} required>
                          <SelectTrigger className="pl-10 bg-white/50 border-gray-200 text-gray-900 focus:border-blue-500 focus:bg-white">
                            <SelectValue placeholder="Select your department" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Department of Administrative Services</SelectItem>
                            <SelectItem value="health">Department of Health Services</SelectItem>
                            <SelectItem value="education">Department of Education</SelectItem>
                            <SelectItem value="transport">Department of Transport</SelectItem>
                            <SelectItem value="revenue">Department of Revenue</SelectItem>
                            <SelectItem value="housing">Department of Housing</SelectItem>
                            <SelectItem value="agriculture">Department of Agriculture</SelectItem>
                            <SelectItem value="social">Department of Social Welfare</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </motion.div>

                    {/* Employee ID */}
                    <motion.div
                      className="space-y-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <Label htmlFor="employeeId" className="text-gray-700">
                        Employee ID <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="employeeId"
                          type="text"
                          placeholder="GOV-12345"
                          value={employeeId}
                          onChange={(e) => setEmployeeId(e.target.value)}
                          className="pl-10 bg-white/50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:bg-white"
                          required
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        Your unique government employee identification number
                      </p>
                    </motion.div>

                    {/* Submit Button */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="pt-2"
                    >
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg py-6"
                        disabled={isLoading || !validateGovernmentEmail(email)}
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Verifying...
                          </div>
                        ) : (
                          <>
                            <Shield className="w-5 h-5 mr-2" />
                            Send Verification Code
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Verification Code */}
          {step === 'verification' && (
            <motion.div
              key="verification"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-gray-900">Enter Verification Code</CardTitle>
                  <CardDescription>
                    We've sent a 6-digit code to your official email
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleVerificationSubmit} className="space-y-5">
                    {/* Email Display */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                    >
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-blue-900 mb-1">Code sent to:</p>
                          <p className="font-medium text-blue-700">{email}</p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Verification Code */}
                    <motion.div
                      className="space-y-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Label htmlFor="code" className="text-gray-700">
                        Verification Code <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="code"
                        type="text"
                        placeholder="000000"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className="text-center text-2xl tracking-widest bg-white/50 border-gray-200 text-gray-900 focus:border-blue-500 focus:bg-white"
                        maxLength={6}
                        required
                      />
                      <p className="text-xs text-gray-500 text-center">
                        Enter the 6-digit code from your email
                      </p>
                    </motion.div>

                    {/* Resend Link */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-center"
                    >
                      <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
                      <Button
                        type="button"
                        variant="link"
                        onClick={handleResend}
                        className="text-blue-600 hover:text-blue-700"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Resending...' : 'Resend Code'}
                      </Button>
                    </motion.div>

                    {/* Submit Button */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg py-6"
                        disabled={isLoading || verificationCode.length !== 6}
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Verifying...
                          </div>
                        ) : (
                          'Verify and Reset Password'
                        )}
                      </Button>
                    </motion.div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Success */}
          {step === 'success' && (
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
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-xl">
                        <CheckCircle className="w-12 h-12 text-white" />
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <h3 className="text-2xl text-gray-900 mb-3">Password Reset Email Sent!</h3>
                      <p className="text-gray-600 mb-2">
                        We've sent detailed instructions to:
                      </p>
                      <p className="text-blue-600 mb-4">{email}</p>
                      <p className="text-sm text-gray-500">
                        Please check your official email inbox and follow the secure link to create a new password.
                      </p>
                    </motion.div>

                    <motion.div
                      className="p-4 bg-blue-50 rounded-xl border border-blue-100"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="text-left">
                          <p className="text-sm text-blue-900 mb-1">
                            <strong>Security Notice:</strong>
                          </p>
                          <p className="text-xs text-blue-700">
                            The reset link will expire in 15 minutes. If you didn't request this password reset, please contact your IT administrator immediately.
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      className="space-y-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                    >
                      <Button
                        onClick={onBack}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
                      >
                        Return to Official Login
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center flex-shrink-0 shadow-lg">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-900 mb-1">Need Assistance?</p>
              <p className="text-xs text-gray-600 mb-2">
                If you're unable to reset your password or need immediate access, please contact the IT Help Desk:
              </p>
              <p className="text-xs text-blue-600">
                <strong>Email:</strong> support@gov.in<br />
                <strong>Phone:</strong> 1800-XXX-XXXX (24/7)
              </p>
            </div>
          </div>
        </motion.div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 text-center text-xs text-gray-500"
        >
          <p>
            This is a secure government portal. All activities are logged and monitored for security purposes.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
