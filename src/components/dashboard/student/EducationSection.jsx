import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2 } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '../../../firebase';
import {
  addEducationArray,
  updateEducationArray,
  deleteEducationArray
} from '../../../services/students';

const EducationSection = () => {
  const { user } = useAuth();
  const [educationEntries, setEducationEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [isAddButtonActive, setIsAddButtonActive] = useState(false);
  const [currentEdu, setCurrentEdu] = useState({
    institute: '',
    city: '',
    state: '',
    branch: '',
    yop: '',
    scoreType: 'CGPA',
    score: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Real-time education data listener
  useEffect(() => {
    if (!user?.uid) return;

    console.log('Setting up education listener for user:', user.uid);
    setLoading(true);
    
    const docRef = doc(db, 'students', user.uid);
    const unsubscribe = onSnapshot(docRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        const education = data.education || [];
        
        console.log('Education data received:', education);
        setEducationEntries(education);
      } else {
        console.log('Student profile not found');
        setEducationEntries([]);
      }
      setLoading(false);
    }, (error) => {
      console.error('Error in education real-time listener:', error);
      setError('Failed to load education data. Please try again.');
      setLoading(false);
    });

    return () => {
      console.log('Cleaning up education listener');
      unsubscribe();
    };
  }, [user?.uid]);

  const handleAddClick = () => {
    if (showForm && !editingId) {
      // Cancel adding
      setShowForm(false);
      setIsAddButtonActive(false);
    } else {
      // Start adding
      setCurrentEdu({
        institute: '',
        city: '',
        state: '',
        branch: '',
        yop: '',
        scoreType: 'CGPA',
        score: ''
      });
      setEditingId(null);
      setShowForm(true);
      setIsAddButtonActive(true);
    }
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    setShowForm(false);
    setEditingId(null);
    setIsAddButtonActive(false);
  };

  const handleEditClick = (education) => {
    setCurrentEdu({
      institute: education.institute || '',
      city: education.city || '',
      state: education.state || '',
      branch: education.branch || '',
      yop: education.yop || '',
      scoreType: education.scoreType || 'CGPA',
      score: education.score || ''
    });
    setEditingId(education.id);
    setShowForm(true);
  };

  const handleDeleteClick = async (education) => {
    console.log('Delete clicked for education:', education);
    
    const instituteName = education.institute || 'this education record';
    if (!window.confirm(`Are you sure you want to delete ${instituteName}?`)) return;
    
    try {
      setLoading(true);
      console.log('Deleting education with ID:', education.id);
      await deleteEducationArray(user.uid, education.id);
      console.log('Delete operation completed for ID:', education.id);
      
      setSuccess('Education record deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
      
      if (editingId === education.id) {
        setShowForm(false);
        setEditingId(null);
      }
    } catch (error) {
      console.error('Error deleting education:', error);
      setError('Failed to delete education record. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setCurrentEdu((prev) => ({ ...prev, [field]: value }));
  };

  const saveEducation = async () => {
    if (!currentEdu.institute.trim()) {
      setError('Institute name is required');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const eduData = {
        institute: currentEdu.institute,
        city: currentEdu.city,
        state: currentEdu.state,
        branch: currentEdu.branch,
        yop: currentEdu.yop,
        scoreType: currentEdu.scoreType,
        score: currentEdu.score
      };
      
      console.log('Saving education data:', eduData);
      
      if (editingId) {
        // Update existing education
        await updateEducationArray(user.uid, editingId, eduData);
        setSuccess('Education updated successfully!');
      } else {
        // Add new education
        await addEducationArray(user.uid, eduData);
        setSuccess('Education added successfully!');
      }
      
      // Reset form
      setShowForm(false);
      setEditingId(null);
      setIsAddButtonActive(false);
      setCurrentEdu({
        institute: '',
        city: '',
        state: '',
        branch: '',
        yop: '',
        scoreType: 'CGPA',
        score: ''
      });
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error saving education:', error);
      if (error.code === 'permission-denied') {
        setError('You do not have permission to save education data. Please contact support.');
      } else {
        setError('Failed to save education. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setShowForm(false);
    setEditingId(null);
    setIsAddButtonActive(false);
  };

  return (
    <div className="w-full">
      <fieldset className="bg-white rounded-lg border-2 border-[#8ec5ff] pt-1 pb-4 px-6 transition-all duration-200 shadow-lg">

        <legend className="text-xl font-bold px-2 bg-gradient-to-r from-[#211868] to-[#b5369d] rounded-full text-transparent bg-clip-text select-none">
          Education
        </legend>

        <div className="flex items-center justify-end mr-[-1%]">
          <div className="flex gap-2">
            <button
              onClick={handleAddClick}
              aria-label="Add new education"
              className={`rounded-full p-2 shadow transition ${
                isAddButtonActive 
                  ? 'bg-[#5e9ad6] hover:bg-[#4a7bb8]' 
                  : 'bg-[#8ec5ff] hover:bg-[#5e9ad6]'
              }`}
              disabled={educationEntries.length >= 4}
            >
              <Plus size={18} className="text-white" />
            </button>
            <button
              onClick={toggleEditMode}
              aria-label={editMode ? 'Exit edit mode' : 'Edit education'}
              className={`bg-[#8ec5ff] rounded-full p-2 shadow hover:bg-[#5e9ad6] transition flex items-center justify-center ${
                editMode ? 'bg-[#5e9ad6]' : ''
              }`}
            >
              <Edit3 size={17} className="text-white" />
            </button>
          </div>
        </div>

        {/* Error and Success Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm">
            {success}
          </div>
        )}

        {/* Education Table Format */}
        {educationEntries.length > 0 && (
          <div className="mb-3">
            <div className="space-y-2">
              {/* Column Headers */}
              <div className="grid grid-cols-4 gap-4 mb-0 p-4">
                <div className="text-black font-bold text-lg">Institute</div>
                <div className="text-black font-bold text-lg">Qualification</div>
                <div className="text-black font-bold text-lg">Year of Passing</div>
                <div className="text-black font-bold text-lg">CGPA/Percentage</div>
              </div>

            {/* Education Rows */}
            {educationEntries.map((education, index) => (
              <div
                key={education.id}
                className={`grid grid-cols-4 gap-4 p-4 rounded-xl relative
                  bg-gradient-to-r 
                  ${index % 2 !== 0 ? 'from-gray-50 to-gray-100' : 'from-[#f0f8fa] to-[#e6f3f8]'}
                  hover:shadow-md transition ${
                    editMode ? 'cursor-pointer' : ''
                  }`}
                onClick={editMode ? () => handleEditClick(education) : undefined}
              >
                {/* Institute with Location */}
                <div className="flex flex-col">
                  <span className="text-base font-semibold text-black mt-2">
                    {education.institute}
                  </span>
                  <span className="text-sm italic text-gray-700">
                    {[education.city, education.state].filter(Boolean).join(', ')}
                  </span>
                </div>

                <div className="pl-6 text-base font-semibold text-black flex items-center -mt-2">
                  {education.branch}
                </div>
                <div className="pl-6 text-md font-semibold text-black flex items-center -mt-2">
                  {education.yop}
                </div>
                <div className="pl-6 text-md font-semibold text-black flex items-center -mt-2">
                  {education.score && education.scoreType ? `${education.score} ${education.scoreType === 'CGPA' ? 'CGPA' : '%'}` : 'N/A'}
                </div>
                
                {/* Edit and Delete buttons - only visible in edit mode */}
                {editMode && (
                  <div className="absolute top-2 right-2 flex gap-1 z-10">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center p-2 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200"
                      title="Edit"
                      aria-label={`Edit education ${index + 1}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditClick(education);
                      }}
                      disabled={loading}
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center p-2 rounded-md bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                      title="Delete"
                      aria-label={`Delete education ${index + 1}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(education);
                      }}
                      disabled={loading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
            </div>
          </div>
        )}

        {showForm && (
          <div className="mb-4 p-4 border border-gray-300 rounded bg-gray-50">
            {/* Row 1: Institute (wider), City, State */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Institute Name</label>
                <input
                  type="text"
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter institute name"
                  value={currentEdu.institute}
                  onChange={(e) => handleInputChange('institute', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="City"
                  value={currentEdu.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="State"
                  value={currentEdu.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                />
              </div>
            </div>

            {/* Row 2: Branch, YOP, ScoreType dropdown, Score */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Branch/Specialization</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., CSE, 12th, 10th"
                  value={currentEdu.branch}
                  onChange={(e) => handleInputChange('branch', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Year of Passing</label>
                <input
                  type="number"
                  inputMode="numeric"
                  min="1900"
                  max="2099"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="YYYY"
                  value={currentEdu.yop}
                  onChange={(e) => handleInputChange('yop', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Score Type</label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={currentEdu.scoreType}
                  onChange={(e) => handleInputChange('scoreType', e.target.value)}
                >
                  <option value="CGPA">CGPA</option>
                  <option value="Percentage">Percentage</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{currentEdu.scoreType}</label>
                <input
                  type="number"
                  step={currentEdu.scoreType === 'CGPA' ? '0.01' : '0.1'}
                  min={currentEdu.scoreType === 'CGPA' ? '0' : '0'}
                  max={currentEdu.scoreType === 'CGPA' ? '10' : '100'}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={currentEdu.scoreType === 'CGPA' ? 'e.g., 8.4' : 'e.g., 80.4'}
                  value={currentEdu.score}
                  onChange={(e) => handleInputChange('score', e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-600">Entry {educationEntries.length + (editingId ? 0 : 1)} of 4</p>
              <div className="flex space-x-2">
                <button
                  onClick={saveEducation}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Education'}
                </button>
                <button
                  onClick={cancelEdit}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {educationEntries.length >= 4 && !showForm && (
          <p className="text-sm text-gray-600">You have added the maximum of 4 education records.</p>
        )}

        {educationEntries.length === 0 && !loading && !showForm && (
          <div className="mb-3 mt-1">
            <div className="space-y-2">
              {/* Column Headers */}
              <div className="grid grid-cols-4 gap-4 mb-0 p-4">
                <div className="text-black font-bold text-lg">Institute</div>
                <div className="text-black font-bold text-lg">Qualification</div>
                <div className="text-black font-bold text-lg">Year of Passing</div>
                <div className="text-black font-bold text-lg">CGPA/Percentage</div>
              </div>
              <div className="text-center py-8 text-gray-500">
                <p>No education records added yet.</p>
                <p className="text-sm">Click the + button to add your education records.</p>
              </div>
            </div>
          </div>
        )}
      </fieldset>
    </div>
  );
};

export default EducationSection;
