
import React from 'react';

const ManagerAvatar: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 200 200" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Background Glow */}
    <circle cx="100" cy="100" r="90" fill="rgba(168, 85, 247, 0.1)" />
    
    {/* Body - Black Shirt */}
    <path d="M60 160 Q100 140 140 160 L140 200 L60 200 Z" fill="#1e1b4b" />
    <rect x="65" y="165" width="70" height="35" rx="5" fill="#0f172a" />
    
    {/* Head - Chibi Round */}
    <circle cx="100" cy="90" r="55" fill="#fecaca" />
    
    {/* Hair - Black Stylish */}
    <path d="M45 90 Q45 40 100 35 Q155 40 155 90 Q155 70 140 60 Q100 50 60 60 Q45 70 45 90" fill="#0f172a" />
    
    {/* Thin Beard (Berjegot Tipis) */}
    <path d="M65 115 Q100 145 135 115 Q135 125 100 135 Q65 125 65 115" fill="#334155" opacity="0.6" />
    
    {/* Eyes - Expressive */}
    <circle cx="80" cy="95" r="6" fill="#0f172a" />
    <circle cx="120" cy="95" r="6" fill="#0f172a" />
    <circle cx="82" cy="93" r="2" fill="white" />
    <circle cx="122" cy="93" r="2" fill="white" />
    
    {/* Mouth - Slight Smile */}
    <path d="M90 115 Q100 120 110 115" stroke="#0f172a" strokeWidth="2" fill="none" strokeLinecap="round" />
    
    {/* Hands holding the 'M' */}
    <circle cx="70" cy="140" r="12" fill="#fecaca" />
    <circle cx="130" cy="140" r="12" fill="#fecaca" />
    
    {/* The Letter 'M' (Held by the chibi) */}
    <rect x="75" y="120" width="50" height="40" rx="8" fill="#a855f7" />
    <path d="M85 150 V130 L100 142 L115 130 V150" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default ManagerAvatar;
