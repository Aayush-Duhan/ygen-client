import React, { useEffect, useState } from 'react';

const Hero: React.FC = () => {
  const [typedText, setTypedText] = useState('');
  const fullText = "The next generation of innovators, creators, and leaders at our college";
  
  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setTypedText(fullText.substring(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50);
    
    return () => clearInterval(typingInterval);
  }, []);
  
  return (
    <section id="hero" className="bg-black text-white py-24 px-4 relative overflow-hidden min-h-[90vh] flex items-center">
      {/* Background gradient effect with enhanced opacity */}
      <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 to-transparent opacity-40"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-red-900/10 via-transparent to-red-900/10 opacity-30"></div>
      
      {/* Animated dots/particles with more elements and varied animations */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-2 h-2 rounded-full bg-red-400 animate-pulse"></div>
        <div className="absolute top-40 right-40 w-3 h-3 rounded-full bg-red-400 animate-pulse delay-300"></div>
        <div className="absolute bottom-20 left-1/3 w-2 h-2 rounded-full bg-red-300 animate-pulse delay-700"></div>
        <div className="absolute top-1/3 right-1/4 w-2 h-2 rounded-full bg-red-300 animate-pulse delay-500"></div>
        <div className="absolute top-1/2 left-1/4 w-1 h-1 rounded-full bg-red-500 animate-pulse delay-200"></div>
        <div className="absolute bottom-1/3 right-1/3 w-2 h-2 rounded-full bg-red-500 animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-3 h-3 rounded-full bg-red-400 animate-pulse delay-600"></div>
        <div className="absolute bottom-1/4 right-1/2 w-1 h-1 rounded-full bg-red-400 animate-pulse delay-400"></div>
      </div>
      
      <div className="container mx-auto flex flex-col items-center relative z-10">
        <h1 className="text-5xl md:text-7xl font-bold mb-8 text-center animate-float">
          Welcome to <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-red-400 to-red-600 hover:bg-gradient-to-r hover:from-red-600 hover:via-red-400 hover:to-red-500 transition-all duration-1000">Code</span><span>-Y-</span><span className='bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-red-400 to-red-600 hover:bg-gradient-to-r hover:from-red-600 hover:via-red-400 hover:to-red-500 transition-all duration-1000'>Gen</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-12 text-center max-w-3xl leading-relaxed h-[60px] md:h-auto">
          {typedText}<span className="animate-blink">|</span>
        </p>
        <div className="flex flex-col md:flex-row gap-6">
          <a 
            href="#micro-groups" 
            className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 rounded-full text-white font-medium hover:shadow-lg hover:shadow-red-500/30 hover:scale-105 transition-all duration-300 text-center transform relative overflow-hidden group"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-red-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></span>
            <span className="relative z-10">Explore Micro-Groups</span>
          </a>
          <a 
            href="#event" 
            className="px-8 py-4 bg-transparent border-2 border-red-500 rounded-full text-white font-medium hover:bg-red-900/30 hover:shadow-lg hover:shadow-red-500/20 hover:scale-105 transition-all duration-300 text-center transform relative overflow-hidden group"
          >
            <span className="absolute inset-0 w-0 bg-gradient-to-r from-red-600/20 to-red-700/20 group-hover:w-full transition-all duration-500"></span>
            <span className="relative z-10">Upcoming Events</span>
          </a>
        </div>
        
      </div>
        {/* Scroll down indicator */}
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:block">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
    </section>
  );
};

export default Hero;