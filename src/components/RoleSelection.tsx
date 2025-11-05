import { motion } from 'motion/react';
import { User, Building2, Globe, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { AnimatedBackground, FloatingParticles } from './AnimatedBackground';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { useState } from 'react';

interface RoleSelectionProps {
  onNavigate: (page: string) => void;
}

export function RoleSelection({ onNavigate }: RoleSelectionProps) {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी' },
    { code: 'bn', name: 'বাংলা' },
    { code: 'te', name: 'తెలుగు' },
    { code: 'mr', name: 'मराठी' },
    { code: 'ta', name: 'தமிழ்' },
    { code: 'ur', name: 'اردو' },
    { code: 'gu', name: 'ગુજરાતી' },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900" />
      <AnimatedBackground />
      <FloatingParticles count={40} />

      {/* Header */}
      <motion.header
        className="relative z-10 p-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-4">
            <motion.div
              className="w-16 h-16 rounded-2xl glass-card flex items-center justify-center shadow-2xl"
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.8 }}
            >
              <Building2 className="w-8 h-8 text-white" />
            </motion.div>
            <div className="text-white">
              <h2 className="text-xl">Digital India Initiative</h2>
            </div>
          </div>

          {/* Language Selector */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2"
          >
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-[160px] glass-card text-white border-white/20">
                <Globe className="w-4 h-4 mr-2" />
                <SelectValue placeholder="English" className="text-white" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <motion.h1
            className="text-white text-5xl md:text-6xl lg:text-7xl mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Government Service Portal
          </motion.h1>
          <motion.p
            className="text-blue-100 text-xl md:text-2xl mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            सेवा आपकी, सरकार आपके द्वार
          </motion.p>
          <motion.p
            className="text-blue-200 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Service to You, Government at Your Doorstep
          </motion.p>
        </motion.div>

        {/* Portal Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Citizen Portal Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            whileHover={{ y: -12, scale: 1.02 }}
          >
            <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm h-full cursor-pointer overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="relative z-10">
                <motion.div
                  className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mb-6 shadow-xl"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <User className="w-10 h-10 text-white" />
                </motion.div>
                <CardTitle className="text-3xl mb-3 text-gray-900">Citizen Services</CardTitle>
                <CardDescription className="text-base text-gray-600">
                  Access government schemes, file complaints, manage documents
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="space-y-3 mb-6">
                  {[
                    'Apply for government schemes',
                    'File and track complaints',
                    'Manage family documents',
                    'Pay utility bills online',
                  ].map((feature, index) => (
                    <motion.div
                      key={feature}
                      className="flex items-center gap-3 text-sm text-gray-600"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 + index * 0.1 }}
                    >
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {feature}
                    </motion.div>
                  ))}
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-lg py-6 shadow-xl group-hover:shadow-2xl transition-all"
                  onClick={() => onNavigate('login')}
                >
                  Enter Portal
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Official Portal Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            whileHover={{ y: -12, scale: 1.02 }}
          >
            <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm h-full cursor-pointer overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="relative z-10">
                <motion.div
                  className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center mb-6 shadow-xl"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Building2 className="w-10 h-10 text-white" />
                </motion.div>
                <CardTitle className="text-3xl mb-3 text-gray-900">Government Officials</CardTitle>
                <CardDescription className="text-base text-gray-600">
                  Admin dashboard to manage applications and complaints
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="space-y-3 mb-6">
                  {[
                    'Review citizen applications',
                    'Manage complaints & feedback',
                    'Verify documents',
                    'Generate analytics reports',
                  ].map((feature, index) => (
                    <motion.div
                      key={feature}
                      className="flex items-center gap-3 text-sm text-gray-600"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 + index * 0.1 }}
                    >
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {feature}
                    </motion.div>
                  ))}
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-lg py-6 shadow-xl group-hover:shadow-2xl transition-all"
                  onClick={() => onNavigate('official-login')}
                >
                  Official Login
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <motion.footer
        className="relative z-10 mt-16 pb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-3 h-3 rounded-full bg-green-400 shadow-lg animate-pulse" />
            <span className="text-white text-sm">Connected</span>
          </div>
          <p className="text-blue-200 text-sm">
            © 2025 Government of India. All rights reserved.
          </p>
        </div>
      </motion.footer>
    </div>
  );
}
