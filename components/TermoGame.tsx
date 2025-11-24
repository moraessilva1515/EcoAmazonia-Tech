import React, { useState, useEffect, useCallback } from 'react';

interface TermoGameProps {
    wordData: {
        word: string;
        hint: string;
    };
    onComplete: () => void;
    onFailAndRetry: () => void;
}

type GameState = 'playing' | 'won' | 'lost';
type TileStatus = 'correct' | 'present' | 'absent' | 'empty';

const TermoGame: React.FC<TermoGameProps> = ({ wordData, onComplete, onFailAndRetry }) => {
    const [guesses, setGuesses] = useState<string[]>(['', '']);
    const [statuses, setStatuses] = useState<TileStatus[][]>([Array(5).fill('empty'), Array(5).fill('empty')]);
    const [currentAttempt, setCurrentAttempt] = useState(0);
    const [gameState, setGameState] = useState<GameState>('playing');
    const [isRevealing, setIsRevealing] = useState(false);
    const [shake, setShake] = useState(false);

    const targetWord = wordData.word.toUpperCase();

    const resetGame = useCallback(() => {
        setGuesses(['', '']);
        setStatuses([Array(5).fill('empty'), Array(5).fill('empty')]);
        setCurrentAttempt(0);
        setGameState('playing');
        setIsRevealing(false);
        setShake(false);
    }, []);

    useEffect(() => {
        resetGame();
    }, [wordData, resetGame]);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (gameState !== 'playing' || isRevealing) return;
        
        const currentGuess = guesses[currentAttempt];

        if (e.key === 'Backspace') {
            setGuesses(g => {
                const newGuesses = [...g];
                newGuesses[currentAttempt] = newGuesses[currentAttempt].slice(0, -1);
                return newGuesses;
            });
        } else if (e.key === 'Enter') {
            if (currentGuess.length === 5) {
                handleSubmit();
            } else {
                setShake(true);
                setTimeout(() => setShake(false), 500);
            }
        } else if (currentGuess.length < 5 && /^[a-zA-Z]$/.test(e.key)) {
            setGuesses(g => {
                const newGuesses = [...g];
                newGuesses[currentAttempt] += e.key.toUpperCase();
                return newGuesses;
            });
        }
    }, [guesses, currentAttempt, gameState, isRevealing]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    const handleSubmit = () => {
        const guess = guesses[currentAttempt];
        if (guess.length !== 5) return;

        setIsRevealing(true);
        const newStatuses: TileStatus[] = Array(5).fill('absent');
        const targetArray = targetWord.split('');
        const guessArray = guess.split('');

        // Check for correct letters (green)
        guessArray.forEach((letter, i) => {
            if (targetArray[i] === letter) {
                newStatuses[i] = 'correct';
                targetArray[i] = '_';
            }
        });

        // Check for present letters (yellow)
        guessArray.forEach((letter, i) => {
            if (newStatuses[i] !== 'correct') {
                const charIndex = targetArray.indexOf(letter);
                if (charIndex > -1) {
                    newStatuses[i] = 'present';
                    targetArray[charIndex] = '_';
                }
            }
        });

        setTimeout(() => {
            setStatuses(s => {
                const newS = [...s];
                newS[currentAttempt] = newStatuses;
                return newS;
            });

            setTimeout(() => {
                setIsRevealing(false);
                if (guess === targetWord) {
                    setGameState('won');
                    setTimeout(onComplete, 2000);
                } else if (currentAttempt === 1) {
                    setGameState('lost');
                } else {
                    setCurrentAttempt(1);
                }
            }, 5 * 300); // Wait for all tiles to flip
        }, 100);
    };

    const getTileClass = (status: TileStatus, letter: string) => {
        let baseClass = 'w-14 h-14 sm:w-16 sm:h-16 border-2 flex items-center justify-center text-3xl font-bold uppercase transition-all duration-500 [transform-style:preserve-3d]';
        
        if (status !== 'empty') {
            baseClass += ' [transform:rotateX(180deg)]';
        }
        
        switch (status) {
            case 'correct': return `${baseClass} bg-green-600 border-green-500 text-white`;
            case 'present': return `${baseClass} bg-yellow-500 border-yellow-400 text-white`;
            case 'absent': return `${baseClass} bg-gray-700 border-gray-600 text-white`;
            default: return `${baseClass} ${letter ? 'border-amazon-light' : 'border-amazon-light/40'} bg-amazon-dark/50`;
        }
    }

    return (
        <div className="flex flex-col items-center gap-4 w-full max-w-md mx-auto">
             <div className="p-4 bg-amazon-dark/30 rounded-lg text-center">
                <p className="text-sm font-bold text-amazon-accent uppercase">Dica</p>
                <p className="text-lg italic text-white">"{wordData.hint}"</p>
            </div>
            <div className={`grid grid-rows-2 gap-2 [perspective:1000px] ${shake ? 'animate-shake' : ''}`}>
                {guesses.map((guess, attemptIndex) => (
                    <div key={attemptIndex} className="grid grid-cols-5 gap-2">
                        {Array(5).fill(0).map((_, i) => {
                             const letter = guess[i] || '';
                             const status = statuses[attemptIndex][i];
                             const animationDelay = `${i * 150}ms`;
                             return (
                                <div key={i} className={getTileClass(status, letter)} style={{ transitionDelay: isRevealing && currentAttempt === attemptIndex ? animationDelay : '0ms' }}>
                                    <div className="absolute [backface-visibility:hidden]">{letter}</div>
                                    <div className="absolute [transform:rotateX(180deg)] [backface-visibility:hidden]">{letter}</div>
                                </div>
                             )
                        })}
                    </div>
                ))}
            </div>
            <div className="text-center mt-4 h-20">
                {gameState === 'won' && (
                    <p className="text-green-400 text-xl font-bold animate-fade-in">Correto! A palavra era {targetWord}.</p>
                )}
                {gameState === 'lost' && (
                    <div className="animate-fade-in">
                        <p className="text-red-400 text-lg font-bold">Fim de jogo! A palavra era {targetWord}.</p>
                        <button onClick={onFailAndRetry} className="mt-2 px-6 py-2 bg-amazon-light text-amazon-dark font-bold rounded-lg hover:bg-white transition-colors">
                            Tentar com uma nova palavra
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TermoGame;
