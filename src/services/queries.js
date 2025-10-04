import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  onSnapshot,
  deleteDoc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';

const QUERIES_COLLECTION = 'student_queries';
const NOTIFICATIONS_COLLECTION = 'notifications';

// Query types
export const QUERY_TYPES = {
  QUESTION: 'question',
  CGPA_UPDATE: 'cgpa',
  CALENDAR_BLOCK: 'calendar'
};

// Query status
export const QUERY_STATUS = {
  PENDING: 'pending',
  UNDER_REVIEW: 'under_review',
  RESOLVED: 'resolved',
  REJECTED: 'rejected'
};

// Notification types
export const NOTIFICATION_TYPES = {
  STUDENT_QUERY: 'student_query',
  JD_APPROVAL: 'jd_approval',
  JOB_APPLICATION: 'job_application',
  CGPA_UPDATE: 'cgpa_update',
  CALENDAR_BLOCK: 'calendar_block',
  PLACEMENT_UPDATE: 'placement_update',
  DOCUMENT_UPLOAD: 'document_upload'
};

// Priority levels
export const PRIORITY_LEVELS = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
};

// Submit a new query
export const submitQuery = async (studentId, queryData) => {
  try {
    let proofUrl = null;
    
    // Handle file upload if proof document exists
    if (queryData.proof && queryData.proof instanceof File) {
      const fileRef = ref(storage, `query-proofs/${studentId}/${Date.now()}_${queryData.proof.name}`);
      const uploadResult = await uploadBytes(fileRef, queryData.proof);
      proofUrl = await getDownloadURL(uploadResult.ref);
    }

    // Prepare query document
    const queryDoc = {
      studentId,
      type: queryData.type,
      subject: queryData.subject,
      message: queryData.message || '',
      cgpa: queryData.cgpa || null,
      proofUrl,
      proofFileName: queryData.proof?.name || null,
      startDate: queryData.startDate || null,
      endDate: queryData.endDate || null,
      timeSlot: queryData.timeSlot || null,
      reason: queryData.reason || null,
      status: QUERY_STATUS.PENDING,
      adminResponse: null,
      responseDate: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    // Add query to Firestore
    const docRef = await addDoc(collection(db, QUERIES_COLLECTION), queryDoc);
    
    // Create notification for admin
    await createAdminNotification(docRef.id, queryData, studentId);
    
    return {
      id: docRef.id,
      referenceId: `STU${Math.floor(1000 + Math.random() * 9000)}`,
      ...queryDoc
    };
  } catch (error) {
    console.error('Error submitting query:', error);
    throw new Error('Failed to submit query. Please try again.');
  }
};

// Get student's queries
export const getStudentQueries = async (studentId) => {
  try {
    const q = query(
      collection(db, QUERIES_COLLECTION),
      where('studentId', '==', studentId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const queries = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      queries.push({
        id: doc.id,
        ...data,
        date: data.createdAt?.toDate?.()?.toISOString()?.split('T')[0] || new Date().toISOString().split('T')[0],
        responseDate: data.responseDate?.toDate?.()?.toISOString()?.split('T')[0] || null
      });
    });
    
    return queries;
  } catch (error) {
    console.error('Error fetching student queries:', error);
    throw new Error('Failed to load queries. Please try again.');
  }
};

// Subscribe to student's queries for real-time updates
export const subscribeToStudentQueries = (studentId, callback) => {
  try {
    const q = query(
      collection(db, QUERIES_COLLECTION),
      where('studentId', '==', studentId),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const queries = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        queries.push({
          id: doc.id,
          ...data,
          date: data.createdAt?.toDate?.()?.toISOString()?.split('T')[0] || new Date().toISOString().split('T')[0],
          responseDate: data.responseDate?.toDate?.()?.toISOString()?.split('T')[0] || null
        });
      });
      
      callback(queries);
    }, (error) => {
      console.error('Error in queries subscription:', error);
      callback([]);
    });
    
    return unsubscribe;
  } catch (error) {
    console.error('Error setting up queries subscription:', error);
    return () => {};
  }
};

// Update query status (admin function)
export const updateQueryStatus = async (queryId, status, adminResponse = null) => {
  try {
    const updateData = {
      status,
      updatedAt: serverTimestamp()
    };
    
    if (adminResponse) {
      updateData.adminResponse = adminResponse;
      updateData.responseDate = serverTimestamp();
    }
    
    await updateDoc(doc(db, QUERIES_COLLECTION, queryId), updateData);
    return true;
  } catch (error) {
    console.error('Error updating query status:', error);
    throw new Error('Failed to update query status.');
  }
};

