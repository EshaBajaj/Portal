import { useState, useEffect } from 'react';
import logo from '../assets/brand_logo.webp'; 

const Preloader = () => {
  const [showPreloader, setShowPreloader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPreloader(false);
    }, 2500); // Show for 2.5 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    showPreloader && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white transition-opacity duration-1000 ease-in-out animate-fadeUp">
        <img
          src= {logo}
          alt="Brand Logo"
          className="w-48 opacity-100 animate-fadeUp"
        />
      </div>
    )
  );
};

export default Preloader;
