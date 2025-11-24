import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Home from './components/Home';
import Quiz from './components/Quiz';
import Infographics from './components/Infographics';
import Videos from './components/Videos';
import ODS from './components/ODS';
import Guardioes, { guardiansData } from './components/Guardioes';
import Auth from './components/Auth';
import Profile from './components/Profile';
import type { Page, User } from './types';

const App: React.FC = () => {
  const [users, setUsers] = useState<{ [username: string]: User }>(() => {
    const savedUsers = localStorage.getItem('ecoAmazoniaUsers');
    return savedUsers ? JSON.parse(savedUsers) : {};
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const loggedInUser = localStorage.getItem('loggedInUser');
    const savedUsers = localStorage.getItem('ecoAmazoniaUsers');
    if (loggedInUser && savedUsers) {
      const user = JSON.parse(savedUsers)[loggedInUser];
      // Ensure backward compatibility
      user.guardianProgress = user.guardianProgress || {};
      user.name = user.name || '';
      user.photo = user.photo || '';
      user.phone = user.phone || '';
      user.email = user.email || '';
      user.birthdate = user.birthdate || '';
      return user;
    }
    return null;
  });

  const [authError, setAuthError] = useState<string>('');

  useEffect(() => {
    localStorage.setItem('ecoAmazoniaUsers', JSON.stringify(users));
  }, [users]);

  const updateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    setUsers(prev => ({ ...prev, [updatedUser.username]: updatedUser }));
  };

  const handleLogin = (username: string, password: string): boolean => {
    const user = users[username];
    if (user && user.password === password) {
      // Ensure backward compatibility
      user.guardianProgress = user.guardianProgress || {};
      user.name = user.name || '';
      user.photo = user.photo || '';
      user.phone = user.phone || '';
      user.email = user.email || '';
      user.birthdate = user.birthdate || '';
      setCurrentUser(user);
      localStorage.setItem('loggedInUser', username);
      setAuthError('');
      return true;
    }
    setAuthError('Usuário ou senha inválidos.');
    return false;
  };

  const handleSignup = (username: string, password: string): boolean => {
    if (users[username]) {
      setAuthError('Este nome de usuário já existe.');
      return false;
    }
    if (password.length < 4 || password.length > 8) {
        setAuthError('A senha deve ter entre 4 e 8 caracteres.');
        return false;
    }
    const newUser: User = {
      username,
      password,
      pnBalance: 0,
      unlockedGuardians: [],
      completedOdsQuizzes: [],
      viewedInfographics: [],
      watchedVideos: [],
      guardianProgress: {},
      name: '',
      photo: '',
      phone: '',
      email: '',
      birthdate: '',
    };
    setUsers(prev => ({ ...prev, [username]: newUser }));
    setCurrentUser(newUser);
    localStorage.setItem('loggedInUser', username);
    setAuthError('');
    return true;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('loggedInUser');
  };

  const [currentPage, setCurrentPage] = useState<Page>('home');

  const addPn = (amount: number) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, pnBalance: currentUser.pnBalance + amount };
    updateUser(updatedUser);
  };

  const unlockGuardian = (guardianId: number) => {
    if (!currentUser) return;
    const guardian = guardiansData.find(g => g.id === guardianId);
    if (guardian && currentUser.pnBalance >= guardian.cost && !currentUser.unlockedGuardians.includes(guardianId)) {
      const updatedUser = {
        ...currentUser,
        pnBalance: currentUser.pnBalance - guardian.cost,
        unlockedGuardians: [...currentUser.unlockedGuardians, guardianId],
      };
      updateUser(updatedUser);
    }
  };
  
  const completeOdsQuiz = (odsId: number, points: number) => {
      if (!currentUser || currentUser.completedOdsQuizzes.includes(odsId)) return;
      const updatedUser = {
        ...currentUser,
        pnBalance: currentUser.pnBalance + points,
        completedOdsQuizzes: [...currentUser.completedOdsQuizzes, odsId],
      };
      updateUser(updatedUser);
  };
  
  const markInfographicAsViewed = (infographicId: number) => {
      if (!currentUser || currentUser.viewedInfographics.includes(infographicId)) return;
      const updatedUser = {
          ...currentUser,
          pnBalance: currentUser.pnBalance + 20, // Award 20 PN for viewing
          viewedInfographics: [...currentUser.viewedInfographics, infographicId],
      };
      updateUser(updatedUser);
  };

  const markVideoAsWatched = (videoId: string) => {
      if (!currentUser || currentUser.watchedVideos.includes(videoId)) return;
      const updatedUser = {
          ...currentUser,
          pnBalance: currentUser.pnBalance + 50, // Award 50 PN for watching
          watchedVideos: [...currentUser.watchedVideos, videoId],
      };
      updateUser(updatedUser);
  };
  
  const advanceGuardianStage = (guardianId: number, stage: number, points: number) => {
      if (!currentUser) return;
      const currentProgress = currentUser.guardianProgress[guardianId] || 0;
      if (stage <= currentProgress) return; // Don't award points for already completed stages

      const updatedUser = {
        ...currentUser,
        pnBalance: currentUser.pnBalance + points,
        guardianProgress: {
          ...currentUser.guardianProgress,
          [guardianId]: stage,
        },
      };
      updateUser(updatedUser);
  };

  const renderPage = () => {
    if (!currentUser) return null;
    switch (currentPage) {
      case 'quiz': return <Quiz addPn={addPn} />;
      case 'infographics': return <Infographics markInfographicAsViewed={markInfographicAsViewed} viewedInfographics={currentUser.viewedInfographics} />;
      case 'videos': return <Videos markVideoAsWatched={markVideoAsWatched} watchedVideos={currentUser.watchedVideos} />;
      case 'ods': return <ODS completedOdsQuizzes={currentUser.completedOdsQuizzes} completeOdsQuiz={completeOdsQuiz} />;
      case 'guardioes': return <Guardioes 
                                  pnBalance={currentUser.pnBalance} 
                                  unlockedGuardians={currentUser.unlockedGuardians} 
                                  unlockGuardian={unlockGuardian}
                                  guardianProgress={currentUser.guardianProgress}
                                  advanceGuardianStage={advanceGuardianStage} 
                                />;
      case 'profile': return <Profile user={currentUser} onUpdateUser={updateUser} />;
      case 'home': default: return <Home addPn={addPn} />;
    }
  };

  if (!currentUser) {
    return <Auth onLogin={handleLogin} onSignup={handleSignup} error={authError} />;
  }

  return (
    <div className="bg-amazon-dark min-h-screen text-amazon-text font-sans">
      <div className="absolute inset-0 bg-amazon-forest bg-cover bg-center opacity-10"></div>
      <div className="relative z-10">
        <Header 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage} 
          pnBalance={currentUser.pnBalance}
          username={currentUser.username}
          onLogout={handleLogout}
        />
        <main className="container mx-auto px-4 py-8">
          {renderPage()}
        </main>
        <footer className="text-center py-4 text-sm text-amazon-light">
            <div className="flex justify-center items-center gap-4">
                <p>EcoAmazônia Tech © 2025 - Tecnologia a serviço da conscientização ambiental.</p>
                <a href="https://www.instagram.com/ecoamazoniatech?igsh=MTVjanYwaTJocXRodw==" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-amazon-accent transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664 4.771 4.919-4.919 1.266-.058 1.644-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.059-1.281.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.441 1.441 1.441 1.441-.645 1.441-1.441-.645-1.44-1.441-1.44z"/>
                    </svg>
                </a>
            </div>
        </footer>
      </div>
    </div>
  );
};

export default App;