import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FiHome, FiBriefcase, FiUsers, FiCalendar, FiMessageSquare, FiBarChart2, FiSettings, FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import PWIOILOGO from '../../assets/brand_logo.webp';
import Dashboard from '../recruiter/dashboard';
import JobPostings from '../recruiter/JobPostings';

const RecruiterDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarWidth, setSidebarWidth] = useState(15);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef(null);
  const navigate = useNavigate();

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: FiHome, path: '/recruiter/dashboard' },
    { id: 'jobPostings', label: 'Job Postings', icon: FiBriefcase },
    { id: 'candidates', label: 'Candidates', icon: FiUsers },
    { id: 'calendar', label: 'Calendar', icon: FiCalendar },
    { id: 'messages', label: 'Messages', icon: FiMessageSquare },
    { id: 'analytics', label: 'Analytics', icon: FiBarChart2 },
    { id: 'settings', label: 'Settings', icon: FiSettings },
  ];

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    const windowWidth = window.innerWidth;
    const newWidth = (e.clientX / windowWidth) * 100;
    const constrainedWidth = Math.min(Math.max(newWidth, 5), 15);
    setSidebarWidth(constrainedWidth);
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleLogout = () => {
    navigate('/login');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'jobPostings':
        return <JobPostings/>;
      case 'candidates':
        return <div>Candidates Content</div>;
      case 'calendar':
        return <div>Calendar Content</div>;
      case 'messages':
        return <div>Messages Content</div>;
      case 'analytics':
        return <div>Analytics Content</div>;
      case 'settings':
        return <div>Settings Content</div>;
      default:
        return <div>Recruiter Dashboard Content</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50">
      {/* Horizontal Navbar */}
      <nav className="bg-white border-b border-blue-100 sticky top-0 z-50">
        <div className="w-full px-2 py-1">
          <div
            className="px-6 py-1 rounded-xl bg-gradient-to-br from-white to-blue-300 border-2 border-gray-400"
          >
            <div className="flex justify-between items-center h-23 gap-2 relative">
              <div className="ml-4 space-y-0">
                <div className="flex items-center">
                  <h2 className="text-2xl font-bold text-black flex items-center">
                    Welcome, Recruiter!
                  </h2>
                </div>
                <div className='ml-2 -mt-0 mb-1 italic'>
                  <p>Connecting Opportunities with Talent.</p>
                </div>
              </div>

              <div className='absolute top-1 start-1/2 -translate-x-1/5 w-fit flex flex-col items-center gap-2'>
                <img src={PWIOILOGO} alt="" className='w-30' />
                <h1 className='text-nowrap text-3xl text-black-300 opacity-90 font-caveat'>Connecting Opportunities with Talent.</h1>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex min-h-[calc(100vh-5rem)] relative">
        <aside
          className="bg-white border-r border-gray-200 fixed h-[calc(100vh-5rem)] overflow-y-auto transition-all duration-200 ease-in-out"
          style={{ width: `${sidebarWidth}%` }}
        >
          <div className="p-3 h-full flex flex-col">
            <div className="mb-6">
              {sidebarWidth >= 9 && (
                <h2 className="text-base font-bold text-gray-900 mb-3">Navigation</h2>
              )}
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <div key={tab.id} className="mb-1">
                      <button
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center rounded-lg text-xs font-medium transition-all duration-200 ${
                          activeTab === tab.id
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                            : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                        } ${sidebarWidth < 9 ? 'justify-center px-2 py-2' : 'px-2 py-3'}`}
                        title={sidebarWidth < 9 ? tab.label : ''}
                      >
                        <Icon className={`h-4 w-4 ${sidebarWidth >= 9 ? 'mr-2' : ''}`} />
                        {sidebarWidth >= 9 && tab.label}
                      </button>
                    </div>
                  );
                })}
              </nav>
            </div>

            <div className="mt-auto pt-4 pb-[35%] border-t border-gray-300">
              <button
                onClick={handleLogout}
                className={`w-full flex items-center rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 ${
                  sidebarWidth < 12 ? 'justify-center px-2 py-2 mb-15' : 'px-3 py-2.5'
                }`}
                title={sidebarWidth < 9 ? 'Logout' : ''}
              >
                <FiLogOut className={`h-4 w-4 ${sidebarWidth >= 9 ? 'mr-2' : ''}`} />
                {sidebarWidth >= 9 && 'Logout'}
              </button>
            </div>
          </div>
        </aside>

        <div
          ref={dragRef}
          onMouseDown={handleMouseDown}
          className="fixed top-0 h-screen w-1 bg-gray-300 hover:bg-blue-500 cursor-col-resize z-10 transition-colors duration-200 flex items-center justify-center group"
          style={{ left: `${sidebarWidth}%` }}
        >
          <div className="absolute inset-y-0 -left-1 -right-1 flex items-center justify-center">
            <div className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors duration-200" />
          </div>
        </div>

        <main
          className="bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 min-h-screen transition-all duration-200 ease-in-out"
          style={{
            marginLeft: `${sidebarWidth}%`,
            width: `${100 - sidebarWidth}%`
          }}
        >
          <div className="p-8">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default RecruiterDashboard;