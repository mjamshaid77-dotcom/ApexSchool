import React, { useState } from 'react';
import { ViewMode } from '../types/database';
import { GraduationCap, Users, BookOpen, Database, Menu, X } from 'lucide-react';

interface NavbarProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  isConfigured: boolean;
  onOpenConfig: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  isConfigured,
  onOpenConfig,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home' as ViewMode, label: 'Home', icon: GraduationCap },
    { id: 'students' as ViewMode, label: 'Manage Students', icon: Users },
    { id: 'courses' as ViewMode, label: 'Manage Courses', icon: BookOpen },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs group-hover:bg-blue-700 transition-colors">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg font-bold text-gray-900 tracking-tight block">
                Student & Course Manager
              </span>
              <span className="text-[11px] text-gray-500 font-medium block">
                Simple Academic Record System
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Supabase Status / Setup Button */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onOpenConfig}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                isConfigured
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100 animate-pulse'
              }`}
              title="Click to view or edit Supabase database settings"
            >
              <Database className="w-3.5 h-3.5" />
              <span>{isConfigured ? 'Supabase Connected' : 'Connect Supabase'}</span>
              <span
                className={`w-2 h-2 rounded-full ${
                  isConfigured ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                {item.label}
              </button>
            );
          })}

          <div className="pt-2 border-t border-gray-100 mt-2">
            <button
              onClick={() => {
                onOpenConfig();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium bg-gray-50 rounded-lg text-gray-700"
            >
              <span className="flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-600" />
                Database Connection
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                  isConfigured
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-amber-100 text-amber-700'
                }`}
              >
                {isConfigured ? 'Connected' : 'Configure'}
              </span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
