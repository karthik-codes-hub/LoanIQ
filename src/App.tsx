import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CustomCursor } from './components/CustomCursor';
import { AboutModal } from './components/AboutModal';
import { HomePage } from './pages/HomePage';
import { ApplyPage } from './pages/ApplyPage';
import { ResultPage } from './pages/ResultPage';
import { HistoryPage } from './pages/HistoryPage';
import { ApplicationDetailPage } from './pages/ApplicationDetailPage';
import { AssessmentResult, LoanType } from './types';

export default function App() {
  const [activePage, setActivePage] = useState<string>('home');
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [currentResult, setCurrentResult] = useState<AssessmentResult | null>(null);
  const [applyParams, setApplyParams] = useState<{
    loanType?: LoanType;
    initialAmount?: number;
    initialTenure?: number;
    initialRate?: number;
  }>({});
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('loaniq-theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Comprehensive theme synchronization to <html>, <body>, and local state
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (isDarkMode) {
      root.classList.add('dark');
      body.classList.add('dark');
      localStorage.setItem('loaniq-theme', 'dark');
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
      localStorage.setItem('loaniq-theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const navigate = (page: string, params?: Record<string, any>) => {
    const targetPage = page === 'dashboard' ? 'history' : page;
    if (params?.id) {
      setSelectedAppId(params.id);
    }
    if (params?.result) {
      setCurrentResult(params.result);
    }
    if (targetPage === 'apply') {
      if (params?.loanType || params?.initialAmount || params?.initialTenure || params?.initialRate) {
        setApplyParams({
          loanType: params.loanType,
          initialAmount: params.initialAmount,
          initialTenure: params.initialTenure,
          initialRate: params.initialRate,
        });
      }
    }
    setActivePage(targetPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAssessmentSuccess = (result: AssessmentResult) => {
    setCurrentResult(result);
    setActivePage('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectApplication = (id: string) => {
    setSelectedAppId(id);
    setActivePage('application-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      className={`${
        isDarkMode ? 'dark' : ''
      } min-h-screen flex flex-col bg-slate-50 dark:bg-[#0c1427] text-slate-900 dark:text-slate-100 transition-colors duration-150`}
    >
      {/* Desktop Custom Cursor */}
      <CustomCursor />

      {/* About & Specs Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        onStartAssessment={() => {
          setIsAboutOpen(false);
          navigate('apply');
        }}
      />

      <Navbar
        activePage={activePage}
        onNavigate={(page, params) => navigate(page, params)}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        onOpenAbout={() => setIsAboutOpen(true)}
      />

      <main className="flex-1">
        {activePage === 'home' && (
          <HomePage
            onNavigate={navigate}
            onOpenAbout={() => setIsAboutOpen(true)}
          />
        )}

        {activePage === 'apply' && (
          <ApplyPage
            key={JSON.stringify(applyParams)}
            initialParams={applyParams}
            onSuccess={handleAssessmentSuccess}
            onNavigate={navigate}
          />
        )}

        {activePage === 'result' && currentResult && (
          <ResultPage result={currentResult} onNavigate={navigate} />
        )}

        {(activePage === 'history' || activePage === 'applications') && (
          <HistoryPage
            onSelectApplication={handleSelectApplication}
            onNavigate={navigate}
          />
        )}

        {activePage === 'application-detail' && selectedAppId && (
          <ApplicationDetailPage
            applicationId={selectedAppId}
            onBack={() => navigate('history')}
            onNavigate={navigate}
          />
        )}
      </main>

      <Footer
        onNavigate={(page) => navigate(page)}
        onOpenAbout={() => setIsAboutOpen(true)}
      />
    </div>
  );
}
