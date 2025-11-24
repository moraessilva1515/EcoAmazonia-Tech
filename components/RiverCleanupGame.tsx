import React, { useState, useEffect, useMemo } from 'react';
import type { LocalizedString } from '../types';
import { useLanguage } from '../LanguageContext';

type ItemType = 'plastic' | 'organic' | 'metal' | 'paper';
interface Item {
    id: number;
    name: string;
    type: ItemType;
}
interface RiverCleanupGameProps {
    data: {
        items: Item[];
        tip: LocalizedString;
    };
    onComplete: () => void;
}

// SVG icons for waste items
const itemIcons: { [key: string]: React.ReactNode } = {
    'Garrafa de Plástico': <svg viewBox="0 0 24 24" fill="none" stroke="#87CEEB" strokeWidth="2"><path d="M8 3h8v2H8zM9 5v13a2 2 0 002 2h2a2 2 0 002-2V5H9zM8 5a2 2 0 00-2 2v0a2 2 0 002 2h8a2 2 0 002-2v0a2 2 0 00-2-2H8z" /></svg>,
    'Casca de Banana': <svg viewBox="0 0 24 24" fill="none" stroke="#FFD700" strokeWidth="2"><path d="M4 12c0 4.418 3.582 8 8 8s8-3.582 8-8-3.582-8-8-8-8 3.582-8 8zM12 2v2M12 20v2M4.929 4.929l1.414 1.414M17.657 17.657l1.414 1.414M2 12h2M20 12h2M4.929 19.071l1.414-1.414M17.657 6.343l1.414-1.414" /></svg>,
    'Lata de Alumínio': <svg viewBox="0 0 24 24" fill="none" stroke="#C0C0C0" strokeWidth="2"><rect x="7" y="3" width="10" height="18" rx="2" /><path d="M7 6h10M7 18h10" /></svg>,
    'Jornal Velho': <svg viewBox="0 0 24 24" fill="none" stroke="#A0522D" strokeWidth="2"><path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H4a2 2 0 00-2 2v16a2 2 0 002 2zM8 7h8M8 12h8M8 17h4" /></svg>,
    // Add more SVGs for other items if needed, or use a default one
};
const defaultIcon = <svg viewBox="0 0 24 24" fill="#FFFFFF"><circle cx="12" cy="12" r="10" /></svg>;

const Bin: React.FC<{ type: ItemType, onDrop: (item: Item) => void, children: React.ReactNode }> = ({ type, onDrop, children }) => {
    const [isOver, setIsOver] = useState(false);
    return (
        <div 
            onDragOver={(e) => { e.preventDefault(); setIsOver(true); }}
            onDragLeave={() => setIsOver(false)}
            onDrop={(e) => {
                e.preventDefault();
                setIsOver(false);
                const item = JSON.parse(e.dataTransfer.getData('item'));
                onDrop(item);
            }}
            className={`w-24 h-24 sm:w-28 sm:h-28 rounded-lg flex flex-col items-center justify-center transition-all duration-200 ${isOver ? 'bg-amazon-accent/30 scale-110' : 'bg-amazon-dark/50'}`}
        >
            {children}
        </div>
    );
}

