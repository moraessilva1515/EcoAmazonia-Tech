import React, { useState, useEffect, useMemo } from 'react';

interface WordScrambleGameProps {
  sentence: string;
  onComplete: () => void;
}

type DragState = {
    word: string;
    fromIndex: number;
    fromSource: 'pool' | 'solution';
}

const WordScrambleGame: React.FC<WordScrambleGameProps> = ({ sentence, onComplete }) => {
    const correctWords = useMemo(() => sentence.split(' '), [sentence]);
    
    const [wordPool, setWordPool] = useState<string[]>([]);
    const [solutionSlots, setSolutionSlots] = useState<(string | null)[]>([]);
    const [dragState, setDragState] = useState<DragState | null>(null);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        const words = [...correctWords];
        let shuffledWords;
        // Ensure the shuffled array is different from the correct one
        do {
            shuffledWords = words.sort(() => Math.random() - 0.5);
        } while (shuffledWords.join(' ') === sentence);
        
        setWordPool(shuffledWords);
        setSolutionSlots(Array(words.length).fill(null));
        setFeedback(null);
    }, [sentence, correctWords]);

    const handleDragStart = (word: string, fromIndex: number, fromSource: 'pool' | 'solution') => {
        setDragState({ word, fromIndex, fromSource });
        setIsDragging(true);
    };

    const handleDragEnd = () => {
        setIsDragging(false);
        setDragState(null);
    }
    
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (toIndex: number, toSource: 'solution' | 'pool') => {
        if (!dragState) return;
        
        const { word, fromIndex, fromSource } = dragState;
        const newSolution = [...solutionSlots];
        let newPool = [...wordPool];
        
        // Moving from POOL to SOLUTION
        if (fromSource === 'pool' && toSource === 'solution') {
            const wordAtTarget = newSolution[toIndex];
            newSolution[toIndex] = word;
            newPool.splice(fromIndex, 1);
            if(wordAtTarget) {
                newPool.push(wordAtTarget);
            }
        }
        // Moving from SOLUTION to POOL
        else if (fromSource === 'solution' && toSource === 'pool') {
            newSolution[fromIndex] = null;
            newPool.push(word);
        }
        // Moving from SOLUTION to SOLUTION (reordering)
        else if (fromSource === 'solution' && toSource === 'solution') {
            const wordAtTarget = newSolution[toIndex];
            newSolution[toIndex] = word;
            newSolution[fromIndex] = wordAtTarget;
        }

        setSolutionSlots(newSolution);
        setWordPool(newPool.sort(() => Math.random() - 0.5)); // Re-shuffle pool for fun
        setDragState(null);
    };

    const checkSolution = () => {
        const userAnswer = solutionSlots.join(' ');
        if (userAnswer === sentence) {
            setFeedback('correct');
            setTimeout(onComplete, 1500);
        } else {
            setFeedback('incorrect');
            setTimeout(() => setFeedback(null), 1500);
        }
    };

    const allSlotsFilled = solutionSlots.every(slot => slot !== null);
    let solutionContainerClass = "border-amazon-dark/50";
    if (feedback === 'correct') solutionContainerClass = "border-green-500";
    if (feedback === 'incorrect') solutionContainerClass = "border-red-500 animate-shake";

    return (
        <div className="flex flex-col items-center gap-8 w-full max-w-2xl mx-auto">
            {/* Solution Area */}
            <div className={`w-full p-4 bg-amazon-dark/30 rounded-lg border-2 transition-colors duration-500 ${solutionContainerClass}`}>
                <div className="flex flex-wrap gap-2 justify-center min-h-[5rem]">
                    {solutionSlots.map((word, index) => (
                        <div
                            key={index}
                            onDrop={() => handleDrop(index, 'solution')}
                            onDragOver={handleDragOver}
                            className="h-12 flex-grow bg-amazon-dark/40 rounded-md border-2 border-dashed border-amazon-light/20"
                        >
                            {word && (
                                <button
                                    draggable
                                    onDragStart={() => handleDragStart(word, index, 'solution')}
                                    onDragEnd={handleDragEnd}
                                    className="w-full h-full px-4 py-2 bg-amazon-medium rounded-md font-bold text-lg cursor-grab active:cursor-grabbing"
                                >
                                    {word}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Word Pool Area */}
            <div 
                className="w-full p-4 bg-amazon-medium/30 rounded-lg min-h-[6rem]"
                onDrop={() => handleDrop(0, 'pool')}
                onDragOver={handleDragOver}
            >
                <div className="flex flex-wrap gap-2 justify-center">
                    {wordPool.map((word, index) => (
                        <button
                            key={`${word}-${index}`}
                            draggable
                            onDragStart={() => handleDragStart(word, index, 'pool')}
                            onDragEnd={handleDragEnd}
                            className="px-4 py-2 bg-amazon-medium rounded-md font-bold text-lg cursor-grab active:cursor-grabbing hover:bg-amazon-light/50 transition-colors"
                        >
                            {word}
                        </button>
                    ))}
                </div>
            </div>

            {/* Action Button */}
            <div className="w-full mt-4">
                 {feedback && (
                    <p className={`text-center font-bold mb-4 animate-fade-in ${feedback === 'correct' ? 'text-green-400' : 'text-red-400'}`}>
                        {feedback === 'correct' ? 'Mensagem decifrada!' : 'Tente novamente!'}
                    </p>
                )}
                <button
                    onClick={checkSolution}
                    disabled={!allSlotsFilled || feedback === 'correct'}
                    className="w-full py-3 bg-amazon-accent text-amazon-dark font-bold rounded-lg text-lg hover:bg-white transition-all transform hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:scale-100"
                >
                    Verificar
                </button>
            </div>
        </div>
    );
};

export default WordScrambleGame;