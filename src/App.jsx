import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import Header from './components/Header'
import Banner from './components/Banner'
import WhyPw from './components/WhyPw'
import MasonryStats from './components/stats'
import Preloader from './components/PreLoader'
import OurPartners from './components/OurPartners'
import PWIOIFooter from './components/Footer'
import PlacementTimeline from './components/PlacementTimeline'
import AdminSlider from './components/CareerService'
import PlacementFAQ from './components/FAQs'
import RecruitersSection from './components/founder'
import Records from './components/Records'
import LoginModal from './components/LoginModal'
import NotificationModal from './components/Notification'
import cursor from './components/cursor'
import ProtectedRoute from './components/ProtectedRoute'
import StudentDashboard from './pages/dashboard/StudentDashboard'
import RecruiterDashboard from './pages/dashboard/RecruiterDashboard'
import AdminDashboard from './pages/dashboard/AdminDashboard'
import Login from './pages/Login'
import { useAuth } from './hooks/useAuth'
import { AuthProvider } from './context/AuthContext'
import AuthRedirect from './components/AuthRedirect'
import DatabaseTest from './components/DatabaseTest'

// Landing page component
function LandingPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [timelineAutoplay, setTimelineAutoplay] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loginType, setLoginType] = useState('Student')

  const triggerTimelineAnimation = () => {
    setTimelineAutoplay(true);
    // Reset after animation completes
    setTimeout(() => setTimelineAutoplay(false), 3500);
  };

  const openModal = (type = 'Student') => {
    setLoginType(type);
    setIsModalOpen(true);
    triggerTimelineAnimation();
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact-form');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
      // Focus on company name input after scroll
      setTimeout(() => {
        const companyInput = document.querySelector('input[name="name"]');
        if (companyInput) {
          companyInput.focus();
        }
      }, 1000); // Wait for scroll to complete
    }
  };

  return (
    <>
      {isLoading ? (
        <Preloader onComplete={() => setIsLoading(false)} />
      ) : (
        <main className='w-full min-h-screen'>
          <NotificationModal />

          <Header onLoginOpen={openModal} />

          {/* Banner - Odd component #F2F0EA */}
          <div className='bg-gradient-to-b from-gray-50 to-[#FFEECE]'>
            <Banner />
          </div>

          {/* WhyPw - Even component #A8D5E3 */}
          <div className='bg-[#FFEECE]'>
            <WhyPw />
          </div>

          {/* Stats - comes under WhyPw, before OurPartners */}
          <div className='bg-[#FFEECE]'>
            <MasonryStats />
          </div>

          {/* OurPartners - Odd component #F2F0EA */}
          <div id="our-partners" className='bg-[#FFEECE]'>
            <OurPartners />
          </div>

          {/* Records - Even component #A8D5E3 */}
          <div className='bg-[#FFEECE]'>
            <Records onLoginOpen={openModal} />
          </div>

          {/* PlacementTimeline - #A8D5E3 background */}
          <div className='bg-[#FFEECE]'>
            <PlacementTimeline autoplay={timelineAutoplay} />
          </div>

          <div className='bg-[#FFEECE] py-10'>
            <AdminSlider />
          </div>

          {/* FoundersSection - Even component #A8D5E3 */}
          <div className='bg-[#FFEECE]'>
            <RecruitersSection />
          </div>

          <div className='bg-[#FFEECE]'>
            <PlacementFAQ />
          </div>

          {/* Footer - Odd component #F2F0EA */}
          <div>
            <PWIOIFooter onLoginOpen={openModal} onContactTeam={scrollToContact} />
          </div>
        </main>
      )}

      {/* LoginModal rendered at app level for proper centering */}
      <LoginModal isOpen={isModalOpen} onClose={closeModal} defaultRole={loginType} />
    </>
  )
}

function AppContent() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <AuthRedirect />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/test" element={<DatabaseTest />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute allowRoles={['student']} />}>
          <Route path="/student" element={<StudentDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowRoles={['recruiter']} />}>
          <Route path="/recruiter" element={<RecruiterDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowRoles={['admin']} />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App;
