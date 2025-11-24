import React from 'react';
import type { Page, Language } from '../types';
import { useLanguage } from '../LanguageContext';

interface HeaderProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  pnBalance: number;
  username: string;
  onLogout: () => void;
}

const LeafIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
        <path d="M11.68 1.5c-.32 0-.641.042-.951.125a9.011 9.011 0 0 0-6.195 4.331 9 9 0 0 0-.67 6.471 9.004 9.004 0 0 0 4.255 6.004A9.004 9.004 0 0 0 12 22.5a9.004 9.004 0 0 0 8.875-7.075 9 9 0 0 0-.67-6.471 9.011 9.011 0 0 0-6.195-4.331A8.913 8.913 0 0 0 12 4.5a13.682 13.682 0 0 1-1.218-4.992c.287-.008.576-.008.898-.008ZM19.5 12a7.5 7.5 0 0 1-15 0 7.478 7.478 0 0 1 .69-3.043 7.5 7.5 0 0 1 13.62 0A7.478 7.478 0 0 1 19.5 12Z" />
    </svg>
);

const NavButton: React.FC<{ onClick: () => void; isActive: boolean; children: React.ReactNode }> = ({ onClick, isActive, children }) => {
    const baseClasses = "px-3 py-2 rounded-md text-xs sm:text-sm font-semibold transition-all duration-300 transform";
    const activeClasses = "bg-amazon-accent text-amazon-dark shadow-lg scale-105";
    const inactiveClasses = "bg-amazon-medium hover:bg-amazon-light hover:scale-105 text-amazon-text";
    
    return (
        <button onClick={onClick} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
            {children}
        </button>
    );
};

const LanguageSwitcher: React.FC = () => {
    const { language, setLanguage } = useLanguage();
    const languages: Language[] = ['pt', 'en', 'es'];

    return (
        <div className="flex items-center bg-amazon-dark/50 rounded-full p-1">
            {languages.map(lang => (
                <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-2 py-1 text-xs font-bold rounded-full transition-colors duration-200 ${language === lang ? 'bg-amazon-accent text-amazon-dark' : 'text-amazon-light hover:bg-amazon-medium'}`}
                >
                    {lang.toUpperCase()}
                </button>
            ))}
        </div>
    );
}

const Header: React.FC<HeaderProps> = ({ currentPage, setCurrentPage, pnBalance, username, onLogout }) => {
  const { t } = useLanguage();
  return (
    <header className="bg-amazon-medium/50 backdrop-blur-sm shadow-lg p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <a 
          href="#"
          onClick={(e) => { e.preventDefault(); setCurrentPage('home'); }}
          className="flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-amazon-accent rounded-md group"
        >
          <LeafIcon className="w-10 h-10 text-amazon-accent transition-transform duration-500 ease-out group-hover:rotate-[360deg]" />
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-wider transition-transform duration-300 group-hover:scale-105">
            Eco<span className="text-amazon-accent transition-all duration-300 group-hover:tracking-widest group-hover:text-yellow-300">Amazônia</span> Tech
          </h1>
        </a>
        <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setCurrentPage('profile')}
              className={`hidden sm:flex flex-col items-end p-2 rounded-md transition-colors duration-200 ${currentPage === 'profile' ? 'bg-amazon-accent/20' : 'hover:bg-amazon-light/20'}`}
            >
                <span className='text-xs text-amazon-light'>{t('header_greeting')},</span>
                <span className='font-bold text-white -mt-1'>{username}</span>
            </button>
            <div className="bg-amazon-dark/50 px-3 py-2 rounded-full flex items-center gap-2">
                <LeafIcon className="w-5 h-5 text-amazon-accent" />
                <span className="font-bold text-white text-sm">{pnBalance} PN</span>
            </div>
            <nav className="hidden md:flex space-x-1 sm:space-x-2">
              <NavButton onClick={() => setCurrentPage('quiz')} isActive={currentPage === 'quiz'}>{t('header_nav_quiz')}</NavButton>
              <NavButton onClick={() => setCurrentPage('guardioes')} isActive={currentPage === 'guardioes'}>{t('header_nav_guardians')}</NavButton>
              <NavButton onClick={() => setCurrentPage('infographics')} isActive={currentPage === 'infographics'}>{t('header_nav_infographics')}</NavButton>
              <NavButton onClick={() => setCurrentPage('videos')} isActive={currentPage === 'videos'}>{t('header_nav_videos')}</NavButton>
              <NavButton onClick={() => setCurrentPage('ods')} isActive={currentPage === 'ods'}>{t('header_nav_ods')}</NavButton>
            </nav>
            <LanguageSwitcher />
            <button onClick={onLogout} title={t('header_logout_title')} className='p-2 rounded-full bg-amazon-medium hover:bg-amazon-light transition-colors'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                </svg>
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
