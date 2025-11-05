import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, CreditCard, Download, Trash2, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { toast } from 'sonner@2.0.3';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface DigitalIdCardProps {
  userName?: string;
  onNavigate?: (page: string) => void;
}

export function DigitalIdCard({ userName = 'Rajesh Kumar', onNavigate }: DigitalIdCardProps) {
  const [hasIdCard, setHasIdCard] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const citizenData = {
    fullName: userName,
    aadhaar: '1234 5678 9012',
    address: '123 MG Road, Sector 21',
    addressLine2: 'New Delhi - 110001',
    phone: '+91 98765 43210',
  };

  const handleGenerateId = () => {
    setHasIdCard(true);
    toast.success('Digital ID Card generated successfully!');
  };

  const handleDownloadId = () => {
    toast.success('Downloading Digital ID Card...');
  };

  const handleDeleteId = () => {
    setHasIdCard(false);
    setShowDeleteDialog(false);
    toast.success('Digital ID Card deleted successfully');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            {onNavigate && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onNavigate('dashboard')}
                className="hover:bg-gray-100"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            <div>
              <h1 className="text-gray-900">🪪 Digital ID Card</h1>
              <p className="text-sm text-gray-600">Your digital government identity</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {!hasIdCard ? (
            // No ID State
            <motion.div
              key="no-id"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center justify-center py-16"
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mb-8"
              >
                <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl">
                  <CreditCard className="w-16 h-16 text-white" />
                </div>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-900 mb-3"
              >
                No Digital ID Card Found
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600 mb-8 text-center max-w-md"
              >
                Generate your digital identity card to access all government services with ease and security
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handleGenerateId}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl px-8 py-6 text-lg"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Generate ID Card
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            // ID Card Display
            <motion.div
              key="has-id"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              {/* ID Card */}
              <motion.div
                initial={{ rotateY: -90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="perspective-1000"
              >
                <Card className="border-2 border-gray-200 shadow-2xl overflow-hidden relative">
                  {/* Holographic Pattern Overlay */}
                  <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `
                        repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(59, 130, 246, 0.1) 10px, rgba(59, 130, 246, 0.1) 20px),
                        repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(139, 92, 246, 0.1) 10px, rgba(139, 92, 246, 0.1) 20px)
                      `
                    }} />
                  </div>

                  {/* Header Section */}
                  <div className="bg-gradient-to-r from-orange-500 via-white to-green-500 p-1">
                    <div className="bg-white px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-gray-900">GOVERNMENT OF INDIA</h2>
                          <p className="text-sm text-gray-600">Digital Identity Card</p>
                        </div>
                        {/* National Emblem */}
                        <div className="flex flex-col items-center">
                          <Shield className="w-12 h-12 text-blue-800 mb-1" />
                          <p className="text-xs text-gray-600">भारत सरकार</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Body Section */}
                  <CardContent className="p-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 relative">
                    <div className="flex gap-8">
                      {/* Photo Section */}
                      <div className="flex-shrink-0">
                        <div className="w-[120px] h-[120px] rounded-xl overflow-hidden border-4 border-white shadow-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                          <ImageWithFallback
                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200"
                            alt="Citizen Photo"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      {/* Info Section */}
                      <div className="flex-1 space-y-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Full Name</p>
                          <h3 className="text-gray-900">{citizenData.fullName}</h3>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Aadhaar Number</p>
                          <p className="text-gray-900 tracking-wider">
                            XXXX XXXX {citizenData.aadhaar.slice(-4)}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-600 mb-1">Address</p>
                          <p className="text-gray-900">{citizenData.address}</p>
                          <p className="text-gray-900">{citizenData.addressLine2}</p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-600 mb-1">Phone Number</p>
                          <p className="text-gray-900">{citizenData.phone}</p>
                        </div>
                      </div>

                      {/* QR Code Section */}
                      <div className="flex-shrink-0 flex flex-col items-center justify-end">
                        <div className="w-20 h-20 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center mb-2 shadow-md">
                          {/* QR Code Placeholder */}
                          <div className="w-16 h-16 grid grid-cols-4 gap-[2px]">
                            {Array.from({ length: 16 }).map((_, i) => (
                              <div
                                key={i}
                                className={`${
                                  Math.random() > 0.5 ? 'bg-gray-900' : 'bg-white'
                                } rounded-sm`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 text-center">
                          Scan for<br />verification
                        </p>
                      </div>
                    </div>

                    {/* Footer Section */}
                    <div className="mt-8 pt-4 border-t-2 border-gray-200">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                          Valid Government ID
                        </p>
                        <div className="h-px flex-1 mx-4 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                        <p className="text-sm text-gray-600">
                          Digital India Initiative
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={handleDownloadId}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg px-8 py-6 w-full sm:w-auto"
                  >
                    📥 Download ID Card
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => setShowDeleteDialog(true)}
                    variant="outline"
                    className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-400 px-8 py-6 w-full sm:w-auto"
                  >
                    🗑️ Delete ID Card
                  </Button>
                </motion.div>
              </motion.div>

              {/* Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                        <Shield className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-gray-900 mb-2">Secure Digital Identity</h3>
                        <p className="text-sm text-gray-700">
                          Your Digital ID Card is cryptographically secured and can be used for verification
                          at all government offices and service centers across India.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900">Delete Digital ID Card?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete your Digital ID Card? You can generate a new one anytime.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteId}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
