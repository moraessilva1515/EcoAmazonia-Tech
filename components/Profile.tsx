import React, { useState, useRef } from 'react';
import type { User } from '../types';
import { useLanguage } from '../LanguageContext';

interface ProfileProps {
    user: User;
    onUpdateUser: (updatedUser: User) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdateUser }) => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState<User>(user);
    const [successMessage, setSuccessMessage] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadstart = () => setIsUploading(true);
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, photo: reader.result as string }));
                setIsUploading(false);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdateUser(formData);
        setSuccessMessage(t('profile_success_message'));
        setTimeout(() => setSuccessMessage(''), 3000);
    };
    
    const triggerFileSelect = () => fileInputRef.current?.click();

    return (
        <div className="p-6 md:p-8 bg-amazon-medium/50 rounded-lg shadow-2xl backdrop-blur-sm max-w-4xl mx-auto animate-fade-in">
            <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-amazon-accent">{t('profile_title')}</h2>
                <p className="text-lg mt-2 text-amazon-text/80">{t('profile_subtitle')}</p>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                {/* Photo Column */}
                <div className="flex flex-col items-center md:col-span-1">
                    <label className="block text-sm font-medium text-amazon-text/80 mb-2">{t('profile_photo_label')}</label>
                    <div className="relative w-48 h-48 rounded-full bg-amazon-dark/50 flex items-center justify-center overflow-hidden border-2 border-amazon-light/20">
                        {formData.photo ? (
                            <img src={formData.photo} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-amazon-light/50" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                        )}
                        {isUploading && (
                            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                                <p className="text-white">{t('profile_uploading_photo')}</p>
                            </div>
                        )}
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handlePhotoChange}
                        accept="image/*"
                        className="hidden"
                        required={!formData.photo}
                    />
                    <button type="button" onClick={triggerFileSelect} className="mt-4 px-4 py-2 bg-amazon-dark/80 rounded-md text-sm hover:bg-amazon-light/50 transition-colors">
                        {t('profile_change_photo')}
                    </button>
                </div>

                {/* Info Column */}
                <div className="md:col-span-2 space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-amazon-text/80 mb-1">{t('profile_name_label')}</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name || ''}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 bg-amazon-dark/60 rounded-md border border-amazon-light/20 focus:ring-2 focus:ring-amazon-accent focus:border-amazon-accent outline-none transition"
                        />
                    </div>
                     <div>
                        <label htmlFor="email" className="block text-sm font-medium text-amazon-text/80 mb-1">{t('profile_email_label')}</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email || ''}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 bg-amazon-dark/60 rounded-md border border-amazon-light/20 focus:ring-2 focus:ring-amazon-accent focus:border-amazon-accent outline-none transition"
                        />
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-amazon-text/80 mb-1">{t('profile_phone_label')}</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone || ''}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 bg-amazon-dark/60 rounded-md border border-amazon-light/20 focus:ring-2 focus:ring-amazon-accent focus:border-amazon-accent outline-none transition"
                        />
                    </div>
                    <div>
                        <label htmlFor="birthdate" className="block text-sm font-medium text-amazon-text/80 mb-1">{t('profile_birthdate_label')}</label>
                        <input
                            type="date"
                            id="birthdate"
                            name="birthdate"
                            value={formData.birthdate || ''}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 bg-amazon-dark/60 rounded-md border border-amazon-light/20 focus:ring-2 focus:ring-amazon-accent focus:border-amazon-accent outline-none transition [color-scheme:dark]"
                        />
                    </div>
                </div>
                
                {/* Submit Button */}
                <div className="md:col-span-3 text-center mt-4">
                     {successMessage && (
                        <p className="text-green-400 mb-4 animate-fade-in">{successMessage}</p>
                    )}
                    <button
                        type="submit"
                        className="w-full md:w-auto px-10 py-3 bg-amazon-accent text-amazon-dark font-bold rounded-lg text-lg hover:bg-white transition-all transform hover:scale-105"
                    >
                        {t('profile_save_button')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Profile;
