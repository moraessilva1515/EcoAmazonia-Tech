import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../LanguageContext';
import { generateRiverQuizQuestion } from '../services/geminiService';
import type { RiverQuizQuestion, RiverQuizOption } from '../types';
import LoadingSpinner from './LoadingSpinner';

const Boto: React.FC<{ visible: boolean }> = ({ visible }) => (
    <svg viewBox="0 0 100 50" className={`absolute w-24 h-12 transition-all duration-1000 ease-in-out ${visible ? 'opacity-100' : 'opacity-0'}`} style={{ top: '50%', left: '10%', transform: visible ? 'translateX(0)' : 'translateX(-100px)'}}>
        <path d="M 20,25 C 20,10 50,10 50,25 S 80,40 80,25 C 80,10 95,15 95,25 S 80,45 60,35 C 40,25 20,40 20,25 Z" fill="#FFB6C1" />
        <circle cx="55" cy="23" r="1" fill="black" />
    </svg>
);
const Ariranha: React.FC<{ visible: boolean }> = ({ visible }) => (
    <svg viewBox="0 0 100 40" className={`absolute w-28 h-10 transition-all duration-1000 ease-in-out ${visible ? 'opacity-100' : 'opacity-0'}`} style={{ top: '20%', left: '60%', transform: visible ? 'translateX(0)' : 'translateX(100px)'}}>
        <path d="M 10,20 C 20,10 40,10 50,15 S 70,25 80,20 C 90,15 95,20 95,20 L 90,25 C 80,30 60,30 50,25 S 20,30 10,20 Z" fill="#8B4513" />
        <circle cx="20" cy="18" r="1" fill="white" />
    </svg>
);
const Peixe: React.FC<{ visible: boolean }> = ({ visible }) => (
     <svg viewBox="0 0 50 50" className={`absolute w-16 h-16 transition-all duration-1000 ease-in-out ${visible ? 'opacity-100' : 'opacity-0'}`} style={{ top: '65%', left: '75%', transform: visible ? 'translateY(0)' : 'translateY(50px)' }}>
        <path d="M 10,25 C 20,15 35,15 40,25 C 35,35 20,35 10,25 Z" fill="#FFA500" />
        <path d="M 40,25 L 48,20 L 48,30 Z" fill="#FF4500" />
        <circle cx="18" cy="23" r="1.5" fill="black" />
    </svg>
);

interface InteractiveQuizProps {
    onComplete: () => void;
}

const InteractiveQuizGame: React.FC<InteractiveQuizProps> = ({ onComplete }) => {
    const { language, t } = useLanguage();
    const [currentQuestion, setCurrentQuestion] = useState<RiverQuizQuestion | null>(null);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState<{ correct: boolean, text: string } | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const totalRounds = 3;
    const isComplete = score === totalRounds;

    const fetchQuestion = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const question = await generateRiverQuizQuestion(language);
            if (question) {
                setCurrentQuestion(question);
            } else {
                setError(t('quiz_error_loading'));
            }
        } catch (e) {
            setError(t('quiz_error_fetching'));
        } finally {
            setLoading(false);
        }
    }, [language, t]);

    useEffect(() => {
        fetchQuestion();
    }, [fetchQuestion]);

    useEffect(() => {
        if (isComplete) {
            setTimeout(() => onComplete(), 3000);
        }
    }, [isComplete, onComplete]);

    const handleAnswer = (option: RiverQuizOption) => {
        if (isAnswered) return;

        setIsAnswered(true);
        const isCorrect = option.correct;
        
        if (isCorrect) {
            setScore(s => s + 1);
            setFeedback({ correct: true, text: currentQuestion!.feedback });
        } else {
            setFeedback({ correct: false, text: t('quiz_incorrect_feedback_generic') });
        }

        setTimeout(() => {
            if (score + (isCorrect ? 1 : 0) < totalRounds) {
                setIsAnswered(false);
                setFeedback(null);
                fetchQuestion();
            }
        }, 2500);
    };

    const pollutionOpacity = 1 - (score / totalRounds);

    if (loading && !currentQuestion) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-amazon-medium/50 rounded-lg min-h-[400px]">
                <LoadingSpinner />
                <p className="mt-4 text-lg text-amazon-accent">{t('quiz_generating')}</p>
            </div>
        );
    }
    
    if (error) {
         return (
            <div className="text-center p-8 bg-red-900/50 rounded-lg min-h-[400px]">
                <p className="text-xl text-white">{error}</p>
                <button onClick={fetchQuestion} className="mt-4 px-6 py-2 bg-amazon-accent text-amazon-dark font-bold rounded-lg hover:bg-white transition-colors">
                    {t('quiz_try_again')}
                </button>
            </div>
        );
    }
    
    if (!currentQuestion) return null;

    return (
        <div className="flex flex-col items-center gap-4 w-full max-w-2xl mx-auto">
            <div className="relative w-full h-48 sm:h-64 rounded-lg bg-sky-400 overflow-hidden shadow-inner">
                {/* Pollution Layer */}
                <div className="absolute inset-0 bg-[#654321] transition-opacity duration-1000" style={{ opacity: pollutionOpacity }}></div>
                 {/* Clean Water Layer */}
                <div className="absolute inset-0 bg-blue-500 transition-opacity duration-1000" style={{ opacity: 1 - pollutionOpacity }}></div>
                {/* Animals */}
                <Boto visible={isComplete} />
                <Ariranha visible={isComplete} />
                <Peixe visible={isComplete} />
                
                 {isComplete && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 animate-fade-in">
                        <h3 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-lg">{t('quiz_congrats_title')}</h3>
                        <p className="text-md sm:text-lg text-white mt-2 text-center px-4">{t('quiz_congrats_message')}</p>
                    </div>
                )}
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-amazon-dark/30 rounded-full h-2.5">
                <div className="bg-blue-400 h-2.5 rounded-full transition-all duration-500" style={{ width: `${(score / totalRounds) * 100}%` }}></div>
            </div>

            {/* Quiz Area */}
            <div className="w-full p-4 bg-amazon-dark/40 rounded-lg min-h-[220px] flex flex-col justify-center">
                {!isComplete && !feedback && (
                    <div className="animate-fade-in">
                        <p className="text-center text-lg font-semibold mb-4">{currentQuestion.question}</p>
                        <div className="grid grid-cols-1 gap-3">
                            {currentQuestion.options.map(opt => (
                                <button
                                    key={opt.text}
                                    onClick={() => handleAnswer(opt)}
                                    disabled={isAnswered}
                                    className="w-full text-center p-3 bg-amazon-medium hover:bg-amazon-light/50 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {opt.text}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                {feedback && (
                    <div className="text-center animate-fade-in">
                        <h3 className={`text-2xl font-bold mb-3 ${feedback.correct ? 'text-green-400' : 'text-red-400'}`}>
                            {feedback.correct ? 'Correto!' : 'Incorreto'}
                        </h3>
                        <p>{feedback.text}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InteractiveQuizGame;