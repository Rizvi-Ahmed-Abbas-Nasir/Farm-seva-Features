import React from 'react';
import { User, BarChart3, MessageSquare, Settings } from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    {
      id: "profile",
      label: "PROFILE",
      icon: <User size={20} />,
      active: false
    },
    {
      id: "reports",
      label: "FARM REPORTS",
      icon: <BarChart3 size={20} />,
      active: true
    },
    {
      id: "messages",
      label: "MESSAGES",
      icon: <MessageSquare size={20} />,
      active: false
    },
    {
      id: "settings",
      label: "SETTINGS",
      icon: <Settings size={20} />,
      active: false
    }
  ];

  return (
<aside className="fixed left-0 top-0 w-50 h-screen bg-gradient-to-b from-dark-100/95 to-dark-300/95 backdrop-blur border-r border-purple-600/20 p-8 flex flex-col z-50">
      
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gradient">
          Farm Seva
        </h2>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`flex items-center p-4 text-white/70 font-semibold text-sm tracking-wide rounded-xl transition-all duration-300 cursor-pointer hover:bg-white/10 hover:text-white ${
              item.active ? 'bg-white-700/40 text-white border border-white-500/30' : ''
            }`}
          >
            <span className="text-white/80">{item.icon}</span>
            <span className="ml-4">{item.label}</span>
          </div>
        ))}
      </nav>
      
      {/* Footer */}
      <div className="pt-6 border-t border-white/10 mt-4">
        <div className="flex items-center justify-between mb-4 text-sm text-white/70">
          <span>Download Farm Data</span>
          <span className="bg-gradient-green text-white px-3 py-1 rounded-xl text-xs font-semibold">
            CSV
          </span>
        </div>
        <button className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-3 px-6 rounded-xl font-semibold cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-green-600/30">
          Download
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