// Create admin notification for new query
const createAdminNotification = async (queryId, queryData, studentId) => {
  try {
    // Get student profile for notification details
    const studentDoc = await getDocs(
      query(collection(db, 'students'), where('uid', '==', studentId))
    );
    
    let studentName = 'Unknown Student';
    let enrollmentId = 'N/A';
    
    if (!studentDoc.empty) {
      const studentData = studentDoc.docs[0].data();
      studentName = studentData.fullName || studentData.name || 'Unknown Student';
      enrollmentId = studentData.enrollmentId || studentData.studentId || 'N/A';
    }
    
    // Create notification based on query type
    let notificationTitle = '';
    let notificationMessage = '';
    let notificationType = '';
    
    switch (queryData.type) {
      case QUERY_TYPES.QUESTION:
        notificationTitle = 'New Student Query';
        notificationMessage = `${studentName} asked: "${queryData.subject}"`;
        notificationType = 'question_request';
        break;
      case QUERY_TYPES.CGPA_UPDATE:
        notificationTitle = 'CGPA Update Request';
        notificationMessage = `${studentName} has requested to update CGPA to ${queryData.cgpa}. Proof document attached.`;
        notificationType = 'cgpa_request';
        break;
      case QUERY_TYPES.CALENDAR_BLOCK:
        notificationTitle = 'Calendar Block Request';
        notificationMessage = `${studentName} has requested to block calendar from ${queryData.startDate} to ${queryData.endDate} for ${queryData.reason}.`;
        notificationType = 'calendar_request';
        break;
      default:
        notificationTitle = 'New Student Request';
        notificationMessage = `${studentName} has submitted a new request: "${queryData.subject}"`;
        notificationType = 'student_query';
    }
    
    const notificationDoc = {
      type: notificationType,
      title: notificationTitle,
      message: notificationMessage,
      from: `${studentName} (${enrollmentId})`,
      enrollmentId,
      time: new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }),
      date: new Date().toISOString().split('T')[0],
      isRead: false,
      priority: queryData.type === QUERY_TYPES.CGPA_UPDATE ? PRIORITY_LEVELS.HIGH : PRIORITY_LEVELS.MEDIUM,
      queryId,
      studentId,
      meta: {
        queryId,
        studentId,
        studentName,
        enrollmentId,
        queryType: queryData.type,
        subject: queryData.subject,
        status: 'pending'
      },
      createdAt: serverTimestamp()
    };
    
    await addDoc(collection(db, NOTIFICATIONS_COLLECTION), notificationDoc);
    console.log('✅ Admin notification created successfully');
  } catch (error) {
    console.error('Error creating admin notification:', error);
    // Don't throw error here as query submission should still succeed
  }
};

// Get all queries for admin (admin function)
export const getAllQueries = async (filters = {}) => {
  try {
    let constraints = [orderBy('createdAt', 'desc')];
    
    if (filters.status) {
      constraints.unshift(where('status', '==', filters.status));
    }
    
    if (filters.type) {
      constraints.unshift(where('type', '==', filters.type));
    }
    
    const q = query(collection(db, QUERIES_COLLECTION), ...constraints);
    const querySnapshot = await getDocs(q);
    const queries = [];
    
    for (const docSnap of querySnapshot.docs) {
      const data = docSnap.data();
      
      // Get student details
      let studentData = null;
      try {
        const studentQuery = query(
          collection(db, 'students'),
          where('uid', '==', data.studentId)
        );
        const studentSnapshot = await getDocs(studentQuery);
        if (!studentSnapshot.empty) {
          studentData = studentSnapshot.docs[0].data();
        }
      } catch (err) {
        console.warn('Error fetching student data for query:', err);
      }
      
      queries.push({
        id: docSnap.id,
        ...data,
        studentData,
        date: data.createdAt?.toDate?.()?.toISOString()?.split('T')[0] || new Date().toISOString().split('T')[0],
        responseDate: data.responseDate?.toDate?.()?.toISOString()?.split('T')[0] || null
      });
    }
    
    return queries;
  } catch (error) {
    console.error('Error fetching all queries:', error);
    throw new Error('Failed to load queries.');
  }
};

// ========== ADMIN NOTIFICATION FUNCTIONS ==========

// Subscribe to all notifications with real-time updates
export const subscribeToNotifications = (callback) => {
  try {
    console.log('🔄 Setting up notifications subscription...');
    const q = query(
      collection(db, NOTIFICATIONS_COLLECTION),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log('📡 Notifications snapshot received, documents:', snapshot.docs.length);
      const notifications = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        notifications.push({
          id: doc.id,
          ...data,
          // Convert Firestore timestamps to readable format
          date: data.createdAt?.toDate?.()?.toLocaleDateString() || new Date().toLocaleDateString(),
          time: data.time || data.createdAt?.toDate?.()?.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
          }) || new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
          }),
          timestamp: data.createdAt?.toDate?.() || new Date()
        });
      });
      
      console.log('📊 Processed notifications:', notifications.length);
      callback(notifications);
    }, (error) => {
      console.error('❌ Error in notifications subscription:', error);
      callback([]);
    });
    
    return unsubscribe;
  } catch (error) {
    console.error('❌ Error setting up notifications subscription:', error);
    return () => {};
  }
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId) => {
  try {
    console.log('📖 Marking notification as read:', notificationId);
    await updateDoc(doc(db, NOTIFICATIONS_COLLECTION, notificationId), {
      isRead: true,
      readAt: serverTimestamp()
    });
    console.log('✅ Notification marked as read');
    return true;
  } catch (error) {
    console.error('❌ Error marking notification as read:', error);
    throw error;
  }
};

// Delete notification
export const deleteNotification = async (notificationId) => {
  try {
    console.log('🗑️ Deleting notification:', notificationId);
    await deleteDoc(doc(db, NOTIFICATIONS_COLLECTION, notificationId));
    console.log('✅ Notification deleted');
    return true;
  } catch (error) {
    console.error('❌ Error deleting notification:', error);
    throw error;
  }
};

// Validate file upload
export const validateFile = (file) => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
  
  if (!file) {
    return { isValid: false, error: 'No file selected' };
  }
  
  if (file.size > maxSize) {
    return { isValid: false, error: 'File size must be less than 5MB' };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'Only PDF, JPG, and PNG files are allowed' };
  }
  
  return { isValid: true, error: null };
};

// Generate reference ID
export const generateReferenceId = () => {
  return `STU${Math.floor(1000 + Math.random() * 9000)}`;
};
