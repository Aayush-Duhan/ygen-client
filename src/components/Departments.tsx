import React, { useState } from 'react';

const MicroGroups: React.FC = () => {
  const [hoveredGroup, setHoveredGroup] = useState<number | null>(null);

  const microGroups = [
    {
      id: 1,
      name: 'Web',
      description: 'Mastering web technologies and building modern, responsive applications using React, Node.js, and other cutting-edge frameworks.',
      icon: (
        <svg className="w-12 h-12 mb-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
    },
    {
      id: 2,
      name: 'Algo',
      description: 'Exploring algorithms, data structures, and problem-solving techniques to build efficient and scalable solutions.',
      icon: (
        <svg className="w-12 h-12 mb-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: 3,
      name: 'Game Dev',
      description: 'Creating immersive gaming experiences using Unity, Unreal Engine, and other game development technologies.',
      icon: (
        <svg className="w-12 h-12 mb-4 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
      ),
    },
    {
      id: 4,
      name: 'Mobile Dev',
      description: 'Developing cross-platform mobile applications using Flutter, React Native, and native Android/iOS development.',
      icon: (
        <svg className="w-12 h-12 mb-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: 5,
      name: 'Tech Talk',
      description: 'Engaging discussions and presentations on emerging technologies, industry trends, and technical innovations.',
      icon: (
        <svg className="w-12 h-12 mb-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="micro-groups" className="bg-gray-900 text-white py-20 px-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent opacity-70"></div>
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-900/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-900/20 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto relative z-10">
        <h2 className="text-4xl font-bold mb-2 text-center">Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-600">Micro Groups</span></h2>
        <p className="text-xl text-gray-400 mb-16 text-center max-w-3xl mx-auto">Explore the different areas where you can learn, grow, and contribute</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {microGroups.map((group) => (
            <div 
              key={group.id} 
              className="bg-black p-8 rounded-xl border border-gray-800 hover:border-red-500 transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden group"
              onMouseEnter={() => setHoveredGroup(group.id)}
              onMouseLeave={() => setHoveredGroup(null)}
            >
              {/* Animated background gradient on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br from-red-900/20 via-red-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}></div>
              
              <div className="flex flex-col items-center text-center relative z-10">
                <div className="transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                  {group.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3 group-hover:text-red-400 transition-colors duration-300">{group.name}</h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">{group.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MicroGroups;