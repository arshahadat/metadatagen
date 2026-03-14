import React from 'react';

const ImageIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06l2.755-2.754a.75.75 0 011.06 0l3.078 3.077a.75.75 0 001.06 0l2.424-2.423a.75.75 0 011.06 0l4.03 4.029V6.75a.75.75 0 00-.75-.75H3.75a.75.75 0 00-.75.75v9.31zM4.5 9.75a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" clipRule="evenodd" />
    </svg>
);


export const Header: React.FC = () => {
  return (
    <header className="bg-gray-900/50 backdrop-blur-sm border-b border-purple-500/30 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-center">
          <ImageIcon className="w-8 h-8 text-purple-400 mr-3" />
          <h1 className="text-2xl md:text-3xl font-bold font-orbitron tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
            AI Image Metadata Generator
          </h1>
        </div>
      </div>
    </header>
  );
};