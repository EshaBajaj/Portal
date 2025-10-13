import React, { useState, useEffect } from 'react';
import { ExternalLink, Edit2, Plus, Github, Trash2 } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '../../../firebase';
import {
  addProjectArray,
  deleteProjectArray,
  updateProjectArray
} from '../../../services/students';

const ProjectsSection = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [isAddButtonActive, setIsAddButtonActive] = useState(false);
  const [editedProject, setEditedProject] = useState({
    title: '',
    description: '',
    liveUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Real-time projects data listener
  useEffect(() => {
    if (!user?.uid) return;

    setLoading(true);
    const docRef = doc(db, 'students', user.uid);
    
    const unsubscribe = onSnapshot(docRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        const projectsArray = data.projects || [];
        
        console.log('Projects data received:', projectsArray);
        setProjects(projectsArray);
      } else {
        console.log('Student profile not found');
        setProjects([]);
      }
      setLoading(false);
    }, (error) => {
      console.error('Error in projects real-time listener:', error);
      setError('Failed to load projects. Please try again.');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  // Normalize URL helper
  const normalizeUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url}`;
  };

  const startEditing = (index) => {
    setEditingIndex(index);
    const project = projects[index];
    setEditedProject({
      title: project.title,
      description: project.description,
      liveUrl: project.liveUrl || ''
    });
  };

  const handleChange = (field, value) => {
    setEditedProject((prev) => ({ ...prev, [field]: value }));
  };

  const saveProject = async () => {
    if (!editedProject.title.trim() || !editedProject.description.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const projectData = {
        title: editedProject.title,
        description: editedProject.description,
        liveUrl: editedProject.liveUrl ? normalizeUrl(editedProject.liveUrl) : ''
      };

      if (editingIndex !== null && editingIndex < projects.length) {
        // Update existing project
        const existingProject = projects[editingIndex];
        await updateProjectArray(user.uid, existingProject.id, projectData);
        setSuccess('Project updated successfully!');
      } else {
        // Add new project
        await addProjectArray(user.uid, projectData);
        setSuccess('Project added successfully!');
      }

      setEditingIndex(null);
      setIsAddButtonActive(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error saving project:', error);
      if (error.code === 'permission-denied') {
        setError('You do not have permission to save projects. Please contact support.');
      } else {
        setError('Failed to save project. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (index) => {
    const project = projects[index];
    if (!window.confirm(`Are you sure you want to delete "${project.title}"?`)) return;

    try {
      setLoading(true);
      await deleteProjectArray(user.uid, project.id);
      setSuccess('Project deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);

      if (editingIndex === index) {
        setEditingIndex(null);
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      setError('Failed to delete project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addNewProject = () => {
    const isCurrentlyAdding = editingIndex === projects.length;
    if (isCurrentlyAdding) {
      // Cancel adding
      setEditingIndex(null);
      setIsAddButtonActive(false);
    } else {
      // Start adding
      setEditingIndex(projects.length);
      setEditedProject({ title: '', description: '', liveUrl: '' });
      setIsAddButtonActive(true);
    }
  };

  const cancelEditing = () => {
    setEditingIndex(null);
    setIsAddButtonActive(false);
    setError('');
  };

  return (
    <div className="w-full relative">
      <fieldset className="bg-white rounded-lg border-2 border-[#8ec5ff] pt-1 pb-4 px-6 transition-all duration-200 shadow-lg">
        <legend className="text-xl font-bold bg-gradient-to-r from-[#211868] to-[#b5369d] rounded-full text-transparent bg-clip-text px-2">
          Projects
        </legend>

        <div className="flex justify-end mb-3 mr-[-1%]">
          <button
            onClick={addNewProject}
            aria-label="Add new project"
            className={`rounded-full p-2 shadow transition disabled:opacity-50 ${
              isAddButtonActive 
                ? 'bg-[#5e9ad6] hover:bg-[#4a7bb8]' 
                : 'bg-[#8ec5ff] hover:bg-[#5e9ad6]'
            }`}
            disabled={loading}
          >
            <Plus size={18} className="text-white" />
          </button>
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

        <div className="my-2">
          <div className="space-y-2 pr-2 custom-scrollbar" style={{ maxHeight: '350px', overflowY: 'auto' }}>
            <style>{`
              .custom-scrollbar::-webkit-scrollbar {
                width: 8px;
                height: 8px;
              }
              .custom-scrollbar::-webkit-scrollbar-track {
                background: #f3f4f6;
                border-radius: 4px;
                margin: 4px 0;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb {
                background: #3c80a7;
                border-radius: 4px;
                transition: background 0.3s ease;
                border: 2px solid transparent;
                background-clip: content-box;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: #2f6786;
              }
              .custom-scrollbar {
                scrollbar-width: thin;
                scrollbar-color: #3c80a7 #f3f4f6;
                padding-right: 4px;
              }
            `}</style>
            {/* Add new project form when editingIndex equals projects.length */}
            {editingIndex === projects.length && (
              <div className="rounded-lg px-4 py-3 bg-gradient-to-r from-[#f0f8fa] to-[#e6f3f8]">
                <input
                  type="text"
                  value={editedProject.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Project Title *"
                  className="w-full mb-2 px-2 py-1 border border-gray-300 rounded"
                />
                <textarea
                  value={editedProject.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Project Description *"
                  rows={3}
                  className="w-full mb-2 px-2 py-1 border border-gray-300 rounded resize-none"
                />
                <input
                  type="url"
                  value={editedProject.liveUrl}
                  onChange={(e) => handleChange('liveUrl', e.target.value)}
                  placeholder="Project URL"
                  className="w-full mb-2 px-2 py-1 border border-gray-300 rounded"
                />
                <div className="flex space-x-2 justify-end">
                  <button
                    onClick={saveProject}
                    className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 text-gray-800"
                  >
                    Cancel
                  </button>
                 </div>
              </div>
            )}

            {projects.map((project, index) => (
              editingIndex === index ? (
                <div
                  key={index}
                  className="rounded-lg px-4 py-3 bg-gradient-to-r from-[#f0f8fa] to-[#e6f3f8]"
                >
                  <input
                    type="text"
                    value={editedProject.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="Project Title *"
                    className="w-full mb-2 px-2 py-1 border border-gray-300 rounded"
                  />
                  <textarea
                    value={editedProject.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Project Description *"
                    rows={3}
                    className="w-full mb-2 px-2 py-1 border border-gray-300 rounded resize-none"
                  />
                  <input
                    type="url"
                    value={editedProject.liveUrl}
                    onChange={(e) => handleChange('liveUrl', e.target.value)}
                    placeholder="Project URL"
                    className="w-full mb-2 px-2 py-1 border border-gray-300 rounded"
                  />
                  <div className="flex space-x-2 justify-end">
                    <button
                      onClick={saveProject}
                      className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDeleteProject(index)}
                      className="px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white disabled:opacity-50"
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  key={index}
                  className={`rounded-lg px-4 py-3 transition-all duration-200 hover:shadow-md bg-gradient-to-r ${
                    index % 2 !== 0 ? 'from-gray-50 to-gray-100' : 'from-[#f0f8fa] to-[#e6f3f8]'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-xl font-bold text-black">{project.title}</h4>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditing(index)}
                        aria-label={`Edit project ${project.title}`}
                        className="text-gray-600 hover:text-blue-600 transition disabled:opacity-50"
                        disabled={loading}
                      >
                        <Edit2 size={15} />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-md text-gray-700 pl-3">
                    <span className="font-semibold text-black text-lg">Description: </span>
                    {project.description}
                  </p>
                  
                  {project.liveUrl && (
                    <div className="mt-1 text-md text-gray-700 flex items-center pl-3">
                      <span className="font-semibold mr-1 text-sm text-black">Project URL:</span>
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 inline-flex items-center break-all"
                      >
                        <ExternalLink size={16} className="mr-1" />
                        View Project
                      </a>
                    </div>
                  )}
                </div>
              )
            ))}
          </div>
        </div>
      </fieldset>
    </div>
  );
};

export default ProjectsSection;