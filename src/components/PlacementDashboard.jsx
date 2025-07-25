import React, { useState } from 'react'
import { motion } from 'framer-motion'

const PlacementDashboard = () => {
  const [hoveredCompany, setHoveredCompany] = useState(null)

  // Sample placement data
  const placements = [
    {
      id: 1,
      company: "Google",
      student: {
        name: "Arjun Sharma",
        photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        linkedin: "https://linkedin.com/in/arjun-sharma",
        package: "₹45 LPA",
        role: "Software Engineer"
      },
      logo: "https://img.icons8.com/color/96/google-logo.png"
    },
    {
      id: 2,
      company: "Microsoft",
      student: {
        name: "Priya Patel",
        photo: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        linkedin: "https://linkedin.com/in/priya-patel",
        package: "₹52 LPA",
        role: "Product Manager"
      },
      logo: "https://img.icons8.com/color/96/microsoft.png"
    },
    {
      id: 3,
      company: "Amazon",
      student: {
        name: "Rahul Kumar",
        photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        linkedin: "https://linkedin.com/in/rahul-kumar",
        package: "₹38 LPA",
        role: "SDE II"
      },
      logo: "https://img.icons8.com/color/96/amazon.png"
    },
    {
      id: 4,
      company: "Netflix",
      student: {
        name: "Sneha Singh",
        photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        linkedin: "https://linkedin.com/in/sneha-singh",
        package: "₹48 LPA",
        role: "Data Scientist"
      },
      logo: "https://img.icons8.com/color/96/netflix.png"
    },
    {
      id: 5,
      company: "Adobe",
      student: {
        name: "Vikash Yadav",
        photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
        linkedin: "https://linkedin.com/in/vikash-yadav",
        package: "₹42 LPA",
        role: "UX Designer"
      },
      logo: "https://img.icons8.com/color/96/adobe-creative-suite.png"
    },
    {
      id: 6,
      company: "Spotify",
      student: {
        name: "Ananya Iyer",
        photo: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
        linkedin: "https://linkedin.com/in/ananya-iyer",
        package: "₹35 LPA",
        role: "Frontend Developer"
      },
      logo: "https://img.icons8.com/color/96/spotify.png"
    },
    {
      id: 7,
      company: "Tesla",
      student: {
        name: "Karthik Reddy",
        photo: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face",
        linkedin: "https://linkedin.com/in/karthik-reddy",
        package: "₹55 LPA",
        role: "ML Engineer"
      },
      logo: "https://img.icons8.com/color/96/tesla.png"
    },
    {
      id: 8,
      company: "Meta",
      student: {
        name: "Deepika Agarwal",
        photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
        linkedin: "https://linkedin.com/in/deepika-agarwal",
        package: "₹50 LPA",
        role: "DevOps Engineer"
      },
      logo: "https://img.icons8.com/color/96/meta.png"
    }
  ]

  const handleStudentClick = (linkedinUrl) => {
    window.open(linkedinUrl, '_blank')
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-48 h-48 bg-blue-400/10 rounded-full blur-2xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-primary mb-4"
            data-aos="fade-up"
            data-aos-duration="1000"
          >
            Success Stories
          </motion.h2>
          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="200"
            data-aos-duration="1000"
          >
            Discover where our talented students have landed their dream jobs
          </motion.p>
        </div>

        {/* Placement Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {placements.map((placement, index) => (
            <motion.div
              key={placement.id}
              className="relative group"
              data-aos="fade-up"
              data-aos-delay={index * 100}
              data-aos-duration="1000"
            >
              {/* Company Card */}
              <motion.div
                className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer transform transition-all duration-500 hover:shadow-2xl"
                onMouseEnter={() => setHoveredCompany(placement.id)}
                onMouseLeave={() => setHoveredCompany(null)}
                whileHover={{ 
                  scale: 1.05,
                  y: -10,
                  rotateY: 5
                }}
                style={{
                  transformStyle: 'preserve-3d'
                }}
              >
                {/* Company Logo */}
                <div className="flex items-center justify-center mb-4">
                  <img 
                    src={placement.logo} 
                    alt={`${placement.company} logo`}
                    className="w-16 h-16 object-contain"
                  />
                </div>

                {/* Company Name */}
                <h3 className="text-xl font-bold text-primary text-center mb-2">
                  {placement.company}
                </h3>

                {/* Role and Package */}
                <div className="text-center text-gray-600 text-sm">
                  <p className="font-medium">{placement.student.role}</p>
                  <p className="text-green-600 font-bold">{placement.student.package}</p>
                </div>

                {/* Hover Overlay with Student Info */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-500"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: hoveredCompany === placement.id ? 1 : 0,
                    scale: hoveredCompany === placement.id ? 1 : 0.8
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Student Photo */}
                  <motion.div
                    className="w-20 h-20 rounded-full overflow-hidden mb-4 border-4 border-white shadow-lg cursor-pointer"
                    onClick={() => handleStudentClick(placement.student.linkedin)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img 
                      src={placement.student.photo}
                      alt={placement.student.name}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>

                  {/* Student Name */}
                  <h4 className="text-lg font-bold mb-2 text-center">
                    {placement.student.name}
                  </h4>

                  {/* LinkedIn Button */}
                  <motion.button
                    onClick={() => handleStudentClick(placement.student.linkedin)}
                    className="px-4 py-2 bg-white text-primary rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors duration-300 flex items-center space-x-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>View LinkedIn</span>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path>
                      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path>
                    </svg>
                  </motion.button>
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            { number: "500+", label: "Students Placed", icon: "🎓" },
            { number: "150+", label: "Partner Companies", icon: "🏢" },
            { number: "₹45L", label: "Average Package", icon: "💰" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center p-6 bg-white rounded-2xl shadow-lg"
              data-aos="fade-up"
              data-aos-delay={index * 200}
              data-aos-duration="1000"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-4xl mb-4">{stat.icon}</div>
              <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PlacementDashboard