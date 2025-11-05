import { motion } from 'motion/react';
import { Shield, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  message?: string;
  onComplete?: () => void;
  duration?: number;
}

export function LoadingScreen({ 
  message = 'Loading DigiGov Platform...', 
  onComplete,
  duration = 2500 
}: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Smooth progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, duration / 50);

    // Complete loading after duration
    const timer = setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, duration);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, [duration, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800" />
      
      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="grid-pattern" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: Math.random() * 0.5 + 0.2,
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              opacity: [null, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Animated Blobs */}
      <motion.div
        className="absolute top-20 left-20 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/30 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center max-w-md px-6">
        {/* Logo Container */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 20,
            duration: 0.8,
          }}
          className="relative mb-8"
        >
          {/* Outer Ring */}
          <motion.div
            className="absolute inset-0 w-32 h-32 rounded-full border-4 border-white/30"
            animate={{ rotate: 360 }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
          
          {/* Middle Ring */}
          <motion.div
            className="absolute inset-2 w-28 h-28 rounded-full border-4 border-white/50"
            animate={{ rotate: -360 }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'linear',
            }}
          />

          {/* Logo Background */}
          <div className="w-32 h-32 rounded-3xl bg-white/20 backdrop-blur-xl flex items-center justify-center shadow-2xl border border-white/30">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="relative"
            >
              <Shield className="w-16 h-16 text-white" />
              
              {/* Sparkle Effect */}
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{
                  scale: [0, 1, 0],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <Sparkles className="w-6 h-6 text-yellow-300" />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Brand Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center mb-6"
        >
          <h1 className="text-white text-4xl mb-2">
            DigiGov
          </h1>
          <p className="text-blue-100 text-sm tracking-wider">
            DIGITAL GOVERNMENT PLATFORM
          </p>
        </motion.div>

        {/* Loading Message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-white/90 text-center mb-8"
        >
          {message}
        </motion.p>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="w-full max-w-xs"
        >
          {/* Progress Container */}
          <div className="relative h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
            {/* Progress Fill */}
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
            
            {/* Shimmer Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              animate={{
                x: ['-100%', '200%'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </div>

          {/* Progress Percentage */}
          <motion.p
            className="text-white/80 text-sm text-center mt-3"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {Math.round(progress)}%
          </motion.p>
        </motion.div>

        {/* Loading Dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex gap-2 mt-6"
        >
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-2 h-2 bg-white rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: index * 0.2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </motion.div>

        {/* Footer Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-white/60 text-xs">
            Powered by Digital India Initiative
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Shorter variant for transitions between pages
export function TransitionLoader({ message = 'Loading...' }: { message?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800"
    >
      <div className="flex flex-col items-center">
        {/* Simple Spinner */}
        <motion.div
          className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        
        {/* Message */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-white mt-6"
        >
          {message}
        </motion.p>
      </div>
    </motion.div>
  );
}
