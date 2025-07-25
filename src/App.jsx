import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AOS from 'aos'
import 'aos/dist/aos.css'

import LoaderLogo from './components/LoaderLogo'
import Landing from './pages/Landing'

function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out-cubic',
    })

    // Handle loader timeout
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="App">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoaderLogo key="loader" />
        ) : (
          <Landing key="landing" />
        )}
      </AnimatePresence>
    </div>
  )
}

export default App