import React, { useState } from 'react';
import brandLogo from '../assets/brand_logo.webp';
import placementPolicy from '../assets/Docs/PlacementPolicy.pdf';

const PWIOIFooter = ({ onLoginOpen, onContactTeam }) => {
    const linkedinLink = "https://www.linkedin.com/school/pw-ioi/";
    const instagramLink = "https://www.instagram.com/pw_ioi/";
    const youtubeLink = "https://www.youtube.com/@PW-IOI";

    const [formData, setFormData] = useState({
        company: '',
        email: '',
        phone: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        setTimeout(() => {
            console.log('Form submitted:', formData);
            setFormData({
                company: '',
                email: '',
                phone: ''
            });
            setIsSubmitting(false);
            alert('Thank you for your message! We will get back to you soon.');
        }, 1000);
    };

    return (
        <footer className="text-white py-5 relative overflow-hidden mt-10" style={{ background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3a 50%, #2a2a5a 100%)' }}>
            <div className="px-[10%] grid grid-cols-1 lg:grid-cols-3 gap-10">
               
                {/* Brand Section */}
                <div className="flex flex-col mt-6 items-start">
                    <img
                        src={brandLogo}
                        alt="PW IOI Logo"
                        className="w-44 mb-5 filter brightness-0 invert"
                    />
                    <p className="text-gray-300">Empowering students with career opportunities and industry connections since 2010.</p>
                </div>

                {/* Quick Links Section */}
                <div className="flex flex-col mt-4">
                    <h3 className="text-2xl text-gray-200 font-semibold mb-5 relative inline-block after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-12 after:h-0.5 after:bg-gray-400 after:transition-all after:duration-300 hover:after:w-full">
                        Quick Links
                    </h3>
                    <button
                        onClick={() => onLoginOpen && onLoginOpen('Recruiter')}
                        className="text-gray-400 no-underline mb-3 relative inline-block transition-all duration-300 pl-0 hover:text-white hover:pl-5 before:content-['→'] before:absolute before:left-[-20px] before:opacity-0 before:transition-all before:duration-300 hover:before:opacity-100 hover:before:left-0 text-left cursor-pointer"
                    >
                        Recruiter Login
                    </button>
                    <button
                        onClick={() => onLoginOpen && onLoginOpen('Student')}
                        className="text-gray-400 no-underline mb-3 relative inline-block transition-all duration-300 pl-0 hover:text-white hover:pl-5 before:content-['→'] before:absolute before:left-[-20px] before:opacity-0 before:transition-all before:duration-300 hover:before:opacity-100 hover:before:left-0 text-left cursor-pointer"
                    >
                        Student Login
                    </button>
                    <a href={placementPolicy} target="_blank" rel="noopener noreferrer" className="text-gray-400 no-underline mb-3 relative inline-block transition-all duration-300 pl-0 hover:text-white hover:pl-5 before:content-['→'] before:absolute before:left-[-20px] before:opacity-0 before:transition-all before:duration-300 hover:before:opacity-100 hover:before:left-0">
                        Placement Policy
                    </a>
                    <button
                        onClick={() => onContactTeam && onContactTeam()}
                        className="text-gray-400 no-underline mb-3 relative inline-block transition-all duration-300 pl-0 hover:text-white hover:pl-5 before:content-['→'] before:absolute before:left-[-20px] before:opacity-0 before:transition-all before:duration-300 hover:before:opacity-100 hover:before:left-0 text-left cursor-pointer"
                    >
                        Contact Team
                    </button>
                </div>

                {/* Contact Info Section */}
                <div className="flex flex-col mt-4">
                    <h3 className="text-2xl text-gray-200 font-semibold mb-5 relative inline-block after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-12 after:h-0.5 after:bg-gray-400 after:transition-all after:duration-300 hover:after:w-full">
                        Contact Info
                    </h3>
                    <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 text-gray-400 group hover:text-white cursor-pointer">
                            <svg className="w-5 h-5 group-hover:text-gray-200" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                            </svg>
                            <span>placement@pwioi.edu.in</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-400 group hover:text-white cursor-pointer">
                            <svg className="w-5 h-5 group-hover:text-green-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                            </svg>
                            <span>+91 80 1234 5678</span>
                        </div>
                        <a
                            href="https://maps.google.com?q=PW+IOI+Bangalore+Campus"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex group items-center gap-3 text-gray-300 transition-all duration-300 hover:text-white"
                        >
                            <svg className="w-6 h-6 text-gray-300 group-hover:text-red-500 duration-200" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                            </svg>
                            <span className='leading-5'>
                                PW IOI Main Campus<br />
                                Bangalore, Karnataka
                            </span>
                        </a>
                    </div>

                    {/* Social Media Icons */}
                    <div className="flex gap-12 ml-1">
                        <a 
                            href={linkedinLink} 
                            target='_blank' 
                            rel="noopener noreferrer" 
                            className="text-[#0A66C2] transition-colors duration-300 hover:text-[#004182]"
                        >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                        </a>
                        <a 
                            href={instagramLink} 
                            target='_blank' 
                            rel="noopener noreferrer" 
                            className="text-[#E1306C] transition-colors duration-300 hover:text-[#b91d5a]"
                        >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                        </a>
                        <a 
                            href={youtubeLink} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-[#FF0000] transition-colors duration-300 hover:text-[#b80000]"
                        >
                            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>

         
            <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@600&display=swap" rel="stylesheet" />
            <div className="mt-10 pt-5 border-t border-white/30 text-gray-400 text-sm flex flex-col items-center gap-2">
                <span className="text-center" style={{ fontFamily: 'Caveat, cursive', fontSize: '1rem', fontWeight: 600, letterSpacing: '.02em', justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
                    Built with <span style={{ color: 'red', fontSize: '1.1em', margin: '0 2px' }}>❤️</span> by our 2nd-sem Students — proof of their talent!
                </span>
                <div className="w-full flex items-center justify-center gap-2">
                    <span className="hidden sm:block h-px w-12 bg-gray-400" />
                    <span className="text-center">© {new Date().getFullYear()} PW IOI - Placement Cell. All Rights Reserved.</span>
                    <span className="hidden sm:block h-px w-12 bg-gray-400" />
                </div>
            </div>
        </footer>
    );
};

export default PWIOIFooter;
