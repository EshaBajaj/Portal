import React from 'react'
import { motion } from 'framer-motion'

const HeroSection = () => {
  const handleExploreClick = () => {
    // Smooth scroll to next section
    const nextSection = document.querySelector('#timeline-section')
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="min-h-screen bg-primary relative overflow-hidden flex items-center justify-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-500"></div>
      </div>

      {/* Grid Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
        {/* Main Headline */}
        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white mb-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            transition: {
              duration: 1,
              ease: [0.25, 0.46, 0.45, 0.94]
            }
          }}
        >
          <motion.span
            className="inline-block"
            whileHover={{ 
              scale: 1.05,
              textShadow: "0 0 30px rgba(255,255,255,0.5)",
              transition: { duration: 0.3 }
            }}
          >
            Your Career,
          </motion.span>
          <br />
          <motion.span
            className="inline-block bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent"
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.3 }
            }}
          >
            One Click Away
          </motion.span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          className="text-xl md:text-2xl text-accent/90 mb-12 font-light leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            transition: {
              duration: 1,
              delay: 0.3,
              ease: [0.25, 0.46, 0.45, 0.94]
            }
          }}
        >
          A new-age placement portal for students & recruiters
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            transition: {
              duration: 1,
              delay: 0.6,
              ease: [0.25, 0.46, 0.45, 0.94]
            }
          }}
        >
          <motion.button
            onClick={handleExploreClick}
            className="relative group px-12 py-4 bg-white text-primary text-lg font-semibold rounded-full overflow-hidden transition-all duration-300 hover:shadow-2xl"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(255,255,255,0.3)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Button background gradient on hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={false}
            />
            
            {/* Button text */}
            <span className="relative z-10 group-hover:text-white transition-colors duration-300">
              Explore Now
            </span>
            
            {/* Arrow icon */}
            <motion.span
              className="relative z-10 ml-2 inline-block group-hover:text-white transition-all duration-300"
              animate={{ x: [0, 5, 0] }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              →
            </motion.span>
          </motion.button>
        </motion.div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 hidden lg:block">
          <motion.div
            className="w-4 h-4 bg-white rounded-full opacity-40"
            animate={{ 
              y: [0, -20, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
        
        <div className="absolute bottom-32 right-10 hidden lg:block">
          <motion.div
            className="w-6 h-6 border-2 border-white rounded-full opacity-40"
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 1,
          transition: { delay: 1.5, duration: 1 }
        }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-white rounded-full flex justify-center"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1 h-3 bg-white rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
        <p className="text-white text-sm mt-2 opacity-70">Scroll to explore</p>
      </motion.div>
    </section>
  )
}

export default HeroSection