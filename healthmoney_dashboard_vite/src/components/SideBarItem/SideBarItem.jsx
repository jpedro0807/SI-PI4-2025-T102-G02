import React from 'react';
import { Link } from 'react-router-dom'; 

export default function SidebarItem({ icon, text, active = false, to }) {
  return (
    
    <Link to={to} className="outline-none" style={{ textDecoration: 'none' }}>
      <li 
        className={`
          flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors mb-1
          ${active 
            ? 'bg-emerald-50 text-emerald-600 font-medium' 
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
        `}
      >
        {icon}
        <span className="text-sm">{text}</span>
      </li>
    </Link>
  );
}