const RiverCleanupGame: React.FC<RiverCleanupGameProps> = ({ data, onComplete }) => {
    const { language } = useLanguage();
    const [riverItems, setRiverItems] = useState(data.items);
    const [feedback, setFeedback] = useState<{ type: 'correct' | 'incorrect', message: string } | null>(null);
    const positions = useMemo(() => riverItems.map(() => ({
        top: `${Math.random() * 70 + 15}%`,
        left: `${Math.random() * 70 + 15}%`,
        transform: `rotate(${Math.random() * 360}deg)`
    })), [data.items]); // Only calculate once per stage
    
    useEffect(() => {
        if (riverItems.length === 0) {
            setTimeout(() => onComplete(), 1500);
        }
    }, [riverItems, onComplete]);

    const handleDrop = (droppedItem: Item, binType: ItemType) => {
        if (droppedItem.type === binType) {
            setRiverItems(prev => prev.filter(item => item.id !== droppedItem.id));
            setFeedback({ type: 'correct', message: 'Bom trabalho!' });
        } else {
            setFeedback({ type: 'incorrect', message: `Ops! ${droppedItem.name} não vai aí.` });
        }
        setTimeout(() => setFeedback(null), 1500);
    };

    const isComplete = riverItems.length === 0;

    return (
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-center w-full">
            <div className={`relative w-full lg:w-2/3 aspect-square rounded-lg transition-colors duration-1000 ${isComplete ? 'bg-blue-400/50' : 'bg-yellow-900/50'} overflow-hidden shadow-inner`}>
                {riverItems.map((item, index) => (
                    <div
                        key={item.id}
                        draggable
                        onDragStart={(e) => e.dataTransfer.setData('item', JSON.stringify(item))}
                        className="absolute w-12 h-12 sm:w-16 sm:h-16 cursor-grab active:cursor-grabbing hover:scale-125 transition-transform p-1"
                        style={positions[index]}
                    >
                        {itemIcons[item.name] || defaultIcon}
                        <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-[10px] px-1 rounded whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">{item.name}</span>
                    </div>
                ))}
                {feedback && (
                    <div className={`absolute top-2 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg font-bold text-white animate-fade-in ${feedback.type === 'correct' ? 'bg-green-500' : 'bg-red-500'}`}>
                        {feedback.message}
                    </div>
                )}
                 {isComplete && (
                    <div className="absolute inset-0 flex items-center justify-center animate-fade-in">
                        <p className="text-3xl font-bold text-white bg-black/50 px-6 py-3 rounded-lg">Rio Limpo!</p>
                    </div>
                )}
            </div>
            <div className="w-full lg:w-1/3 p-4 bg-amazon-dark/30 rounded-lg flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                    <Bin type="plastic" onDrop={(item) => handleDrop(item, 'plastic')}>
                        <svg className="w-10 h-10 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3h8v2H8zM9 5v13a2 2 0 002 2h2a2 2 0 002-2V5H9zM8 5a2 2 0 00-2 2v0a2 2 0 002 2h8a2 2 0 002-2v0a2 2 0 00-2-2H8z" /></svg>
                        <span className="text-sm font-bold mt-1 text-blue-300">Plástico</span>
                    </Bin>
                     <Bin type="metal" onDrop={(item) => handleDrop(item, 'metal')}>
                        <svg className="w-10 h-10 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="7" y="3" width="10" height="18" rx="2" /><path d="M7 6h10M7 18h10" /></svg>
                        <span className="text-sm font-bold mt-1 text-gray-300">Metal</span>
                    </Bin>
                     <Bin type="paper" onDrop={(item) => handleDrop(item, 'paper')}>
                        <svg className="w-10 h-10 text-amber-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H4a2 2 0 00-2 2v16a2 2 0 002 2zM8 7h8M8 12h8M8 17h4" /></svg>
                        <span className="text-sm font-bold mt-1 text-amber-100">Papel</span>
                    </Bin>
                     <Bin type="organic" onDrop={(item) => handleDrop(item, 'organic')}>
                        <svg className="w-10 h-10 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" /><path d="M15.5 10c-1.93 0-3.5 1.57-3.5 3.5S13.57 17 15.5 17s3.5-1.57 3.5-3.5-1.57-3.5-3.5-3.5zm-7 0c-1.93 0-3.5 1.57-3.5 3.5S6.57 17 8.5 17s3.5-1.57 3.5-3.5-1.57-3.5-3.5-3.5z" /></svg>
                        <span className="text-sm font-bold mt-1 text-green-300">Orgânico</span>
                    </Bin>
                </div>
                <div className="mt-4 p-3 bg-amazon-medium/40 rounded-lg text-center">
                    <p className="text-sm italic text-amazon-light">"{data.tip[language]}"</p>
                    <p className="text-xs text-right mt-1 text-amazon-accent">- Iara</p>
                </div>
            </div>
        </div>
    );
};

export default RiverCleanupGame;