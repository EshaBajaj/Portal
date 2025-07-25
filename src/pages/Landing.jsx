import React from 'react'
import { motion } from 'framer-motion'
import HeroSection from '../components/HeroSection'
import TimelineResumeFlow from '../components/TimelineResumeFlow'
import PlacementDashboard from '../components/PlacementDashboard'

const Landing = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: 1,
        transition: { 
          duration: 1,
          ease: [0.25, 0.46, 0.45, 0.94]
        }
      }}
      className="min-h-screen"
    >
      {/* Hero Section */}
      <HeroSection />
      
      {/* Timeline Section */}
      <TimelineResumeFlow />
      
      {/* Placement Dashboard Section */}
      <PlacementDashboard />
    </motion.div>
  )
}

export default Landing