import React, { useState, useEffect } from 'react';
import { Moon, Sun, Menu, X, Clock, Calculator, Home, Info, ArrowRight } from 'lucide-react';
import { LoanIQLogo } from './LoanIQLogo';

interface NavbarProps {
  activePage: string;
  onNavigate: (page: string, params?: Record<string, any>) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenAbout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  onNavigate,
  isDarkMode,
  onToggleTheme,
  onOpenAbout,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'apply', label: 'Apply for Loan', icon: Calculator },
    { id: 'history', label: 'Application History', icon: Clock },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 border-b ${
        isScrolled
          ? 'bg-white/95 dark:bg-[#101b35]/95 backdrop-blur-md shadow-sm border-slate-200 dark:border-slate-800'
          : 'bg-white dark:bg-[#101b35] border-slate-100 dark:border-slate-800/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-8">
          {/* Zone 1: Distinctive Brand Logo */}
          <button
            onClick={() => {
              onNavigate('home');
              setMobileMenuOpen(false);
            }}
            className="focus:outline-hidden cursor-pointer"
            aria-label="LoanIQ Home"
          >
            <LoanIQLogo size="md" />
          </button>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = activePage === link.id;
              const Icon = link.icon;
              return (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`flex items-center gap-1.5 text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer py-1 ${
                    isActive
                      ? 'text-[#315CFD] dark:text-[#19B8A5] border-b-2 border-[#315CFD] dark:border-[#19B8A5]'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </button>
              );
            })}

            {onOpenAbout && (
              <button
                onClick={onOpenAbout}
                className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer py-1"
              >
                <Info className="w-4 h-4" />
                About
              </button>
            )}
          </nav>

          {/* Zone 3: Actions - Theme Toggle & Prominent Start Application CTA */}
          <div className="hidden md:flex items-center gap-3.5 shrink-0">
            <button
              onClick={onToggleTheme}
              className="p-2.5 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Toggle visual theme"
              title={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
            </button>

            <button
              onClick={() => onNavigate('apply')}
              className="px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-[#315CFD] to-[#254bd6] hover:from-[#2a52e8] hover:to-[#1f42c2] rounded-xl shadow-sm hover:shadow-md transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 group"
            >
              Start Application
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101B35] px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <button
                key={link.id}
                onClick={() => {
                  onNavigate(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-2.5 w-full text-left px-3.5 py-2.5 text-sm font-bold rounded-xl ${
                  activePage === link.id
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-[#315CFD] dark:text-[#19B8A5]'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </button>
            );
          })}
          {onOpenAbout && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAbout();
              }}
              className="flex items-center gap-2.5 w-full text-left px-3.5 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl"
            >
              <Info className="w-4 h-4" />
              About LoanIQ
            </button>
          )}
          <div className="pt-2">
            <button
              onClick={() => {
                onNavigate('apply');
                setMobileMenuOpen(false);
              }}
              className="w-full text-center px-4 py-3 text-sm font-bold text-white bg-gradient-to-r from-[#315CFD] to-[#254bd6] rounded-xl shadow-sm"
            >
              Start Application
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
