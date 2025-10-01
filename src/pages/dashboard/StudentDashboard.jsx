import React, { useState, useCallback, useRef, useEffect } from 'react';
import SampleResume from '../../assets/Docs/Resume(1).pdf';
import DashboardLayout from '../../components/dashboard/shared/DashboardLayout';
import DashboardHome from '../../components/dashboard/student/DashboardHome';
import JobDescription from '../../components/dashboard/student/JobDescription';
import { useAuth } from '../../hooks/useAuth';
import { 
  getStudentProfile, 
  updateCompleteStudentProfile, 
  createCompleteStudentProfile,
  getStudentSkills,
  getEducationalBackground,
} from '../../services/students';
import { getStudentApplications, applyToJob, subscribeStudentApplications } from '../../services/applications';
import { subscribeJobs } from '../../services/jobs';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SiCodeforces, SiGeeksforgeeks } from 'react-icons/si';
import { FaHackerrank, FaYoutube } from 'react-icons/fa';
import {
  Home,
  Briefcase,
  Calendar,
  SquarePen,
  Code2,
  Trophy,
  Github,
  Youtube,
  ExternalLink,
  LogOut,
  GripVertical,
  ClipboardList,
  BookOpen,
  FileText,
  Trash2,
  Upload,
  FilePlus,
  ScanLine,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader,
  Info,
  AlertTriangle,
  X
} from 'lucide-react';
import ErrorBoundary from '../../components/common/ErrorBoundary';
import ResumeManager from '../../components/resume/ResumeManager';
import ResumeAnalyzer from '../../components/resume/ResumeAnalyzer';
import CustomResumeBuilder from '../../components/resume/CustomResumeBuilder';
import { upsertResume, getResume } from '../../services/resumes';
import Query from '../../components/dashboard/student/Query';
import Resources from '../../components/dashboard/student/Resources';
import { getResumeInfo } from '../../services/resumeStorage';

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Data caching to avoid reloading on tab switches
  const [dataLoaded, setDataLoaded] = useState(false);
  const [lastLoadTime, setLastLoadTime] = useState(null);
  
  // Scroll to top when activeTab changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(15); // Default 15% (within 5%-15%)
  const [isDragging, setIsDragging] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dragRef = useRef(null);
  const [batch, setBatch] = useState('2023-2027');
  const [center, setCenter] = useState('Bangalore');



  // New state for checkbox in Edit Profile
  const [isChecked, setIsChecked] = useState(false);
  
  // Validation state for real-time feedback
  const [validationErrors, setValidationErrors] = useState({});
  
  // Alert state for Edit Profile
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState('info'); // 'success', 'error', 'warning', 'info'
  const [showFloatingAlert, setShowFloatingAlert] = useState(false);

  // Edit Profile form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [enrollmentId, setEnrollmentId] = useState('');
  const [cgpa, setCgpa] = useState('');
  const [bio, setBio] = useState('');
  const [saving, setSaving] = useState(false);
  const [Headline, setHeadline] = useState('');
  const [city, setCity] = useState('');
  const [stateRegion, setStateRegion] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [leetcode, setLeetcode] = useState('');
  const [codeforces, setCodeforces] = useState('');
  const [gfg, setGfg] = useState('');
  const [hackerrank, setHackerrank] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [school, setSchool] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');
  const [jobFlexibility, setJobFlexibility] = useState('');
  // Resume state
  const [resumeInfo, setResumeInfo] = useState({
    url: null,
    fileName: null,
    uploadedAt: null,
    hasResume: false
  });
  const [activeResumeTab, setActiveResumeTab] = useState('builder');
  
  // Skills state
  const [skillsEntries, setSkillsEntries] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [newSkill, setNewSkill] = useState({ skillName: '', rating: 1 });
  
  // Applications state
  const [applications, setApplications] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(false);
  
  // Jobs state
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [applying, setApplying] = useState({});
  
  // Job Description Modal state
  const [selectedJob, setSelectedJob] = useState(null);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  

  // Handle URL parameters to set active tab
  useEffect(() => {
    const tab = searchParams.get('tab');

    // Listen for edit profile button clicks
    const handleEditProfileClick = () => {
      setActiveTab('editProfile');
    };

    // Listen for navigate to jobs event
    const handleNavigateToJobs = () => {
      setActiveTab('jobs');
    };

    // Listen for navigate to applications event
    const handleNavigateToApplications = () => {
      setActiveTab('applications');
    };


    window.addEventListener('editProfileClicked', handleEditProfileClick);
    window.addEventListener('navigateToJobs', handleNavigateToJobs);
    window.addEventListener('navigateToApplications', handleNavigateToApplications);

    // Only set tab from URL if it's a valid tab and not on page refresh
    if (tab && ['dashboard', 'jobs', 'calendar', 'applications', 'resources', 'resume', 'editProfile'].includes(tab)) {
      // Check if this is a fresh navigation (not a refresh)
      const isRefresh = window.performance.navigation?.type === 1 ||
        window.performance.getEntriesByType('navigation')[0]?.type === 'reload';

      if (!isRefresh || tab !== 'editProfile') {
        setActiveTab(tab);
      } else {
        // On refresh, always default to dashboard
        setActiveTab('dashboard');
        // Clear the URL parameter
        navigate('/student', { replace: true });
      }
    } else {
      setActiveTab('dashboard');
    }

    return () => {
      window.removeEventListener('editProfileClicked', handleEditProfileClick);
      window.removeEventListener('navigateToJobs', handleNavigateToJobs);
      window.removeEventListener('navigateToApplications', handleNavigateToApplications);
    };
  }, [searchParams, navigate]);

  // Load profile data function (optimized with caching and minimal loading)
  const loadProfile = useCallback(async (forceRefresh = false) => {
    if (!user?.uid) return;
    
    // Check if data is already loaded and fresh (within 5 minutes)
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;
    if (!forceRefresh && dataLoaded && lastLoadTime && (now - lastLoadTime) < fiveMinutes) {
      return; // Use cached data
    }
    
    try {
      // Only load essential profile data first for faster initial render
      const profileData = await getStudentProfile(user.uid);
      
      // Update profile data immediately
      if (profileData) {
        setFullName(profileData.fullName || '');
        setEmail(profileData.email || '');
        setPhone(profileData.phone || '');
        setEnrollmentId(profileData.enrollmentId || '');
        setCgpa(profileData.cgpa?.toString?.() || '');
        setBatch(profileData.batch || batch);
        setCenter(profileData.center || center);
        setBio(profileData.bio || '');
        setHeadline(profileData.Headline || '');
        setCity(profileData.city || '');
        setStateRegion(profileData.stateRegion || profileData.state || '');
        setLinkedin(profileData.linkedin || '');
        setLeetcode(profileData.leetcode || '');
        setCodeforces(profileData.codeforces || '');
        setGfg(profileData.gfg || '');
        setHackerrank(profileData.hackerrank || '');
        setGithubUrl(profileData.githubUrl || profileData.github || '');
        setYoutubeUrl(profileData.youtubeUrl || profileData.youtube || '');
        setSchool(profileData.school || '');
        setProfilePhoto(profileData.profilePhoto || '');
        setJobFlexibility(profileData.jobFlexibility || '');
        // Load resume info if present on profile
        if (profileData.resumeUrl) {
          setResumeInfo({
            url: profileData.resumeUrl,
            fileName: profileData.resumeFileName || 'resume.pdf',
            uploadedAt: profileData.resumeUploadedAt || null,
            hasResume: true
          });
        }
      }
      
      // Mark data as loaded immediately for faster UI
      setDataLoaded(true);
      setLastLoadTime(now);
      
      // Load secondary data immediately in background (no artificial delay)
      Promise.allSettled([
        getStudentSkills(user.uid),
        getStudentApplications(user.uid)
      ]).then(([skillsResult, applicationsResult]) => {
        // Handle skills data
        if (skillsResult.status === 'fulfilled') {
          setSkillsEntries(skillsResult.value || []);
        } else {
          console.warn('Failed to load skills data', skillsResult.reason);
          setSkillsEntries([]);
        }
        
        // Handle applications data
        if (applicationsResult.status === 'fulfilled') {
          setApplications(applicationsResult.value || []);
        } else {
          console.warn('Failed to load applications data', applicationsResult.reason);
          setApplications([]);
        }
        
        setLoadingSkills(false);
        setLoadingApplications(false);
      });
      
    } catch (err) {
      console.warn('Failed to load profile data', err);
      setLoadingSkills(false);
      setLoadingApplications(false);
    }
  }, [user?.uid, batch, center, dataLoaded, lastLoadTime]);


  const loadSkillsData = useCallback(async () => {
    if (!user?.uid) return;
    try {
      setLoadingSkills(true);
      const skillsData = await getStudentSkills(user.uid);
      setSkillsEntries(skillsData || []);
    } catch (err) {
      console.error('Failed to load skills data', err);
    } finally {
      setLoadingSkills(false);
    }
  }, [user?.uid]);

  const loadApplicationsData = useCallback(() => {
    if (!user?.uid) return;
    
    setLoadingApplications(true);
    const unsubscribe = subscribeStudentApplications(user.uid, (applicationsData) => {
      setApplications(applicationsData || []);
      setLoadingApplications(false);
    });

    return unsubscribe;
  }, [user?.uid]);

  const loadJobsData = useCallback(() => {
    setLoadingJobs(true);
    const unsubscribe = subscribeJobs((jobsData) => {
      setJobs(jobsData || []);
      setLoadingJobs(false);
    }, { status: 'active' });

    return unsubscribe;
  }, []);

  const handleApplyToJob = async (job) => {
    if (!user?.uid || !job?.id) {
      console.error('Missing user ID or job ID');
      return;
    }

    try {
      setApplying(prev => ({ ...prev, [job.id]: true }));
      
      console.log('Applying to job:', {
        jobId: job.id,
        jobTitle: job.jobTitle,
        companyId: job.companyId,
        companyName: job.company?.name,
        fullJob: job
      });
      
      // Extract companyId from job data or company object
      const companyId = job.companyId || job.company?.id || null;
      console.log('Using companyId:', companyId);
      
      await applyToJob(user.uid, job.id, companyId);
      
      // No need to manually reload - real-time subscription will update automatically
      
    } catch (error) {
      console.error('Error applying to job:', error);
    } finally {
      setApplying(prev => ({ ...prev, [job.id]: false }));
    }
  };

  const hasApplied = (jobId) => {
    return applications.some(app => app.jobId === jobId);
  };

  // Job Description Modal handlers
  const handleKnowMore = (job) => {
    console.log('handleKnowMore called with job:', job);
    setSelectedJob(job);
    setIsJobModalOpen(true);
  };

  const handleCloseJobModal = () => {
    setIsJobModalOpen(false);
    setSelectedJob(null);
  };

  // Load data when user is available
  useEffect(() => {
    if (user?.uid && !dataLoaded) {
      loadProfile();
      loadSkillsData();
    }
  }, [user?.uid, dataLoaded, loadProfile, loadSkillsData]);

  // Always maintain real-time subscriptions for jobs and applications
  useEffect(() => {
    if (user?.uid) {
      const unsubscribeJobs = loadJobsData();
      const unsubscribeApplications = loadApplicationsData();
      
      return () => {
        if (unsubscribeJobs) unsubscribeJobs();
        if (unsubscribeApplications) unsubscribeApplications();
      };
    }
  }, [user?.uid, loadJobsData, loadApplicationsData]);

  // Validation helper functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  };

  const validateCGPA = (cgpa) => {
    const cgpaNum = parseFloat(cgpa);
    return !isNaN(cgpaNum) && cgpaNum >= 0 && cgpaNum <= 10;
  };

  const validateURL = (url) => {
    if (!url.trim()) return true; // Optional field
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
      return true;
    } catch {
      return false;
    }
  };

  const validateProfile = () => {
    const errors = [];
    const missingFields = [];

    // Required field validations with field tracking
    if (!fullName.trim()) {
      errors.push('Full name is required');
      missingFields.push({ field: 'fullName', section: 'basic' });
    }
    if (!email.trim()) {
      errors.push('Email is required');
      missingFields.push({ field: 'email', section: 'basic' });
    } else if (!validateEmail(email.trim())) {
      errors.push('Please enter a valid email address');
      missingFields.push({ field: 'email', section: 'basic' });
    }
    
    if (!phone.trim()) {
      errors.push('Phone number is required');
      missingFields.push({ field: 'phone', section: 'basic' });
    } else if (!validatePhone(phone.trim())) {
      errors.push('Please enter a valid phone number');
      missingFields.push({ field: 'phone', section: 'basic' });
    }

    if (!school.trim()) {
      errors.push('School selection is required');
      missingFields.push({ field: 'school', section: 'academic' });
    }

    // Optional field validations
    if (cgpa && !validateCGPA(cgpa)) errors.push('CGPA must be between 0 and 10');
    
    // URL validations for social profiles
    if (linkedin && !validateURL(linkedin)) errors.push('Please enter a valid LinkedIn URL');
    if (githubUrl && !validateURL(githubUrl)) errors.push('Please enter a valid GitHub URL');
    if (youtubeUrl && !validateURL(youtubeUrl)) errors.push('Please enter a valid YouTube URL');

    return { errors, missingFields };
  };

  // Real-time field validation
  const validateField = (fieldName, value) => {
    const errors = { ...validationErrors };
    
    switch (fieldName) {
      case 'fullName':
        if (!value.trim()) {
          errors.fullName = 'Full name is required';
        } else {
          delete errors.fullName;
        }
        break;
      case 'email':
        if (!value.trim()) {
          errors.email = 'Email is required';
        } else if (!validateEmail(value.trim())) {
          errors.email = 'Please enter a valid email address';
        } else {
          delete errors.email;
        }
        break;
      case 'phone':
        if (!value.trim()) {
          errors.phone = 'Phone number is required';
        } else if (!validatePhone(value.trim())) {
          errors.phone = 'Please enter a valid phone number';
        } else {
          delete errors.phone;
        }
        break;
      case 'enrollmentId':
        if (!value.trim()) {
          errors.enrollmentId = 'Enrollment ID is required';
        } else if (value.trim().length < 3) {
          errors.enrollmentId = 'Enrollment ID must be at least 3 characters';
        } else {
          delete errors.enrollmentId;
        }
        break;
      case 'cgpa':
        if (value && !validateCGPA(value)) {
          errors.cgpa = 'CGPA must be between 0 and 10';
        } else {
          delete errors.cgpa;
        }
        break;
      default:
        break;
    }
    
    setValidationErrors(errors);
  };

  // Skills management functions
  const handleSaveSkill = async () => {
    if (!user?.uid) return;
    
    const { skillName, rating } = newSkill;
    if (!skillName.trim()) {
      alert('Please enter a skill name');
      return;
    }

    try {
      const skillData = {
        studentId: user.uid,
        skillName: skillName.trim(),
        rating: parseInt(rating)
      };

      await addOrUpdateSkill(skillData);
      
      // Reload skills data
      const updatedSkills = await getStudentSkills(user.uid);
      setSkillsEntries(updatedSkills || []);
      
      // Reset form
      setNewSkill({ skillName: '', rating: 1 });
      
      alert('Skill saved successfully!');
    } catch (error) {
      console.error('Error saving skill:', error);
      alert('Failed to save skill');
    }
  };

  const handleDeleteSkill = async (skillId) => {
    if (!user?.uid || !skillId) return;
    
    if (!confirm('Are you sure you want to delete this skill?')) return;

    try {
      await deleteSkill(skillId);
      
      // Reload skills data
      const updatedSkills = await getStudentSkills(user.uid);
      setSkillsEntries(updatedSkills || []);
      
      alert('Skill deleted successfully!');
    } catch (error) {
      console.error('Error deleting skill:', error);
      alert('Failed to delete skill');
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!user?.uid) {
      alert('You must be logged in to save your profile.');
      return;
    }

    // Validate form data
    const validation = validateProfile();
    if (validation.errors.length > 0) {
      // Focus on first missing field and scroll to its section
      if (validation.missingFields.length > 0) {
        const firstMissing = validation.missingFields[0];
        const fieldElement = document.getElementById(firstMissing.field);
        if (fieldElement) {
          fieldElement.focus();
          fieldElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      setAlertMessage('Please fix the following errors:\n\n' + validation.errors.join('\n'));
      setAlertType('error');
      setShowFloatingAlert(true);
      
      setTimeout(() => {
        setShowFloatingAlert(false);
        setAlertMessage(null);
      }, 4000);
      return;
    }

    try {
      setSaving(true);
      
      const profileData = {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        enrollmentId: enrollmentId.trim(),
        cgpa: cgpa ? Number(cgpa) : null,
        batch,
        center,
        bio: bio.trim(),
        Headline: Headline.trim(),
        city: city.trim(),
        stateRegion: stateRegion.trim(),
        linkedin: linkedin.trim(),
        githubUrl: githubUrl.trim(),
        youtubeUrl: youtubeUrl.trim(),
        leetcode: leetcode.trim(),
        codeforces: codeforces.trim(),
        gfg: gfg.trim(),
        hackerrank: hackerrank.trim(),
        school: school.trim(),
        profilePhoto: profilePhoto.trim(),
        jobFlexibility: jobFlexibility.trim(),
      };

      // Show success immediately for better UX (optimistic update)
      setAlertMessage('Successfully Update Profile Details');
      setAlertType('success');
      setShowFloatingAlert(true);
      setIsChecked(false);
      
      // Save to database in background
      const existing = await getStudentProfile(user.uid);
      if (existing) {
        await updateCompleteStudentProfile(user.uid, profileData, []);
      } else {
        await createCompleteStudentProfile(user.uid, profileData, []);
      }
      
      // Preload dashboard data while showing success message
      const unsubscribe = loadJobsData();
      // Note: cleanup handled by useEffect
      
      setTimeout(() => {
        setShowFloatingAlert(false);
        setAlertMessage(null);
        setActiveTab('dashboard');
      }, 3000);
    } catch (err) {
      console.error('Failed to save profile', err);
      
      // More specific error messages
      let errorMessage = 'Failed to save profile. ';
      if (err.code === 'permission-denied') {
        errorMessage += 'You do not have permission to update this profile.';
      } else if (err.code === 'network-request-failed') {
        errorMessage += 'Please check your internet connection and try again.';
      } else if (err.code === 'unavailable') {
        errorMessage += 'Service is temporarily unavailable. Please try again later.';
      } else {
        errorMessage += err.message || 'Please try again.';
      }
      
      setAlertMessage(errorMessage);
      setAlertType('error');
      setShowFloatingAlert(true);
      
      setTimeout(() => {
        setShowFloatingAlert(false);
        setAlertMessage(null);
      }, 4000);
    } finally {
      setSaving(false);
    }
  };

  // Handle resume update callback
  const handleResumeUpdate = (info) => {
    console.log('handleResumeUpdate called with:', info);
    setResumeInfo(info);
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'jobs', label: 'Explore Jobs', icon: Briefcase },
    { id: 'resume', label: 'Resume', icon: FileText },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'applications', label: 'Track Applications', icon: ClipboardList },
    { id: 'resources', label: 'Placement Resources', icon: BookOpen },
    { id: 'editProfile', label: 'Edit Profile', icon: SquarePen },
    { id: 'raiseQuery', label: 'Raise Query', icon: AlertCircle }, // Added new tab
  ];

  const LeetCodeIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="m15.42 16.94-2.25 2.17a2.1 2.1 0 0 1-1.52.56 2.1 2.1 0 0 1-1.52-.56l-3.61-3.63a2.18 2.18 0 0 1-.58-1.55 2.07 2.07 0 0 1 .58-1.52l3.6-3.65a2.1 2.1 0 0 1 1.53-.54 2.08 2.08 0 0 1 1.52.55l2.25 2.17A1.14 1.14 0 0 0 17 9.33l-2.17-2.2a4.24 4.24 0 0 0-2-1.12l2.06-2.08a1.15 1.15 0 0 0-1.62-1.62l-8.43 8.42a4.48 4.48 0 0 0-1.24 3.2 4.57 4.57 0 0 0 1.24 3.23l3.63 3.63A4.38 4.38 0 0 0 11.66 22a4.45 4.45 0 0 0 3.2-1.25L17 18.56a1.14 1.14 0 0 0-1.61-1.62z"></path>
      <path d="M19.34 12.84h-8.45a1.12 1.12 0 0 0 0 2.24h8.45a1.12 1.12 0 0 0 0-2.24"></path>
    </svg>
  );

  const skillsCredentials = [
    { id: 'leetcode', label: 'LeetCode', icon: LeetCodeIcon, color: 'text-orange-600' },
    { id: 'codeforces', label: 'Codeforces', icon: SiCodeforces, color: 'text-blue-600' },
    { id: 'gfg', label: 'GeeksforGeeks', icon: SiGeeksforgeeks, color: 'text-green-600' },
    { id: 'hackerrank', label: 'HackerRank', icon: FaHackerrank, color: 'text-emerald-600' },
    { id: 'github', label: 'GitHub', icon: Github, color: 'text-gray-700' },
    { id: 'youtube', label: 'YouTube', icon: FaYoutube, color: 'text-red-600' },
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    // Clear alert when switching tabs
    setShowFloatingAlert(false);
    setAlertMessage(null);
  };

  const handleSkillClick = (skillId) => {
    const urls = {
      leetcode: 'https://leetcode.com',
      codeforces: 'https://codeforces.com',
      gfg: 'https://geeksforgeeks.org',
      hackerrank: 'https://hackerrank.com',
      github: 'https://github.com',
      youtube: 'https://youtube.com'
    };
    window.open(urls[skillId], '_blank');
  };

  const handleLogout = async () => {
    try {
      console.log('Logout button clicked - starting logout process');
      await logout();
      console.log('Logout successful - navigating to home');
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Logout failed: ' + error.message);
    }
  };

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;

    const windowWidth = window.innerWidth;
    const newWidth = (e.clientX / windowWidth) * 100;

    // Constrain between 5% and 15%
    const constrainedWidth = Math.min(Math.max(newWidth, 5), 15);
    setSidebarWidth(constrainedWidth);
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'applied': return <Clock size={16} />;
      case 'shortlisted': return <AlertCircle size={16} />;
      case 'interviewed': return <CheckCircle size={16} />;
      case 'offered': return <CheckCircle size={16} />;
      case 'selected': return <CheckCircle size={16} />;
      case 'rejected': return <XCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'applied': return 'bg-[#3c80a7]/20 text-[#3c80a7]';
      case 'shortlisted': return 'bg-yellow-100 text-yellow-800';
      case 'interviewed': return 'bg-purple-100 text-purple-800';
      case 'offered': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRowBgColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'applied': return 'from-[#f0f8fa] to-[#d6eaf5]';
      case 'shortlisted': return 'from-yellow-50 to-yellow-100';
      case 'interviewed': return 'from-purple-50 to-purple-100';
      case 'offered': return 'from-green-50 to-green-100';
      case 'rejected': return 'from-red-50 to-red-100';
      default: return 'from-gray-50 to-gray-100';
    }
  };

  const getCompanyInitial = (companyName) => {
    return companyName ? companyName.charAt(0).toUpperCase() : '?';
  };

  const getCompanyColor = (companyName) => {
    const colors = [
      'bg-[#3c80a7]', 'bg-green-600', 'bg-purple-600',
      'bg-red-600', 'bg-indigo-600', 'bg-pink-600'
    ];
    const index = companyName ? companyName.length % colors.length : 0;
    return colors[index];
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardHome 
          studentData={{
            fullName,
            email,
            phone,
            enrollmentId,
            cgpa,
            batch,
            center,
            bio,
            Headline,
            city,
            stateRegion,
            linkedin,
            leetcode,
            codeforces,
            gfg,
            hackerrank,
            githubUrl,
            youtubeUrl,
            school,
            profilePhoto,
            jobFlexibility
          }}
          jobs={jobs}
          applications={applications}
          skillsEntries={skillsEntries}
          loadingJobs={loadingJobs}
          loadingApplications={loadingApplications}
          loadingSkills={loadingSkills}
          handleApplyToJob={handleApplyToJob}
          hasApplied={hasApplied}
          applying={applying}
        />;

      case 'jobs':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Explore Job Opportunities</h2>
              
              {loadingJobs ? (
                <div className="flex justify-center items-center py-12">
                  <Loader className="h-8 w-8 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-600">Loading jobs...</span>
                </div>
              ) : jobs.length === 0 ? (
                <div className="text-center py-12">
                  <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No jobs available at the moment.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {/* Column Headers */}
                  <div className="grid grid-cols-5 gap-4 mb-3 py-3 px-4 bg-gray-50 rounded-lg">
                    <div className="text-gray-700 font-semibold text-sm">Company</div>
                    <div className="text-gray-700 font-semibold text-sm">Job Title</div>
                    <div className="text-gray-700 font-semibold text-sm">Location</div>
                    <div className="text-gray-700 font-semibold text-sm">Salary (CTC)</div>
                    <div></div>
                  </div>

                  {/* Job Listings */}
                  {jobs.map((job) => (
                    <div
                      key={job.id}
                      className="grid grid-cols-5 gap-4 p-4 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-blue-100 hover:shadow-md transition-all duration-200 border border-gray-200"
                    >
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 ${getCompanyColor(job.company?.name || job.company)}`}>
                          {getCompanyInitial(job.company?.name || job.company)}
                        </div>
                        <span className="text-sm font-medium text-gray-900 truncate">
                          {job.company?.name || job.company || 'Company'}
                        </span>
                      </div>

                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-800 truncate">
                          {job.jobTitle}
                        </span>
                      </div>

                      <div className="flex items-center">
                        <span className="text-sm text-gray-600 truncate">
                          {job.location}
                        </span>
                      </div>

                      <div className="flex items-center">
                        <span className="text-sm font-medium text-green-600">
                          {job.salary ? `₹${(job.salary / 100000).toFixed(1)} LPA` : 'Not specified'}
                        </span>
                      </div>

                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleKnowMore(job)}
                          className="px-2 py-1 border border-[#3c80a7] bg-[#8ec5ff] text-black font-medium rounded-sm hover:bg-[#2563eb] hover:text-white transition-all duration-200 shadow-sm text-xs whitespace-nowrap"
                        >
                          Know More
                        </button>
                        <button
                          onClick={() => handleApplyToJob(job)}
                          disabled={hasApplied(job.id) || applying[job.id]}
                          className={`px-2 py-1 rounded-sm text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                            hasApplied(job.id)
                              ? 'bg-green-100 text-green-700 cursor-not-allowed border border-green-300'
                              : applying[job.id]
                              ? 'bg-blue-100 text-blue-700 cursor-not-allowed border border-blue-300'
                              : 'border border-green-600 bg-[#268812] text-white hover:bg-green-600'
                          }`}
                        >
                          {hasApplied(job.id) ? (
                            <>
                              <CheckCircle className="h-3 w-3 inline mr-1" />
                              Applied
                            </>
                          ) : applying[job.id] ? (
                            <>
                              <Loader className="h-3 w-3 inline mr-1 animate-spin" />
                              Applying...
                            </>
                          ) : (
                            'Apply Now'
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'resume':
        return (
          <div className="space-y-6">
            {/* Outer card matching Edit Profile style */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {/* Heading inside the card */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <FileText className="h-6 w-6 text-blue-600" />
                  Resume Management
                </h2>
              </div>
              
              {/* Tab Navigation */}
              <div className="mb-6">
                <div className="space-y-4">
                  <div className="flex border-b border-gray-200">
                    <button
                      onClick={() => setActiveResumeTab('builder')}
                      className={`px-4 py-2 text-sm font-medium ${
                        activeResumeTab === 'builder'
                          ? 'border-b-2 border-blue-500 text-blue-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Resume Builder
                    </button>
                    <button
                      onClick={() => setActiveResumeTab('upload')}
                      className={`px-4 py-2 text-sm font-medium ${
                        activeResumeTab === 'upload'
                          ? 'border-b-2 border-blue-500 text-blue-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Upload & Manage
                    </button>
                    <button
                      onClick={() => setActiveResumeTab('analysis')}
                      className={`px-4 py-2 text-sm font-medium ${
                        activeResumeTab === 'analysis'
                          ? 'border-b-2 border-blue-500 text-blue-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      AI Analysis
                    </button>
                  </div>

                  <div className="mt-6">
                    {activeResumeTab === 'builder' && user?.uid && (
                      <ErrorBoundary>
                        <CustomResumeBuilder userId={user.uid} />
                      </ErrorBoundary>
                    )}
                    {activeResumeTab === 'upload' && user?.uid && (
                      <ErrorBoundary>
                        <ResumeManager 
                          userId={user.uid} 
                          onResumeUpdate={handleResumeUpdate}
                        />
                      </ErrorBoundary>
                    )}
                    {activeResumeTab === 'analysis' && user?.uid && (
                      <ErrorBoundary>
                        <ResumeAnalyzer 
                          userId={user.uid}
                          resumeInfo={resumeInfo}
                        />
                      </ErrorBoundary>
                    )}
                  </div>
                </div>
              </div>

              {/* Tab Content */}
              {activeResumeTab === 'manager' && (
                <div className="w-full">
                  <ErrorBoundary>
                    {user?.uid && (
                      <ResumeManager 
                        userId={user.uid}
                        onResumeUpdate={handleResumeUpdate}
                      />
                    )}
                  </ErrorBoundary>
                </div>
              )}

              {activeResumeTab === 'analyzer' && (
                <div className="w-full">
                  <ErrorBoundary>
                    {user?.uid && (
                      <ResumeAnalyzer 
                        resumeInfo={resumeInfo}
                        userId={user.uid}
                      />
                    )}
                  </ErrorBoundary>
                </div>
              )}


              {activeResumeTab === 'enhancer' && (
                <div className="w-full h-[70vh]">
                  <ErrorBoundary>
                    {user?.uid && (
                      <ResumeEnhancer uid={user.uid} resumeId="default" />
                    )}
                  </ErrorBoundary>
                </div>
              )}
            </div>
          </div>
        );

      case 'calendar':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Academic Calendar</h2>
              {/* Calendar content omitted for brevity */}
            </div>
          </div>
        );

      case 'applications':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Track Applications</h2>
              
              {loadingApplications ? (
                <div className="flex items-center justify-center py-8">
                  <Loader className="animate-spin h-8 w-8 text-blue-600" />
                  <span className="ml-2 text-gray-600">Loading applications...</span>
                </div>
              ) : !applications || applications.length === 0 ? (
                <div className="text-center py-12">
                  <ClipboardList className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500 text-lg">No applications found</p>
                  <p className="text-gray-400 text-sm">Start applying to jobs to track your applications here!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Application Cards with Full Job Details */}
                  {applications.map((application) => (
                    <div
                      key={application.id}
                      className={`p-6 rounded-xl bg-gradient-to-r ${getRowBgColor(application.status)} hover:shadow-lg transition-all duration-200 border border-gray-100`}
                    >
                      {/* Header Row */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className={`${getCompanyColor(application.company?.name)} w-12 h-12 rounded-lg mr-4 flex items-center justify-center`}>
                            <span className="text-white font-bold text-lg">
                              {getCompanyInitial(application.company?.name)}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">
                              {application.job?.jobTitle || 'Unknown Position'}
                            </h3>
                            <p className="text-lg font-semibold text-gray-700">
                              {application.company?.name || 'Unknown Company'}
                            </p>
                          </div>
                        </div>
                        <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                          {getStatusIcon(application.status)}
                          {application.status
                            ? application.status.charAt(0).toUpperCase() + application.status.slice(1)
                            : 'Unknown'}
                        </span>
                      </div>

                      {/* Job Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div className="bg-white/50 p-3 rounded-lg">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Location</p>
                          <p className="text-sm font-semibold text-gray-800">
                            {application.job?.location || 'Not specified'}
                          </p>
                        </div>
                        <div className="bg-white/50 p-3 rounded-lg">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Experience</p>
                          <p className="text-sm font-semibold text-gray-800">
                            {application.job?.experienceLevel || 'Not specified'}
                          </p>
                        </div>
                        <div className="bg-white/50 p-3 rounded-lg">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Job Type</p>
                          <p className="text-sm font-semibold text-gray-800">
                            {application.job?.jobType || 'Not specified'}
                          </p>
                        </div>
                        <div className="bg-white/50 p-3 rounded-lg">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Salary</p>
                          <p className="text-sm font-semibold text-gray-800">
                            {application.job?.salaryRange || 'Not disclosed'}
                          </p>
                        </div>
                      </div>

                      {/* Application Timeline */}
                      <div className="flex items-center justify-between text-sm text-gray-600 bg-white/30 p-3 rounded-lg">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span className="font-medium">Applied: {formatDate(application.appliedDate)}</span>
                        </div>
                        {application.interviewDate && (
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            <span className="font-medium">Interview: {formatDate(application.interviewDate)}</span>
                          </div>
                        )}
                        {application.job?.deadline && (
                          <div className="flex items-center">
                            <AlertCircle className="w-4 h-4 mr-2" />
                            <span className="font-medium">Deadline: {formatDate(application.job.deadline)}</span>
                          </div>
                        )}
                      </div>

                      {/* Job Description Preview */}
                      {application.job?.description && (
                        <div className="mt-4 bg-white/30 p-3 rounded-lg">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Job Description</p>
                          <p className="text-sm text-gray-700 line-clamp-2">
                            {application.job.description.length > 150 
                              ? `${application.job.description.substring(0, 150)}...` 
                              : application.job.description}
                          </p>
                        </div>
                      )}

                      {/* Skills Required */}
                      {application.job?.requiredSkills && application.job.requiredSkills.length > 0 && (
                        <div className="mt-4">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Required Skills</p>
                          <div className="flex flex-wrap gap-2">
                            {application.job.requiredSkills.slice(0, 6).map((skill, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                              >
                                {skill}
                              </span>
                            ))}
                            {application.job.requiredSkills.length > 6 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                                +{application.job.requiredSkills.length - 6} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Summary */}
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">Application Summary</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{applications.length}</div>
                        <div className="text-sm text-blue-700">Total Applied</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-yellow-600">
                          {applications.filter(app => app.status === 'shortlisted').length}
                        </div>
                        <div className="text-sm text-yellow-700">Shortlisted</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">
                          {applications.filter(app => app.status === 'interviewed').length}
                        </div>
                        <div className="text-sm text-purple-700">Interviewed</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          {applications.filter(app => app.status === 'offered').length}
                        </div>
                        <div className="text-sm text-green-700">Offers</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'resources':
        return <Resources />;

      case 'editProfile':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h2>
              
              
              <form className="space-y-6" onSubmit={handleSaveProfile}>
                {/* Profile Photo Section - Top Row */}
                <div className="flex gap-4 w-1/2 pr-3">
                  {profilePhoto && (
                    <div className="w-1/2 flex items-center justify-center">
                      <div className="text-center">
                        <img src={profilePhoto} alt="Profile Preview" className="w-23 h-23 rounded-full object-cover mx-auto border-4 border-gray-200 shadow-lg" />
                        <p className="text-sm text-gray-600 mt-2">Profile Preview</p>
                      </div>
                    </div>
                  )}
                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (e) => setProfilePhoto(e.target.result);
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <div className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer hover:bg-gray-50 transition-colors">
                        <span className="text-gray-700">
                          {profilePhoto ? 'Change Photo' : 'Choose a photo'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name <span className="text-red-500">*</span></label>
                    <input
                      id="fullName"
                      type="text"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        validateField('fullName', e.target.value);
                      }}
                    />
                    {validationErrors.fullName && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.fullName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email <span className="text-red-500">*</span></label>
                    <input
                      id="email"
                      type="email"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        validateField('email', e.target.value);
                      }}
                    />
                    {validationErrors.email && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number <span className="text-red-500">*</span></label>
                    <input
                      id="phone"
                      type="tel"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your phone number"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        validateField('phone', e.target.value);
                      }}
                    />
                    {validationErrors.phone && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.phone}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Enrollment ID <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your enrollment ID"
                      value={enrollmentId}
                      onChange={(e) => setEnrollmentId(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CGPA</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your CGPA"
                      value={cgpa}
                      onChange={(e) => setCgpa(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">School <span className="text-red-500">*</span></label>
                    <select
                      id="school"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={school}
                      onChange={(e) => setSchool(e.target.value)}
                    >
                      <option value="">Select School</option>
                      <option value="School of Technology">School of Technology</option>
                      <option value="School of Management">School of Management</option>
                      <option value="School of HealthCare">School of HealthCare</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State/Region</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your state or region"
                      value={stateRegion}
                      onChange={(e) => setStateRegion(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Headline</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Your professional Headline"
                      value={Headline}
                      onChange={(e) => setHeadline(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                    <input
                      type="url"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://linkedin.com/in/username"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">YouTube</label>
                    <input
                      type="url"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://youtube.com/@channel"
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                    />
                  </div>
                  {school === 'School of Technology' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">GitHub</label>
                      <input
                        type="url"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://github.com/username"
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                      />
                    </div>
                  )}
                </div>

                {school === 'School of Technology' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">LeetCode</label>
                      <input
                        type="url"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://leetcode.com/u/username"
                        value={leetcode}
                        onChange={(e) => setLeetcode(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Codeforces</label>
                      <input
                        type="url"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://codeforces.com/profile/username"
                        value={codeforces}
                        onChange={(e) => setCodeforces(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {school === 'School of Technology' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">GeeksforGeeks</label>
                      <input
                        type="url"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://auth.geeksforgeeks.org/user/username"
                        value={gfg}
                        onChange={(e) => setGfg(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">HackerRank</label>
                      <input
                        type="url"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://www.hackerrank.com/profile/username"
                        value={hackerrank}
                        onChange={(e) => setHackerrank(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    <textarea
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="4"
                      placeholder="Write a brief bio about yourself"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    ></textarea>
                  </div>

                <div className="space-x-2 px-4 mb-2 text-xs">
                  <input
                    type="checkbox"
                    id="editCheckbox"
                    checked={isChecked}
                    onChange={() => setIsChecked(!isChecked)}
                  />
                  <label htmlFor="editCheckbox">
                    I acknowledge that the information provided on this dashboard is accurate to the best of the institution’s knowledge. I understand that the institution shall not be held liable for any errors, omissions, or discrepancies.
                  </label>
                </div>

                <div className="flex space-x-4 justify-center">
                  <button
                    type="submit"
                    id='editSaveBtn'
                    disabled={!isChecked || saving}
                    className={`px-6 py-2 rounded-md text-white transition-colors ${(!isChecked || saving) ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        );

      case 'raiseQuery':
        return <Query />;

      default:
        return <DashboardHome 
          studentData={{
            fullName,
            email,
            phone,
            enrollmentId,
            cgpa,
            batch,
            center,
            bio,
            Headline,
            city,
            stateRegion,
            linkedin,
            leetcode,
            codeforces,
            gfg,
            hackerrank,
            githubUrl,
            youtubeUrl,
            school,
            profilePhoto,
            jobFlexibility
          }}
          jobs={jobs}
          applications={applications}
          skillsEntries={skillsEntries}
          loadingJobs={loadingJobs}
          loadingApplications={loadingApplications}
          loadingSkills={loadingSkills}
          handleApplyToJob={handleApplyToJob}
          hasApplied={hasApplied}
          applying={applying}
        />;
    }
  };

  return (
    <>
      <DashboardLayout>
        <div className="flex min-h-screen relative">
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
                          onClick={() => handleTabClick(tab.id)}
                          className={`w-full flex items-center rounded-lg text-xs font-medium transition-all duration-200 ${activeTab === tab.id
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

              <div className="mb-6">
                {sidebarWidth >= 9 && (
                  <h2 className="text-base font-bold text-gray-900 mb-3">Skills & Credentials</h2>
                )}
                <nav className="space-y-1">
                  {skillsCredentials.map((skill) => {
                    const Icon = skill.icon;
                    return (
                      <div key={skill.id} className="mb-1">
                        <button
                          onClick={() => handleSkillClick(skill.id)}
                          className={`w-full flex items-center rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-200 transition-all duration-200 group ${sidebarWidth < 12 ? 'justify-center px-2 py-2' : 'px-3 py-2'
                            }`}
                          title={sidebarWidth < 9 ? skill.label : ''}
                        >
                          <Icon className={`h-4 w-4 ${sidebarWidth >= 9 ? 'mr-2' : ''} ${skill.color}`} />
                          {sidebarWidth >= 9 && (
                            <>
                              <span className="flex-1 text-left">{skill.label}</span>
                              <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </nav>
              </div>

              <div className="mt-auto pt-4 pb-[35%] border-t border-gray-300">
                <button
                  onClick={handleLogout}
                  className={`w-full flex items-center rounded-lg text-xs font-medium text-red-500 hover:bg-red-100 transition-all duration-200 ${sidebarWidth < 9 ? 'justify-center px-2 py-2 mb-10' : 'px-2 py-3'
                    }`}
                  title={sidebarWidth < 9 ? 'Logout' : ''}
                >
                  <LogOut className={`h-4 w-4 ${sidebarWidth >= 9 ? 'mr-2' : ''}`} />
                  {sidebarWidth >= 9 && 'Logout'}
                </button>
              </div>
            </div>

            <div
              ref={dragRef}
              className="absolute top-0 right-0 w-1 h-full cursor-col-resize bg-gray-300 hover:bg-blue-500 transition-colors duration-200"
              onMouseDown={handleMouseDown}
            />
          </aside>

          <main
            className="bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 min-h-screen transition-all duration-200 ease-in-out"
            style={{
              marginLeft: `${sidebarWidth}%`,
              width: `${100 - sidebarWidth}%`
            }}
          >
            {mobileMenuOpen && (
              <div className="md:hidden bg-white border-b border-gray-200 shadow-lg">
                <div className="px-4 py-3">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Navigation</h3>
                  <div className="space-y-2">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => handleTabClick(tab.id)}
                          className={`flex items-center w-full px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === tab.id
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                            : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                            }`}
                        >
                          <Icon className="h-5 w-5 mr-3" />
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            <div className="p-8">
              {renderContent()}
            </div>
          </main>
        </div>
      </DashboardLayout>
      
      {/* Floating Alert for All Types */}
      {showFloatingAlert && alertMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top duration-300">
          <div className={`rounded-lg shadow-lg border p-4 flex items-center space-x-3 min-w-[300px] ${
            alertType === 'success' 
              ? 'bg-white border-green-200'
              : alertType === 'error'
              ? 'bg-white border-red-200'
              : alertType === 'warning'
              ? 'bg-white border-yellow-200'
              : 'bg-white border-blue-200'
          }`}>
            <div className="flex-shrink-0">
              {alertType === 'success' && <CheckCircle className="h-6 w-6 text-green-600" />}
              {alertType === 'error' && <XCircle className="h-6 w-6 text-red-600" />}
              {alertType === 'warning' && <AlertTriangle className="h-6 w-6 text-yellow-600" />}
              {alertType === 'info' && <Info className="h-6 w-6 text-blue-600" />}
            </div>
            <div className="flex-1">
              <div className={`text-sm font-medium ${
                alertType === 'success' 
                  ? 'text-green-800'
                  : alertType === 'error'
                  ? 'text-red-800'
                  : alertType === 'warning'
                  ? 'text-yellow-800'
                  : 'text-blue-800'
              }`}>
                {alertType === 'success' && 'Success'}
                {alertType === 'error' && 'Error'}
                {alertType === 'warning' && 'Warning'}
                {alertType === 'info' && 'Information'}
              </div>
              <div className={`text-sm whitespace-pre-line ${
                alertType === 'success' 
                  ? 'text-gray-700'
                  : alertType === 'error'
                  ? 'text-gray-700'
                  : alertType === 'warning'
                  ? 'text-gray-700'
                  : 'text-gray-700'
              }`}>
                {alertMessage}
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowFloatingAlert(false);
                setAlertMessage(null);
              }}
              className={`flex-shrink-0 rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                alertType === 'success' 
                  ? 'text-green-500 hover:bg-green-100 focus:ring-green-600'
                  : alertType === 'error'
                  ? 'text-red-500 hover:bg-red-100 focus:ring-red-600'
                  : alertType === 'warning'
                  ? 'text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-600'
                  : 'text-blue-500 hover:bg-blue-100 focus:ring-blue-600'
              }`}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Job Description Modal */}
      {console.log('Rendering modal with state:', { selectedJob, isJobModalOpen })}
      <JobDescription 
        job={selectedJob}
        isOpen={isJobModalOpen}
        onClose={handleCloseJobModal}
      />
    </>
  );
}
