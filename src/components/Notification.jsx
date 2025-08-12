// components/NotificationModal.jsx
import React, { useState, useEffect } from 'react';

const NotificationModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Mock notifications (replace with API call)
  useEffect(() => {
    const mockNotifications = [
      {
        id: 1,
        title: "New Job Opening: Software Engineer",
        message: "Google is hiring for Software Engineer position",
        timestamp: "2 hours ago",
        type: "job",
        isRead: false
      },
      {
        id: 2,
        title: "Application Status Update",
        message: "Your application for Microsoft has been shortlisted",
        timestamp: "5 hours ago",
        type: "update",
        isRead: false
      },
      {
        id: 3,
        title: "Interview Scheduled",
        message: "Interview scheduled for Amazon SDE role on Aug 15",
        timestamp: "1 day ago",
        type: "interview",
        isRead: true
      }
    ];
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.isRead).length);
  }, []);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'job': return '💼';
      case 'update': return '📋';
      case 'interview': return '📅';
      default: return '🔔';
    }
  };

  return (
    <>
      {/* Floating Notification Bell (Bottom Right) */}
      <div className='fixed z-50 bottom-[3%] right-[2%]'>
        <button
          type="button"
          className='relative size-[3.2rem] bg-yellow-400 hover:bg-yellow-500 text-white rounded-full shadow-lg transition-all duration-200 flex items-center justify-center'
          onClick={toggleModal}
        >
          {/* Bell Icon */}
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2C8.895 2 8 2.895 8 4v2.5C6.145 7.345 5 9.024 5 11v3l-2 2v1h14v-1l-2-2v-3c0-1.976-1.145-3.655-3-4.5V4c0-1.105-.895-2-2-2zm0 16c1.105 0 2-.895 2-2H8c0 1.105.895 2 2 2z" />
          </svg>

          {/* Notification Badge */}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Small Popup (Bottom Right) */}
      {isOpen && (
        <div
          className="fixed bottom-[8%] right-[2%] w-80 max-h-96 overflow-y-auto bg-white rounded-lg shadow-lg z-50 border"
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Announcements</h3>
              <button onClick={toggleModal} className="text-gray-400 hover:text-gray-600">
                ✖
              </button>
            </div>

            {notifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No notifications yet
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg cursor-pointer mb-2 border transition-colors ${
                    notification.isRead
                      ? 'bg-gray-50 border-gray-200'
                      : 'bg-blue-50 border-blue-200'
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${notification.isRead ? 'text-gray-900' : 'text-blue-900'}`}>
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-2">{notification.timestamp}</p>
                    </div>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default NotificationModal;
