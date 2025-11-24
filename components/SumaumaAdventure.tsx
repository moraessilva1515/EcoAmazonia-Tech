import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import type { LocalizedString } from '../types';

interface Option {
    text: LocalizedString;
    correct: boolean;
    feedback: LocalizedString;
}

interface MiniGame {
    type: 'choice' | 'quiz';
    question: LocalizedString;
    options: Option[];
}

interface Phase {
    element: LocalizedString;
    title: LocalizedString;
    intro: LocalizedString;
    background: string;
    minigame: MiniGame;
}

interface SumaumaAdventureProps {
    questData: {
        phases: Phase[];
    };
    onComplete: () => void;
}

type GameState = 'intro' | 'playing' | 'feedback' | 'outro';

const SumaumaAdventure: React.FC<SumaumaAdventureProps> = ({ questData, onComplete }) => {
    const { language, t } = useLanguage();
    const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
    const [vitality, setVitality] = useState(100);
    const [seeds, setSeeds] = useState(0);
    const [gameState, setGameState] = useState<GameState>('intro');
    const [feedback, setFeedback] = useState({ correct: false, text: '' });
    
    const currentPhase = questData.phases[currentPhaseIndex];

    const handleOptionClick = (option: Option) => {
        if (gameState !== 'playing') return;

        setFeedback({ correct: option.correct, text: option.feedback[language] });
        if (option.correct) {
            setSeeds(s => s + 10);
        } else {
            setVitality(v => Math.max(0, v - 20));
        }
        setGameState('feedback');
    };

    const handleNext = () => {
        if (currentPhaseIndex < questData.phases.length - 1) {
            setCurrentPhaseIndex(i => i + 1);
            setGameState('intro');
        } else {
            // Quest complete
            onComplete();
        }
    }

    useEffect(() => {
      if (vitality <= 0) {
        // Game over logic could be added here, for now it just depletes
      }
    }, [vitality]);

    const renderContent = () => {
        switch (gameState) {
            case 'intro':
                return (
                    <div className="text-center animate-fade-in">
                        <h3 className="text-3xl font-bold text-amazon-accent mb-2">{currentPhase.title[language]}</h3>
                        <p className="text-lg mb-6 max-w-xl mx-auto">{currentPhase.intro[language]}</p>
                        <button onClick={() => setGameState('playing')} className="px-8 py-3 bg-amazon-accent text-amazon-dark font-bold rounded-lg text-lg hover:bg-white transition-all transform hover:scale-105">
                            {t('sumauma_start')}
                        </button>
                    </div>
                );
            case 'playing':
                return (
                    <div className="animate-fade-in max-w-2xl mx-auto">
                        <p className="text-xl text-center font-semibold mb-4">{currentPhase.minigame.question[language]}</p>
                        <div className="space-y-3">
                            {currentPhase.minigame.options.map(opt => (
                                <button key={opt.text.pt} onClick={() => handleOptionClick(opt)} className="w-full text-left p-4 bg-amazon-medium hover:bg-amazon-light/50 rounded-lg transition-colors text-lg">
                                    {opt.text[language]}
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 'feedback':
                return (
                     <div className="animate-fade-in max-w-2xl mx-auto text-center">
                        <h3 className={`text-3xl font-bold mb-3 ${feedback.correct ? 'text-green-400' : 'text-red-400'}`}>
                            {feedback.correct ? t('sumauma_wise_choice') : t('sumauma_be_careful')}
                        </h3>
                        <p className="text-lg bg-amazon-dark/30 p-4 rounded-md">{feedback.text}</p>
                        <button onClick={handleNext} className="mt-6 px-8 py-3 bg-amazon-accent text-amazon-dark font-bold rounded-lg text-lg hover:bg-white transition-all transform hover:scale-105">
                           {currentPhaseIndex < questData.phases.length - 1 ? t('sumauma_next_mission') : t('sumauma_finish_journey')}
                        </button>
                    </div>
                )
            default:
                return null;
        }
    }

    return (
        <div className="relative rounded-lg w-full min-h-[500px] flex flex-col transition-all duration-1000 overflow-hidden" style={{backgroundImage: `url(${currentPhase.background})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
            <div className="absolute inset-0 bg-black/70 rounded-lg"></div>
            
            {/* HUD */}
            <div className="relative z-10 w-full p-4">
                <div className="flex justify-between items-center w-full">
                    {/* Vitality Bar */}
                    <div className="w-1/3">
                        <span className="text-sm font-bold text-amazon-light">{t('sumauma_vitality')}</span>
                         <div className="bg-amazon-dark/50 rounded-full h-4 overflow-hidden mt-1">
                            <div className="bg-green-500 h-full rounded-full transition-all duration-500" style={{width: `${vitality}%`}}></div>
                        </div>
                    </div>
                    {/* Phase Title */}
                     <div className="text-center px-2">
                        <span className="text-2xl font-bold text-white tracking-widest uppercase">{currentPhase.element[language]}</span>
                    </div>
                    {/* Seeds Counter */}
                    <div className="w-1/3 text-right">
                        <span className="text-sm font-bold text-amazon-light">{t('sumauma_seeds')}</span>
                        <div className="flex items-center justify-end gap-2 mt-1">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amazon-accent" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M11.68 1.5c-.32 0-.641.042-.951.125a9.011 9.011 0 0 0-6.195 4.331 9 9 0 0 0-.67 6.471 9.004 9.004 0 0 0 4.255 6.004A9.004 9.004 0 0 0 12 22.5a9.004 9.004 0 0 0 8.875-7.075 9 9 0 0 0-.67-6.471 9.011 9.011 0 0 0-6.195-4.331A8.913 8.913 0 0 0 12 4.5a13.682 13.682 0 0 1-1.218-4.992c.287-.008.576-.008.898-.008ZM19.5 12a7.5 7.5 0 0 1-15 0 7.478 7.478 0 0 1 .69-3.043 7.5 7.5 0 0 1 13.62 0A7.478 7.478 0 0 1 19.5 12Z" />
                            </svg>
                            <span className="text-2xl font-bold">{seeds}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="relative z-10 w-full flex-grow flex flex-col justify-center items-center p-4 sm:p-8">
                 {renderContent()}
            </div>
        </div>
    );
};

export default SumaumaAdventure;