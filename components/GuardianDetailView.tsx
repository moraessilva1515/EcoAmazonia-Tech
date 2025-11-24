import React, { useState, useEffect, useCallback } from 'react';
import type { Guardian, LocalizedGameStage } from '../types';
import JigsawPuzzle from './JigsawPuzzle';
import LoadingSpinner from './LoadingSpinner';
import WordSearch from './WordSearch';
import Riddle from './Riddle';
import MemoryGame from './MemoryGame';
import SumaumaAdventure from './SumaumaAdventure';
import RiverCleanupGame from './RiverCleanupGame';
import AnimalRescueGame from './AnimalRescueGame';
import WordScrambleGame from './WordScrambleGame';
import TermoGame from './TermoGame';
import InteractiveQuizGame from './InteractiveQuizGame';
import { useLanguage } from '../LanguageContext';

interface GuardianDetailViewProps {
    guardian: Guardian;
    onBack: () => void;
    userProgress: number; 
    onStageComplete: (guardianId: number, stage: number, points: number) => void;
}

type ViewState = 'loading' | 'story' | 'game' | 'stage_complete' | 'final_complete';

const GuardianDetailView: React.FC<GuardianDetailViewProps> = ({ guardian, onBack, userProgress, onStageComplete }) => {
    const { language, t } = useLanguage();
    const [currentStage, setCurrentStage] = useState(userProgress + 1);
    const [view, setView] = useState<ViewState>('loading');
    const [randomizedGameData, setRandomizedGameData] = useState<any | null>(null);

    const activity: LocalizedGameStage | undefined = guardian.activities[currentStage - 1];
    
    const randomizeTermoWord = useCallback(() => {
        if (activity && activity.type === 'termo' && activity.data.wordList) {
            const list = activity.data.wordList;
            const randomWordData = list[Math.floor(Math.random() * list.length)];
            setRandomizedGameData(randomWordData);
        }
    }, [activity]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (userProgress >= guardian.activities.length) {
                setView('final_complete');
            } else if (userProgress === 0 && currentStage === 1) {
                setView('story');
            } else {
                setView('game');
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [userProgress, currentStage, guardian.activities.length]);
    
     useEffect(() => {
        if (view === 'game' && activity) {
            if (activity.type === 'wordsearch' && activity.data.wordSets) {
                const sets = activity.data.wordSets;
                const randomSet = sets[Math.floor(Math.random() * sets.length)];
                setRandomizedGameData(randomSet);
            } else if (activity.type === 'termo' && activity.data.wordList) {
                randomizeTermoWord();
            } else {
                setRandomizedGameData(null);
            }
        }
    }, [view, activity, randomizeTermoWord]);

    const handleNextStage = () => {
        setCurrentStage(prev => prev + 1);
        setView('game');
    };

    const handleGameComplete = () => {
        if (!activity) return;

        if (activity.type === 'educationalAdventure') {
            const totalPoints = guardian.activities.reduce((sum, act) => sum + act.points, 0);
            onStageComplete(guardian.id, guardian.activities.length, totalPoints);
            setView('final_complete');
            return;
        }

        onStageComplete(guardian.id, activity.stage, activity.points);
        const isFinalStage = currentStage >= guardian.activities.length;

        // Special handling for Word Scramble to skip intermediate screen
        if (activity.type === 'wordScramble') {
            if (isFinalStage) {
                onStageComplete(guardian.id, currentStage, guardian.finalReward);
                setView('final_complete');
            } else {
                handleNextStage();
            }
            return;
        }

        // Default handling for other games
        if (isFinalStage) {
            onStageComplete(guardian.id, currentStage, guardian.finalReward);
            setView('final_complete');
        } else {
            setView('stage_complete');
        }
    };

    const renderGame = () => {
        if (!activity) return null;
        switch (activity.type) {
            case 'puzzle':
                const puzzleImageUrl = activity.data.imageUrl || guardian.image;
                return <JigsawPuzzle imageUrl={puzzleImageUrl} onComplete={handleGameComplete} grid={activity.data.grid} />;
            case 'wordsearch':
                const wordsToUse = randomizedGameData ? randomizedGameData[language] : (activity.data.words ? activity.data.words[language] : []);
                if (wordsToUse.length === 0) return <div className="flex justify-center p-8"><LoadingSpinner /></div>;
                return <WordSearch words={wordsToUse} gridSize={activity.data.size} onComplete={handleGameComplete} />;
            case 'riddle':
                return <Riddle riddle={activity.data.riddle[language]} answer={activity.data.answer[language]} onComplete={handleGameComplete} />;
            case 'memory':
                const words = activity.data.words ? activity.data.words[language] : [];
                return <MemoryGame words={words} onComplete={handleGameComplete} />;
            case 'wordScramble':
                return <WordScrambleGame sentence={activity.data.sentence[language]} onComplete={handleGameComplete} />;
            case 'educationalAdventure':
                return <SumaumaAdventure questData={activity.data} onComplete={handleGameComplete} />;
            case 'rivercleanup':
                return <RiverCleanupGame data={activity.data} onComplete={handleGameComplete} />;
            case 'animalRescue':
                return <AnimalRescueGame data={activity.data} onComplete={handleGameComplete} />;
             case 'termo':
                if (!randomizedGameData) return <div className="flex justify-center p-8"><LoadingSpinner /></div>;
                const wordData = {
                    word: randomizedGameData.word[language],
                    hint: randomizedGameData.hint[language]
                };
                return <TermoGame wordData={wordData} onComplete={handleGameComplete} onFailAndRetry={randomizeTermoWord} />;
            case 'interactiveQuiz':
                return <InteractiveQuizGame onComplete={handleGameComplete} />;
            default:
                return <p>Tipo de jogo desconhecido.</p>;
        }
    };

    const renderContent = () => {
        switch(view) {
            case 'loading':
                return <div className="flex justify-center items-center h-96"><LoadingSpinner /></div>;
            case 'story':
                return (
                    <div className="flex flex-col md:flex-row gap-8 items-center animate-fade-in">
                        <img src={guardian.image} alt={guardian.name[language]} className="w-full md:w-1/3 h-auto object-cover rounded-lg shadow-lg" />
                        <div className="md:w-2/3">
                            <p className="text-lg text-amazon-text/90 leading-relaxed mb-6">{guardian.story[language]}</p>
                            <button onClick={() => setView('game')} className="w-full py-3 bg-amazon-accent text-amazon-dark font-bold rounded-lg text-lg hover:bg-white transition-all transform hover:scale-105">
                                {t('gdetail_start_journey')}
                            </button>
                        </div>
                    </div>
                );
            case 'game':
                if (!activity) return null;
                return (
                    <div className="animate-fade-in text-center">
                        <h3 className="text-2xl font-bold text-white mb-1">{t('gdetail_stage_title', activity.stage, activity.title[language])}</h3>
                        <p className="mb-4 text-lg text-amazon-light">{activity.instructions[language]}</p>
                        {renderGame()}
                    </div>
                );
            case 'stage_complete':
                if (!activity) return null;
                return (
                     <div className="animate-fade-in text-center flex flex-col items-center p-8">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-amazon-accent mb-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <h3 className="text-3xl font-bold text-white">{t('gdetail_stage_complete_title', activity.stage)}</h3>
                        <p className="text-xl text-amazon-accent mt-2">{t('gdetail_stage_complete_points', activity.points)}</p>
                        <button onClick={handleNextStage} className="mt-8 px-8 py-3 bg-amazon-accent text-amazon-dark font-bold rounded-lg hover:bg-white transition-colors">
                            {t('gdetail_next_stage')}
                        </button>
                    </div>
                );
            case 'final_complete':
                 return (
                    <div className="animate-fade-in text-center flex flex-col items-center p-8">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-amazon-accent mb-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <h3 className="text-3xl font-bold text-white">{t('gdetail_journey_complete')}</h3>
                        <p className="text-xl text-amazon-accent mt-2">{t('gdetail_final_reward', guardian.finalReward)}</p>
                        <div className="mt-6 p-4 border-l-4 border-amazon-accent bg-amazon-dark/40 rounded-r-lg max-w-2xl">
                            <p className="text-xl italic text-amazon-text/90">"{guardian.finalQuote[language]}"</p>
                        </div>
                        <button onClick={onBack} className="mt-8 px-8 py-3 bg-amazon-accent text-amazon-dark font-bold rounded-lg hover:bg-white transition-colors">
                            {t('gdetail_return_guardians')}
                        </button>
                    </div>
                );
        }
    };

    return (
        <div className="bg-amazon-medium/50 backdrop-blur-sm rounded-lg shadow-2xl max-w-5xl mx-auto p-4 sm:p-6 md:p-8 animate-fade-in">
            <div className="relative mb-6">
                <button onClick={onBack} className="absolute -top-2 -left-2 sm:top-0 sm:left-0 z-10 flex items-center gap-2 px-4 py-2 bg-amazon-dark/50 hover:bg-amazon-light/50 text-amazon-text rounded-full transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    {t('gdetail_back')}
                </button>
                <h2 className="text-4xl md:text-5xl font-bold text-center text-amazon-accent">{guardian.name[language]}</h2>
            </div>
            {renderContent()}
        </div>
    );
};

export default GuardianDetailView;