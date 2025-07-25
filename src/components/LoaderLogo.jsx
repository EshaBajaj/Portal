import React from 'react'
import { motion } from 'framer-motion'

const LoaderLogo = () => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-primary"
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        y: -100,
        transition: { 
          duration: 1.5,
          ease: [0.76, 0, 0.24, 1]
        }
      }}
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-blue-800 to-blue-900" />
      
      {/* Animated logo container */}
      <motion.div
        className="relative z-10 flex flex-col items-center"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ 
          scale: 1, 
          opacity: 1,
          transition: {
            duration: 1,
            ease: [0.25, 0.46, 0.45, 0.94]
          }
        }}
      >
        {/* Logo with glow animation */}
        <motion.div
          className="relative mb-8"
          animate={{
            scale: [1, 1.1, 1],
            transition: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        >
          {/* Glow effect background */}
          <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse" />
          
          {/* Logo image */}
          <div className="relative w-32 h-32 md:w-40 md:h-40 bg-white rounded-full flex items-center justify-center shadow-2xl">
            <img 
              src="/src/assets/logo.svg" 
              alt="Placement Portal Logo" 
              className="w-20 h-20 md:w-24 md:h-24 object-contain"
            />
          </div>
          
          {/* Stroke animation circle */}
          <motion.div
            className="absolute inset-0 border-4 border-white rounded-full"
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.8, 0.3, 0.8],
              transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
          />
        </motion.div>

        {/* Loading text */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            transition: { delay: 0.5, duration: 0.8 }
          }}
        >
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Placement Portal
          </h1>
          <p className="text-accent/80 text-sm md:text-base">
            Initializing your career journey...
          </p>
        </motion.div>

        {/* Loading dots animation */}
        <motion.div
          className="flex space-x-2 mt-6"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 1,
            transition: { delay: 1, duration: 0.5 }
          }}
        >
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-2 h-2 bg-white rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
                transition: {
                  duration: 1.5,
                  repeat: Infinity,
                  delay: index * 0.2,
                  ease: "easeInOut"
                }
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default LoaderLogo