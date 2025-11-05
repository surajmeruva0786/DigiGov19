import { motion } from 'motion/react';
import { Mic, CheckCircle, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface VoiceSetupProps {
  onEnable: () => void;
  onSkip: () => void;
}

export function VoiceSetup({ onEnable, onSkip }: VoiceSetupProps) {
  const features = [
    'Voice search for schemes',
    'Dictate complaints',
    'Accessibility support',
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        <Card className="max-w-md w-full border-0 shadow-2xl bg-white/95 backdrop-blur-sm p-8">
          {/* Close button */}
          <motion.button
            onClick={onSkip}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-5 h-5" />
          </motion.button>

          {/* Animated Microphone Icon */}
          <motion.div
            className="flex justify-center mb-6"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, duration: 0.6, type: 'spring' }}
          >
            <motion.div
              className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl relative"
              animate={{
                scale: [1, 1.05, 1],
                boxShadow: [
                  '0 20px 60px rgba(59, 130, 246, 0.5)',
                  '0 20px 80px rgba(139, 92, 246, 0.6)',
                  '0 20px 60px rgba(59, 130, 246, 0.5)',
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Mic className="w-16 h-16 text-white" />
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <h2 className="text-2xl mb-3">Enable Voice Assistance?</h2>
            <p className="text-gray-600 mb-6">
              Navigate using voice commands and dictate text hands-free
            </p>

            {/* Feature List */}
            <div className="space-y-3 mb-8 text-left">
              {features.map((feature, index) => (
                <motion.div
                  key={feature}
                  className="flex items-center gap-3 p-3 rounded-xl glass-card"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </motion.div>
              ))}
            </div>

            {/* Action Buttons */}
            <motion.div
              className="flex gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Button
                variant="outline"
                onClick={onSkip}
                className="flex-1 bg-white/50 hover:bg-white"
              >
                No, Thanks
              </Button>
              <Button
                onClick={onEnable}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl"
              >
                Yes, Enable Voice
              </Button>
            </motion.div>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
}
