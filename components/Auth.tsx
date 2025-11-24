import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';

interface AuthProps {
  onLogin: (username: string, password: string) => boolean;
  onSignup: (username: string, password: string) => boolean;
  error: string;
}

const LeafIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
        <path d="M11.68 1.5c-.32 0-.641.042-.951.125a9.011 9.011 0 0 0-6.195 4.331 9 9 0 0 0-.67 6.471 9.004 9.004 0 0 0 4.255 6.004A9.004 9.004 0 0 0 12 22.5a9.004 9.004 0 0 0 8.875-7.075 9 9 0 0 0-.67-6.471 9.011 9.011 0 0 0-6.195-4.331A8.913 8.913 0 0 0 12 4.5a13.682 13.682 0 0 1-1.218-4.992c.287-.008.576-.008.898-.008ZM19.5 12a7.5 7.5 0 0 1-15 0 7.478 7.478 0 0 1 .69-3.043 7.5 7.5 0 0 1 13.62 0A7.478 7.478 0 0 1 19.5 12Z" />
    </svg>
);

const Auth: React.FC<AuthProps> = ({ onLogin, onSignup, error }) => {
  const { t } = useLanguage();
  const [isLoginView, setIsLoginView] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const getErrorMessage = (err: string) => {
      if (err.includes('inválidos') || err.includes('invalid')) {
          return t('auth_error_invalid');
      }
      if (err.includes('existe') || err.includes('exists')) {
          return t('auth_error_exists');
      }
      if (err.includes('senha') && (err.includes('caracteres') || err.includes('characters'))) {
          return t('auth_error_password_length');
      }
      return err;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoginView) {
      onLogin(username, password);
    } else {
      onSignup(username, password);
    }
  };

  return (
    <div className="bg-amazon-dark min-h-screen text-amazon-text font-sans flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-amazon-forest bg-cover bg-center opacity-10"></div>
        <div className="relative z-10 w-full max-w-md">
            <div className="bg-amazon-medium/50 backdrop-blur-sm rounded-xl shadow-2xl p-8">
                <div className="flex flex-col items-center mb-6">
                    <LeafIcon className="w-16 h-16 text-amazon-accent" />
                    <h1 className="text-3xl font-bold text-white tracking-wider mt-2">
                        Eco<span className="text-amazon-accent">Amazônia</span> Tech
                    </h1>
                    <p className="text-amazon-light mt-1">{t('auth_title')}</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-amazon-text/80 mb-1">
                            {t('auth_username_label')}
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full px-4 py-2 bg-amazon-dark/60 rounded-md border border-amazon-light/20 focus:ring-2 focus:ring-amazon-accent focus:border-amazon-accent outline-none transition"
                            placeholder={t('auth_username_placeholder')}
                        />
                    </div>
                    <div>
                        <label htmlFor="password"  className="block text-sm font-medium text-amazon-text/80 mb-1">
                            {t('auth_password_label')}
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 bg-amazon-dark/60 rounded-md border border-amazon-light/20 focus:ring-2 focus:ring-amazon-accent focus:border-amazon-accent outline-none transition"
                            placeholder="••••••••"
                        />
                        {!isLoginView && (
                            <p className="text-xs text-amazon-light mt-1 px-1">
                                {t('auth_password_rule')}
                            </p>
                        )}
                    </div>
                    
                    {error && <p className="text-red-400 text-sm text-center">{getErrorMessage(error)}</p>}

                    <button
                        type="submit"
                        className="w-full py-3 bg-amazon-accent text-amazon-dark font-bold rounded-lg text-lg hover:bg-white transition-all transform hover:scale-105"
                    >
                        {isLoginView ? t('auth_login_button') : t('auth_signup_button')}
                    </button>
                </form>
                
                <p className="text-center text-sm text-amazon-light mt-6">
                    {isLoginView ? t('auth_no_account') : t('auth_has_account')}
                    <button
                        onClick={() => {
                            setIsLoginView(!isLoginView);
                            setUsername('');
                            setPassword('');
                        }}
                        className="font-bold text-amazon-accent hover:underline ml-2"
                    >
                        {isLoginView ? t('auth_signup_link') : t('auth_login_link')}
                    </button>
                </p>
            </div>
        </div>
    </div>
  );
};

export default Auth;