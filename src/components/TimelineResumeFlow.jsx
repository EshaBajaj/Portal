import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import AOS from 'aos'

const TimelineResumeFlow = () => {
  useEffect(() => {
    AOS.refresh()
  }, [])

  const timelineSteps = [
    {
      id: 1,
      title: "Student Uploads Resume",
      description: "Students submit their resumes through our intuitive portal",
      icon: "📄",
      side: "left",
      color: "from-blue-500 to-blue-600"
    },
    {
      id: 2,
      title: "Admin Reviews Resume",
      description: "Our placement team carefully reviews and validates each submission",
      icon: "👨‍💼",
      side: "right",
      color: "from-indigo-500 to-indigo-600"
    },
    {
      id: 3,
      title: "AI/NLP Job Matching",
      description: "Advanced algorithms match resumes with relevant job descriptions",
      icon: "🤖",
      side: "left",
      color: "from-purple-500 to-purple-600"
    },
    {
      id: 4,
      title: "Recruiter Notification",
      description: "Recruiters receive top matches directly in their inbox",
      icon: "📧",
      side: "right",
      color: "from-pink-500 to-pink-600"
    }
  ]

  return (
    <section id="timeline-section" className="py-20 bg-gradient-to-br from-accent to-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-300/20 rounded-full blur-xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-primary mb-4"
            data-aos="fade-up"
            data-aos-duration="1000"
          >
            Resume Journey
          </motion.h2>
          <motion.p
            className="text-xl text-gray-600 max-w-2xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="200"
            data-aos-duration="1000"
          >
            Follow your resume through our intelligent placement system
          </motion.p>
        </div>

        {/* Timeline Container */}
        <div className="relative max-w-6xl mx-auto">
          {/* Central Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary via-blue-400 to-primary rounded-full">
            <motion.div
              className="w-full bg-gradient-to-b from-blue-300 to-blue-500 rounded-full"
              initial={{ height: 0 }}
              whileInView={{ height: "100%" }}
              transition={{ duration: 2, ease: "easeInOut" }}
              viewport={{ once: true }}
            />
          </div>

          {/* Timeline Steps */}
          {timelineSteps.map((step, index) => (
            <div
              key={step.id}
              className={`relative flex items-center mb-16 ${
                step.side === "left" 
                  ? "justify-start" 
                  : "justify-end md:justify-start"
              }`}
            >
              {/* Desktop Layout */}
              <div className="hidden md:flex w-full items-center">
                {step.side === "left" ? (
                  <>
                    {/* Content Card - Left Side */}
                    <motion.div
                      className="w-5/12 pr-8"
                      data-aos="fade-right"
                      data-aos-delay={index * 200}
                      data-aos-duration="1000"
                    >
                      <div className={`p-6 rounded-2xl shadow-xl bg-gradient-to-br ${step.color} text-white transform hover:scale-105 transition-all duration-300`}>
                        <div className="flex items-center mb-4">
                          <span className="text-3xl mr-3">{step.icon}</span>
                          <h3 className="text-xl font-bold">{step.title}</h3>
                        </div>
                        <p className="text-white/90 leading-relaxed">{step.description}</p>
                      </div>
                    </motion.div>

                    {/* Center Node */}
                    <div className="relative z-10 flex items-center justify-center">
                      <motion.div
                        className="w-16 h-16 bg-white border-4 border-primary rounded-full flex items-center justify-center shadow-lg"
                        data-aos="zoom-in"
                        data-aos-delay={index * 200 + 300}
                        whileHover={{ scale: 1.1 }}
                      >
                        <span className="text-2xl">{step.icon}</span>
                      </motion.div>
                    </div>

                    {/* Empty Space - Right Side */}
                    <div className="w-5/12 pl-8"></div>
                  </>
                ) : (
                  <>
                    {/* Empty Space - Left Side */}
                    <div className="w-5/12 pr-8"></div>

                    {/* Center Node */}
                    <div className="relative z-10 flex items-center justify-center">
                      <motion.div
                        className="w-16 h-16 bg-white border-4 border-primary rounded-full flex items-center justify-center shadow-lg"
                        data-aos="zoom-in"
                        data-aos-delay={index * 200 + 300}
                        whileHover={{ scale: 1.1 }}
                      >
                        <span className="text-2xl">{step.icon}</span>
                      </motion.div>
                    </div>

                    {/* Content Card - Right Side */}
                    <motion.div
                      className="w-5/12 pl-8"
                      data-aos="fade-left"
                      data-aos-delay={index * 200}
                      data-aos-duration="1000"
                    >
                      <div className={`p-6 rounded-2xl shadow-xl bg-gradient-to-br ${step.color} text-white transform hover:scale-105 transition-all duration-300`}>
                        <div className="flex items-center mb-4">
                          <span className="text-3xl mr-3">{step.icon}</span>
                          <h3 className="text-xl font-bold">{step.title}</h3>
                        </div>
                        <p className="text-white/90 leading-relaxed">{step.description}</p>
                      </div>
                    </motion.div>
                  </>
                )}
              </div>

              {/* Mobile Layout */}
              <div className="md:hidden flex items-center w-full">
                {/* Content Card */}
                <motion.div
                  className="w-4/5 ml-16"
                  data-aos="fade-up"
                  data-aos-delay={index * 200}
                  data-aos-duration="1000"
                >
                  <div className={`p-6 rounded-2xl shadow-xl bg-gradient-to-br ${step.color} text-white`}>
                    <div className="flex items-center mb-4">
                      <span className="text-3xl mr-3">{step.icon}</span>
                      <h3 className="text-lg font-bold">{step.title}</h3>
                    </div>
                    <p className="text-white/90 leading-relaxed text-sm">{step.description}</p>
                  </div>
                </motion.div>

                {/* Mobile Center Node */}
                <div className="absolute left-6 z-10">
                  <motion.div
                    className="w-12 h-12 bg-white border-4 border-primary rounded-full flex items-center justify-center shadow-lg"
                    data-aos="zoom-in"
                    data-aos-delay={index * 200 + 300}
                  >
                    <span className="text-lg">{step.icon}</span>
                  </motion.div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-20">
          <motion.div
            data-aos="fade-up"
            data-aos-delay="800"
            data-aos-duration="1000"
          >
            <h3 className="text-2xl font-bold text-primary mb-4">Ready to Start Your Journey?</h3>
            <p className="text-gray-600 mb-6">Join thousands of students who have found their dream careers</p>
            <motion.button
              className="px-8 py-3 bg-primary text-white rounded-full font-semibold hover:bg-blue-700 transition-colors duration-300 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Today
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default TimelineResumeFlow