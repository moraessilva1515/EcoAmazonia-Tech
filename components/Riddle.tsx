import React, { useState } from 'react';

interface RiddleProps {
    riddle: string;
    answer: string | string[];
    onComplete: () => void;
}

const Riddle: React.FC<RiddleProps> = ({ riddle, answer, onComplete }) => {
    const [userAnswer, setUserAnswer] = useState('');
    const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');

    const checkAnswer = (e: React.FormEvent) => {
        e.preventDefault();
        const formattedUserAnswer = userAnswer.trim().toUpperCase();
        
        const isCorrect = Array.isArray(answer)
            ? answer.some(a => a.toUpperCase() === formattedUserAnswer)
            : answer.toUpperCase() === formattedUserAnswer;

        if (isCorrect) {
            setStatus('correct');
            setTimeout(onComplete, 1500);
        } else {
            setStatus('incorrect');
            setTimeout(() => setStatus('idle'), 1500);
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6 bg-amazon-dark/40 rounded-lg">
            <p className="text-xl italic text-center text-amazon-text/90 mb-6">"{riddle}"</p>
            <form onSubmit={checkAnswer}>
                <input 
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Sua resposta..."
                    disabled={status === 'correct'}
                    className="w-full px-4 py-3 bg-amazon-dark/60 rounded-md border border-amazon-light/20 focus:ring-2 focus:ring-amazon-accent focus:border-amazon-accent outline-none transition text-center text-lg"
                />
                <button
                    type="submit"
                    disabled={status === 'correct' || !userAnswer}
                    className="w-full mt-4 py-3 bg-amazon-accent text-amazon-dark font-bold rounded-lg text-lg hover:bg-white transition-all transform hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:scale-100"
                >
                    Confirmar
                </button>
            </form>
            {status === 'correct' && (
                <p className="text-center text-green-400 font-bold mt-4 animate-fade-in">Correto! Você desvendou o enigma.</p>
            )}
            {status === 'incorrect' && (
                <p className="text-center text-red-400 font-bold mt-4 animate-fade-in">Não foi desta vez. Tente novamente!</p>
            )}
        </div>
    );
};

export default Riddle;